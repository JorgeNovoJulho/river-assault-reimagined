const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
(async()=>{
  const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{stdio:'pipe'});
  let browser;
  try{
    let ready=false;
    for(let i=0;i<80;i++){
      try{if((await fetch('http://127.0.0.1:4173/')).ok){ready=true;break}}catch{}
      await new Promise(r=>setTimeout(r,250));
    }
    assert.ok(ready,'Vite preview indisponível');
    browser=await chromium.launch({headless:true,executablePath:process.env.RIVER_CHROME||undefined});
    for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
      const page=await browser.newPage({viewport,isMobile:viewport.width<600,hasTouch:viewport.width<600});
      await page.addInitScript(()=>{
        if(localStorage.getItem('river_aircraft_credits_v1')===null)localStorage.setItem('river_aircraft_credits_v1','40000');
      });
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
      await page.locator('#mode-single').waitFor({state:'visible',timeout:15000});
      assert.equal(await page.locator('#rs-premium-pilots').count(),0,'Tela de pilotos não deve montar antes do clique');
      const opening=await page.evaluate(()=>{const r=document.getElementById('mode-selection').getBoundingClientRect();return {width:r.width,height:r.height,screenWidth:innerWidth,screenHeight:innerHeight,legacy:getComputedStyle(document.getElementById('start-main')).display}});
      if(opening.width<opening.screenWidth-5||opening.height<opening.screenHeight-5||opening.legacy!=='none')throw Error('Abertura reduzida ou hangar legado visivel: '+JSON.stringify(opening));
      await page.waitForFunction(()=>Number.parseFloat(document.getElementById('mode-selection').style.getPropertyValue('--rs-art-width'))>0);
      const hotspots=await page.evaluate(()=>{
        const css=document.getElementById('mode-selection').style;
        const read=key=>Number.parseFloat(css.getPropertyValue('--rs-art-'+key));
        return ['mode-single','mode-multi','mode-settings','rs-menu-featured-pilot'].map(id=>{
          const box=document.getElementById(id).getBoundingClientRect();
          return [(box.left-read('left'))/read('width'),(box.top-read('top'))/read('height'),
            box.width/read('width'),box.height/read('height')];
        });
      });
      const artRegions=[[.032,.323,.359,.111],[.032,.438,.359,.111],[.032,.55,.359,.111],[.664,.151,.308,.551]];
      for(const [i,box] of hotspots.entries())for(const [j,value] of box.entries()){
        assert.ok(Math.abs(value-artRegions[i][j])<.005,'Hotspot fora da arte: '+i+' '+box.join(','));
      }
      const unlockMusic=page.locator('#menu-theme-play');
      await page.waitForFunction(()=>!document.getElementById('menu-theme-audio').paused||
        !document.getElementById('menu-theme-play').hidden);
      if(await unlockMusic.isVisible())await unlockMusic.click();
      await page.waitForFunction(()=>!document.getElementById('menu-theme-audio').paused);
      await page.locator('#mode-multi').click();
      await page.locator('#mode-multi-info').waitFor({state:'visible'});
      await page.locator('#mode-multi-back').click();
      await page.locator('#mode-settings').click();
      const settings=page.locator('#controller-settings');
      await settings.waitFor({state:'visible'});
      assert.ok(await settings.evaluate(el=>el.contains(document.elementFromPoint(18,18))),
        'Configurações precisam ficar acima da abertura');
      const shop=page.locator('#settings-plane');
      for(const id of ['pioneira','cruzada','valquiria','colosso']){
        await shop.selectOption(id);
        assert.match(await shop.locator('option:checked').textContent(),/10000 pontos/);
        assert.match(await page.locator('#settings-plane-specs').textContent(),/Blindagem.*Dano.*Bônus/);
      }
      await shop.selectOption('pioneira');
      await page.locator('#settings-buy-plane').click();
      assert.match(await page.locator('#settings-wallet').textContent(),/30000 pontos/);
      await page.locator('#pad-close').click();
      await page.locator('#mode-single').click({timeout:12000});
      const selection=page.locator('#rs-premium-pilots');
      await selection.waitFor({state:'visible',timeout:10000});
      assert.equal(await page.locator('#rs-premium-pilot-cards button').count(),8,'Sete aeronaves originais e a especial comprada');
      const isolation=await page.evaluate(()=>({old:getComputedStyle(document.getElementById('mode-selection')).display,selectionRect:document.getElementById('rs-premium-pilots').getBoundingClientRect().toJSON(),vw:innerWidth,vh:innerHeight}));
      assert.equal(isolation.old,'none','Tela anterior continua visivel na selecao');
      assert.ok(isolation.selectionRect.width>=isolation.vw-3&&isolation.selectionRect.height>=isolation.vh-3,'Selecao deve cobrir toda a viewport');

      const visible=await selection.evaluate(el=>({display:getComputedStyle(el).display,visibility:getComputedStyle(el).visibility,pointer:getComputedStyle(el).pointerEvents,rect:el.getBoundingClientRect().toJSON()}));
      assert.notEqual(visible.display,'none');
      assert.equal(visible.visibility,'visible');
      assert.notEqual(visible.pointer,'none');
      const first=page.locator('#rs-premium-pilot-cards button').first();
      await first.click();
      await first.dblclick({delay:90});
      const tutorial=page.locator('#rs-flight-tutorial');
      await tutorial.waitFor({state:'visible'});
      assert.equal(await page.evaluate(()=>gameState),'START');
      if(viewport.width<600){
        await page.locator('#rs-tutorial-skip').click();
      }else{
        await page.locator('#rs-tutorial-view').click();
        assert.equal(await page.locator('#rs-tutorial-windows').getAttribute('aria-pressed'),'true');
        assert.equal(await page.locator('.rs-tutorial-command svg').count(),8);
        assert.ok(await page.locator('.rs-tutorial-command p').first().evaluate(node=>parseFloat(getComputedStyle(node).fontSize)>=16));
        assert.match(await page.locator('#rs-tutorial-commands').textContent(),/W A S D.*Botão esquerdo do mouse/);
        await page.locator('#rs-tutorial-mobile').click();
        assert.match(await page.locator('#rs-tutorial-commands').textContent(),/Alavanca na tela.*TIRO/);
        await page.locator('#rs-tutorial-start').click();
      }
      await page.waitForFunction(()=>gameState==='PLAYING');
      assert.equal(await page.evaluate(()=>localStorage.getItem('riverstorm_flight_tutorial_v1')),'1');
      assert.equal(await tutorial.isVisible(),false);
      await page.keyboard.press('p');
      await page.locator('#pause-settings-btn').click();
      await page.locator('#rs-tutorial-settings').click();
      await tutorial.waitFor({state:'visible'});
      assert.equal(await page.locator('#rs-tutorial-start').isVisible(),false);
      assert.equal(await page.locator('#rs-tutorial-'+(viewport.width<600?'mobile':'windows')).getAttribute('aria-pressed'),'true');
      await page.keyboard.press('Escape');
      await tutorial.waitFor({state:'hidden'});
      assert.equal(await page.locator('#controller-settings').isVisible(),true);
      assert.equal(await page.evaluate(()=>gameState),'PAUSED');
      const graphics=page.locator('#graphics-preview-toggle');
      assert.equal(await graphics.isVisible(),true);
      const graphicsBefore=await graphics.textContent();
      await graphics.click();
      assert.notEqual(await graphics.textContent(),graphicsBefore);
      await graphics.click();
      await page.locator('#pad-close').click();
      assert.equal(await graphics.isVisible(),false);
      await page.locator('#resume-btn').click();
      const state=await page.evaluate(()=>({game:typeof gameState==='undefined'?'UNKNOWN':gameState,overlay:document.getElementById('rs-premium-pilots')?.classList.contains('hidden'),error:document.getElementById('runtime-error')?.textContent||''}));
      console.log('Premium end-to-end',JSON.stringify({viewport,visible,state,errors}));
      assert.equal(state.game,'PLAYING','Duplo clique não entrou na campanha');
      assert.equal(state.overlay,true,'Seleção permaneceu sobre a campanha');
      assert.equal(state.error,'','Erro de runtime ao iniciar');
      assert.deepEqual(errors,[],'Exceções JS detectadas');
      const renderCheck=await page.evaluate(()=>{const c=document.getElementById('gameCanvas'),style=getComputedStyle(c);return {fit:style.objectFit,mode:style.imageRendering,ratio:c.width/c.height,logical:400/600}});
      assert.equal(renderCheck.fit,'fill','Canvas deve ocupar toda a area cuja largura logica acompanha o HUD');
      const aspect=await page.evaluate(()=>{const c=document.getElementById('gameCanvas'),r=c.getBoundingClientRect();return {backing:c.width/c.height,display:r.width/r.height,width:r.width,screen:innerWidth}});
      console.log('Canvas aspect diagnostic',JSON.stringify({viewport,aspect}));
      assert.ok(Math.abs(aspect.backing-aspect.display)<0.012,'Proporcao do backing store nao acompanha largura exibida');
      for(let level=1;level<=20;level++){
        await page.waitForFunction(sector=>{
          const sprites=window.RiverPremium;
          return window.RiverPremiumEnvironment.ready(sector)&&
            sprites.get('terrain','TARGET',sector)&&sprites.get('terrain','ARMED_ISLAND',sector)&&
            sprites.get('terrain','BRIDGE',sector)&&sprites.get('terrain','DAM',sector)&&sprites.get('enemy','MEGAZORD',sector)&&
            sprites.get('enemy',['TUCANO','CRANE','SCORPION','ALLIGATOR','CORSAIR','WALRUS','MANTIS','MOTOJET','SALAMANDER','EAGLE','DREDGER','HOVERCAR','PIRANHA','ICE_RAY','BEETLE','PRISM_WASP','WELDER','NARWHAL','EEL','HYBRID_HUNTER'][sector-1],sector)&&sprites.get('pickup','GAS',sector);
        },level);
        const calls=await page.evaluate(level=>{
          const previous={sector,enemies,islands,structures,fuelDepots};
          const result=[];
          const target=window.RiverPremium.get('terrain','TARGET',level);
          const context=document.getElementById('gameCanvas').getContext('2d');
          const drawImage=context.drawImage;
          context.drawImage=function(image,...args){
            result.push({target:image===target&&args[1]<100,path:image.getAttribute?.('src')||'',source:image.naturalWidth/image.naturalHeight,
              destination:args.length===4?args[2]/args[3]:null,width:args.length===4?args[2]:null,height:args.at(-1)});
            return drawImage.call(this,image,...args);
          };
          try{
            sector=level;
            const x=VIRTUAL_WIDTH/2;
            const biomeId=['TUCANO','CRANE','SCORPION','ALLIGATOR','CORSAIR','WALRUS','MANTIS','MOTOJET','SALAMANDER','EAGLE','DREDGER','HOVERCAR','PIRANHA','ICE_RAY','BEETLE','PRISM_WASP','WELDER','NARWHAL','EEL','HYBRID_HUNTER'][level-1];
            enemies=[
              {type:'BIOME_ENEMY',biomeId,terrainObstacle:true,terrainName:TERRAIN_OBJECTS[level-1],x:x-35,y:100,width:35,height:32,hp:7,maxHp:14},
              {type:'BIOME_ENEMY',biomeId,x:x+35,y:170,width:34,height:34,hp:5,maxHp:5},
              {type:'MEGAZORD',x,y:250,width:82,height:95,hp:150,maxHp:150}
            ];
            for(const type of ['DRONE','HELI','JET','TURRET','TANK','MECHA_SWORD','MECHA_GUN','SHIP','SUB','FLOATING_MINE','ITEM_CAPSULE'])enemies.push({type,x:x+75,y:100,width:24,height:24,hp:2,maxHp:2});
            if(level>=3)enemies.push({type:'BOSS',bossId:level,name:'Boss Premium',x,y:460,width:128,height:74,
              hp:100,maxHp:100,turretLeftHp:20,turretRightHp:20});
            islands=[{x:x-65,y:300,width:56,height:68,shape:0}];
            structures=[{type:'BRIDGE',x,y:355,width:180,height:22,opening:100,hp:18,maxHp:18},{type:'DAM',x,y:420,width:180,height:35,opening:100,hp:35,maxHp:35}];
            fuelDepots=[{x,y:405}];
            render();
            return result;
          }finally{
            ({sector,enemies,islands,structures,fuelDepots}=previous);
            context.drawImage=drawImage;
          }
        },level);
        const expected=[
          ['roots.png','island.png','01_tucano/idle_000.png'],
          ['container.png','dock.png','02_crane/idle_000.png'],
          ['target.png','island.png','03_scorpion/idle_000.png','boss.png'],
          ['target.png','island.png','04_alligator/idle_000.png','boss.png'],
          ['target.png','island.png','05_corsair/idle_000.png','boss.png'],
          ['target.png','island.png','06_walrus/idle_000.png','boss.png'],
          ['target.png','island.png','07_mantis/idle_000.png','boss.png'],
          ['target.png','island.png','08_motojet/idle_000.png','boss.png'],
          ['island.png','09_salamander/idle_000.png','boss.png'],
          ['target.png','island.png','10_eagle/idle_000.png','boss.png'],
          ['island.png','11_dredger/idle_000.png','boss.png'],
          ['target.png','island.png','12_hovercar/idle_000.png','boss.png'],
          ['target.png','island.png','13_piranha/idle_000.png','boss.png'],
          ['target.png','island.png','14_ice_ray/idle_000.png','boss.png'],
          ['target.png','island.png','15_beetle/idle_000.png','boss.png'],
          ['target.png','island.png','16_prism_wasp/idle_000.png','boss.png'],
          ['dock.png','island.png','17_welder/idle_000.png','boss.png'],
          ['target.png','island.png','18_narwhal/idle_000.png','boss.png'],
          ['target.png','island.png','19_eel/idle_000.png','boss.png'],
          ['target.png','island.png','20_hybrid_hunter/idle_000.png','boss.png']
        ][level-1];
        for(const name of [...expected,'bridge.png','gas.png','megazord.png']){
          assert.ok(calls.some(call=>call.path.endsWith(name)),'Sprite ausente no quadro: '+name);
        }
        assert.ok(!calls.some(call=>call.path.endsWith('.svg')),'SVG desenhado na missão '+level);
        const target=calls.find(call=>call.target);
        assert.ok(target&&Math.abs(Math.max(target.width/54,target.height/64)-1)<1e-8,
          'Alvo destrutível fora da escala do jogador na missão '+level);
        const unique=calls.find(call=>/\/enemies\/exclusive\//.test(call.path));
        assert.ok(unique&&Math.abs(Math.max(unique.width/54,unique.height/64)-1)<1e-8,
          'Inimigo exclusivo fora da escala do jogador na missão '+level);
        const scales=[['/runtime/drone.png',5],['/runtime/heli.png',1.875],['/elite_fighter/idle_000.png',2.5],['/floating_turret/idle_000.png',1.5],['/tank/idle_000.png',2],
          ['/mecha_sword/idle_000.png',2],['/mecha_gun/idle_000.png',2],
          ['/runtime/ship.png',2],['/submarine/idle_000.png',2],['/runtime/mine.png',1],['/item_capsule/idle_000.png',1]];
        for(const [path,scale] of scales){
          const sprite=calls.find(call=>call.path.endsWith(path));
          assert.ok(sprite,'Inimigo ausente: '+path);
          assert.ok(Math.abs(Math.max(sprite.width/54,sprite.height/64)-scale)<1e-8,'Escala do inimigo: '+path);
          assert.ok(Math.abs(sprite.source-sprite.destination)<1e-8,'Inimigo esticado: '+path);
        }
        assert.ok(calls.some(call=>call.path.endsWith('/runtime/bridge.png')&&call.height===66),
          'Ponte precisa desenhar com o triplo da espessura original');
        assert.ok(calls.some(call=>/\/runtime\/(dam|floodgate)\.png$/.test(call.path)&&call.height===105),
          'Represa precisa desenhar com o triplo da espessura original');
        if(level>=3){
          const boss=calls.find(call=>call.path.endsWith('/runtime/boss.png'));
          assert.ok(Math.max(boss.width,boss.height)>=200,'Chefe precisa ocupar uma parte ampla da arena');
          assert.ok(Math.abs(boss.source-boss.destination)<1e-8,'Arte do chefe esticada');
        }
        if(level>=2){
          const folder=[null,null,'mission_02_industrial','mission_03_desert','mission_04_swamp','mission_05_islands','mission_06_arctic','mission_07_jungle','mission_08_city','mission_09_volcanic','mission_10_alpine','mission_11_valley','mission_12_neon','mission_13_delta','mission_14_glacial','mission_15_oasis','mission_16_bioluminescent','mission_17_shipyard','mission_18_arctic','mission_19_electric','mission_20_final'][level];
          for(const name of ['water.png','bank_left.png','bank_right.png']){
            const tiles=calls.filter(call=>call.path.includes(folder+'/')&&call.path.endsWith(name));
            assert.ok(tiles.length,'Textura do cenário ausente: '+name);
            assert.ok(tiles.every(tile=>Math.abs(tile.source-tile.destination)<1e-8),'Textura esticada: '+name);
          }
        }
        console.log('Premium raster scene',JSON.stringify({viewport,level,sprites:expected}));
      }
      const bossFire=await page.evaluate(()=>{
        const previous=enemyBullets;
        const previousPlayerX=player.x,previousPlayerY=player.y;
        try{
          player.x=VIRTUAL_WIDTH/2;player.y=420;
          return Array.from({length:20},(_,index)=>{
            const profile=bossBurstProfile(index+1);
            const boss={x:VIRTUAL_WIDTH/2,y:110};
            const bursts=Array.from({length:5},()=>{
              enemyBullets=[];
              fireBossBurst(boss,profile,'EMP');
              return enemyBullets.map(({x,y,vx,vy})=>[x,y,vx,vy]);
            });
            const routeTests=[16,VIRTUAL_WIDTH/2,VIRTUAL_WIDTH-16].flatMap(x=>{
              player.x=x;
              const gapCenter=Math.max(profile.gap,Math.min(VIRTUAL_WIDTH-profile.gap,player.x));
              boss.burstIndex=2;
              enemyBullets=[];
              fireBossBurst(boss,profile,'EMP');
              return enemyBullets.map(bullet=>{
                let {x,y}=bullet;
                for(let tick=0;y<player.y&&tick<400;tick++){
                  x+=bullet.vx+Math.sin(tick*.12+bullet.phase)*.45;
                  y+=bullet.vy;
                }
                return y>=player.y&&Math.abs(x-gapCenter)>30;
              });
            });
            player.x=VIRTUAL_WIDTH/2;
            return {profile,bursts,playerX:player.x,playerY:player.y,routeTests};
          });
        }finally{enemyBullets=previous;player.x=previousPlayerX;player.y=previousPlayerY;}
      });
      for(const [index,{profile,bursts,playerX,playerY,routeTests}] of bossFire.entries()){
        assert.ok(routeTests.every(Boolean),'O corredor de esquiva deve permanecer aberto na onda serpenteante');
        assert.equal(new Set(bursts.map(burst=>JSON.stringify(burst))).size,5);
        for(const burst of bursts){
          assert.equal(burst.length,4);
          assert.ok(burst.every(([x,y,vx,vy])=>vy>0&&Math.abs(x+(playerY-y)*vx/vy-playerX)>=profile.gap/2-1e-8),
            'A rajada precisa deixar abertura na altura da nave');
        }
        if(index){
          const previous=bossFire[index-1].profile;
          assert.ok(profile.cadence<previous.cadence&&profile.speed>previous.speed&&profile.gap<previous.gap);
        }
      }
      await page.evaluate(()=>{
        levelSelector.value='5';
        planeSelect.value='vespa';
        enterGameplay();
        togglePause();
      });
      await page.locator('#pause-exit-btn').click();
      const featured=page.locator('#rs-menu-featured-pilot');
      assert.match(await featured.getAttribute('aria-label'),/missão 5 com Ed Jhow · VESPA/i);
      await page.reload({waitUntil:'domcontentloaded'});
      assert.match(await featured.getAttribute('aria-label'),/missão 5 com Ed Jhow · VESPA/i);
      assert.match(await page.locator('#rs-menu-featured-photo').getAttribute('src'),/jhow_vespa/);
      await featured.click();
      assert.deepEqual(await page.evaluate(()=>({sector,plane:player.aircraftType,state:gameState,verified:campaignVerified})),
        {sector:5,plane:'vespa',state:'PLAYING',verified:false});
      await page.evaluate(()=>{rememberPendingMission(true);gameState='VICTORY';});
      await page.reload({waitUntil:'domcontentloaded'});
      assert.ok(await featured.isDisabled(),'Missão concluída não deve ser retomável');
      assert.match(await page.locator('#rs-menu-featured-photo').getAttribute('src'),/jhow_vespa/);
      await page.locator('#mode-single').click();
      const cards=page.locator('#rs-premium-pilot-cards button').filter({has:page.locator('strong')});
      const regular=await cards.evaluateAll(buttons=>buttons.slice(0,7).map(button=>[
        button.querySelector('strong').textContent,button.querySelector('small').textContent
      ]));
      assert.deepEqual(regular,[['T. Snabo','FALCÃO'],['Ed Jhow','VESPA'],['B. Tata','COMETA'],['S. Napas','FÊNIX'],
        ['G. Casper','ÁGUIA VTOL'],['R. Roger','AURORA'],['L. Dudu','TITAN']]);
      const colors=await page.locator('.rs-pilot-track span').evaluateAll(bars=>bars.map(bar=>getComputedStyle(bar).backgroundImage));
      assert.equal(new Set(colors).size,4);
      assert.ok(colors.every(color=>color.includes('linear-gradient')));
      const briefingArt=await page.locator('#rs-premium-pilots').evaluate(async screen=>{
        const url=getComputedStyle(screen).backgroundImage.match(/url\("([^"]+)"\)/)?.[1];
        if(!url)return null;
        const image=new Image();image.src=url;await image.decode();
        return {url,width:image.naturalWidth};
      });
      assert.match(briefingArt.url,/briefing-bay/);
      assert.ok(briefingArt.width>=1000);
      const nx=page.locator('[data-aircraft=pioneira]');
      assert.match(await nx.textContent(),/JON ARDENT.*PIONEIRA NX/);
      assert.equal(await page.locator('[data-aircraft=cruzada]').count(),0);
      await nx.locator('img').first().evaluate(image=>image.decode());
      await nx.click();
      assert.match(await page.locator('.rs-pilot-default-weapon').textContent(),/Pulso de Fase NX/);
      await nx.dblclick({delay:90});
      await page.waitForFunction(()=>gameState==='PLAYING'&&player.aircraftType==='pioneira');
      await page.waitForFunction(()=>window.RiverPremium.aircraft('pioneira','disparo'));
      assert.equal(await page.locator('#hud-pilot-name').textContent(),'CAP. JON ARDENT');
      const hudStates=await page.evaluate(()=>{
        const hits=missionHits[sector-1],shield=player.shield,invulnerable=player.invulnerable;
        const button=document.getElementById('parry-btn');
        const observer=new MutationObserver(()=>{});
        observer.observe(button,{childList:true});
        parryTicks=120;parryCooldown=240;
        drawHUD();
        const active=button.textContent;
        observer.takeRecords();
        drawHUD();drawHUD();
        const redundantChanges=observer.takeRecords().length;
        observer.disconnect();
        parryTicks=0;
        drawHUD();
        const recharge=button.textContent;
        parryCooldown=0;
        player.invulnerable=0;
        applyDamage(10,'TESTE');
        drawHUD();
        const ready=button.textContent,damage=document.getElementById('hud-mission-damage').textContent;
        player.shield=shield;player.invulnerable=invulnerable;missionHits[sector-1]=hits;
        return {active,recharge,ready,damage,hits,redundantChanges};
      });
      assert.equal(hudStates.active,'ESCUDO 2s');
      assert.equal(hudStates.recharge,'PARRY [V] · RECARGA 4s');
      assert.equal(hudStates.ready,'PARRY [V] · PRONTO');
      assert.equal(hudStates.redundantChanges,0);
      assert.match(hudStates.damage,new RegExp('DANOS RECEBIDOS '+(hudStates.hits+1)+' · RANK [SABCDE]+'));
      await page.waitForFunction(()=>window.RiverPremium.get('pickup','SOS',sector));
      const rescue=await page.evaluate(()=>{
        const saved={distance,rescueBoatsLastAt,rescueBoats,islands,structures,fuelDepots,powerups,enemies};
        const drawImage=ctx.drawImage;
        const random=Math.random;
        try{
          distance=missionStartDistance+480;rescueBoatsLastAt=null;
          rescueBoats=[];islands=[];structures=[];fuelDepots=[];powerups=[];enemies=[];
          Math.random=()=>.99;
          spawnMapEntities(-110,VIRTUAL_WIDTH/2,VIRTUAL_WIDTH*.65);
          const spawned=rescueBoats.length;
          spawnMapEntities(-110,VIRTUAL_WIDTH/2,VIRTUAL_WIDTH*.65);
          let spriteHeight=0;
          ctx.drawImage=function(image,...args){
            if(image===window.RiverPremium.get('pickup','SOS',sector))spriteHeight=args[3];
          };
          drawRescueBoats();
          return {spawned,spaced:rescueBoats.length===1,spriteHeight};
        }finally{
          ({distance,rescueBoatsLastAt,rescueBoats,islands,structures,fuelDepots,powerups,enemies}=saved);
          ctx.drawImage=drawImage;Math.random=random;
        }
      });
      assert.deepEqual(rescue,{spawned:1,spaced:true,spriteHeight:80});
      const contacts=await page.evaluate(()=>{
        const saved={rescueBoats,score,rescuedSoldiers};
        try{
          rescueBoats=[{x:player.x,y:player.y-35-player.currentScrollSpeed,soldiers:3,phase:0}];
          const distantRescue=rescueBoatReached({x:player.x+33,y:player.y});
          const helicopter={x:player.x,y:player.y,width:24,height:24};
          const hullContact=enemyHullTouchesPlayer(helicopter);
          helicopter.x+=44;
          const rotorOnly=enemyHullTouchesPlayer(helicopter);
          update();
          return {distantRescue,hullContact,rotorOnly,points:score-saved.score,
            soldiers:rescuedSoldiers-saved.rescuedSoldiers,remaining:rescueBoats.length};
        }finally{({rescueBoats,score,rescuedSoldiers}=saved);}
      });
      assert.deepEqual(contacts,{distantRescue:false,hullContact:true,rotorOnly:false,points:450,soldiers:3,remaining:0});
      const resumedDamage=await page.evaluate(()=>{
        missionHits[sector-1]=5;
        if(!saveActiveProgress())throw Error('Falha ao guardar os impactos da missão');
        const saved=readPendingMission().mission;
        enterGameplay(saved);
        showMissionReport();
        return {count:missionHits[sector-1], report:document.getElementById('mission-damage-report').textContent};
      });
      assert.equal(resumedDamage.count,5);
      assert.match(resumedDamage.report,/5 impactos recebidos — B/);
      assert.match(resumedDamage.report,/sem registro/);
      await page.evaluate(()=>{
        bossSkillUnlocked=Object.keys(BOSS_SKILLS);
        openBossSkillPicker();
      });
      const skill=page.getByRole('button',{name:/Pulso EMP/});
      const artwork=page.locator('#boss-skill-options img');
      assert.equal(await artwork.count(),9);
      await artwork.evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
      await page.locator('#boss-skill-picker').evaluate(async element=>{
        const background=getComputedStyle(element).backgroundImage.match(/url\("([^"]+)"\)/);
        if(!background)throw new Error('Imagem de fundo do Arsenal ausente');
        const image=new Image();
        image.src=background[1];
        await image.decode();
      });
      await skill.click();
      const actionsFit=await page.locator('#boss-skill-picker').evaluate(picker=>{
        const bounds=picker.querySelector('.rs-skill-shell').getBoundingClientRect();
        const confirm=picker.querySelector('#boss-skill-confirm').getBoundingClientRect();
        const options=picker.querySelector('#boss-skill-options');
        return confirm.bottom<=bounds.bottom&&options.scrollHeight<=options.clientHeight+1;
      });
      assert.ok(actionsFit,'Os botões do Arsenal devem caber na área visível');
      assert.equal(await skill.getAttribute('aria-pressed'),'true');
      await page.locator('#boss-skill-confirm').click();
      assert.ok(await page.evaluate(()=>bossActive&&bossSkillEquipped==='EMP'));
      const credited=await page.evaluate(()=>{
        journey=1;
        const points=[];
        for(let level=1;level<=20;level++){
          sector=level;enemies=[];bossDefeatedThisMission=false;
          missionHits[level-1]=[0,2,4][(level-1)%3];
          spawnBoss(0,true);
          const boss=enemies.find(enemy=>enemy.type==='BOSS');
          const before={score,bank};
          if(!creditBossDefeat(boss)||creditBossDefeat(boss))throw new Error('Crédito duplicado');
          points.push([score-before.score,bank-before.bank]);
        }
        return points;
      });
      assert.deepEqual(credited,Array.from({length:20},(_,i)=>{
        const payout=1240+i*240+(i%3===2?0:500);
        return [payout,payout];
      }));
      const debrief=await page.evaluate(()=>{
        sector=1;enemies=[];bossDefeatedThisMission=false;missionHits[0]=2;
        spawnBoss(0,true);
        finishBossDefeatedBySkill(enemies.find(enemy=>enemy.type==='BOSS'));
        const panel=document.getElementById('rs-boss-debrief');
        const text=panel.textContent;
        const canvas=ctx.fillText;
        let next=false;
        try{
          ctx.fillText=function(label,...args){if(label==='PRÓXIMA MISSÃO')next=true;return canvas.call(this,label,...args);};
          render();
          const before=next;
          missionTransitionTicks=181;update();render();
          return {text,before,after:next,hidden:panel.hidden};
        }finally{ctx.fillText=canvas;}
      });
      assert.match(debrief.text,/RANK S/);
      assert.match(debrief.text,/1\.240 pts/);
      assert.match(debrief.text,/500 pts/);
      assert.deepEqual([debrief.before,debrief.after,debrief.hidden],[false,true,true]);
      const beforeExit=await page.evaluate(()=>{
        sector=5;missionTransitionTicks=0;bossDefeatedThisMission=false;enemies=[];
        score+=327;togglePause();
        return {score,bank:bank+327};
      });
      await page.locator('#pause-exit-btn').click();
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator('#rs-menu-featured-pilot').click();
      assert.deepEqual(await page.evaluate(()=>({score,bank})),beforeExit);
      const beforeReload=await page.evaluate(()=>{score+=51;return {score,bank:bank+51};});
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator('#rs-menu-featured-pilot').click();
      assert.deepEqual(await page.evaluate(()=>({score,bank})),beforeReload);
      const finalAwards=await page.evaluate(()=>{
        sector=20;campaignVerified=true;missionHits=Array(20).fill(0);
        const before={score,bank};
        finishFullCampaign();
        finishFullCampaign();
        return {
          score:score-before.score,bank:bank-before.bank,
          campaigns:campaignTrophies().completed,medals:campaignTrophies().medals.gold,
          rows:document.querySelectorAll('#mission-damage-report .rs-damage-list div').length,
          final:document.getElementById('mission-damage-report').textContent,
          medal:document.getElementById('victory-medal').textContent,
          rank:document.getElementById('victory-rank-transition').textContent
        };
      });
      assert.equal(finalAwards.score,15000);
      assert.equal(finalAwards.bank,15000);
      assert.equal(finalAwards.campaigns,1);
      assert.equal(finalAwards.medals,1);
      assert.equal(finalAwards.rows,20);
      assert.match(finalAwards.final,/NOTA FINAL SS/);
      assert.match(finalAwards.medal,/OURO.*10\.000 pts/);
      assert.match(finalAwards.rank,/Cabo/);
      await page.reload({waitUntil:'domcontentloaded'});
      assert.equal(await page.evaluate(()=>journey),2,'Patente persiste após vencer a campanha');
      await page.locator('#mode-settings').click();
      await page.locator('#rs-trophy-room-open').click();
      const trophies=page.locator('#rs-trophy-room');
      assert.ok(await trophies.isVisible());
      assert.match(await trophies.locator('#rs-trophy-records').textContent(),/concluídas1.*Cabo.*última14.*SS · Missão 1/);
      assert.match(await trophies.locator('#rs-trophy-medals').textContent(),/Ouro1.*Prata0.*Bronze0/);
      await page.keyboard.press('Escape');
      assert.equal(await trophies.isVisible(),false);
      assert.equal(await page.locator('#controller-settings').isVisible(),true);
      await page.locator('#pad-close').click();
      const beforeReset=await page.evaluate(()=>({bank,journey}));
      await page.evaluate(()=>{levelSelector.value='1';planeSelect.value='falcao';enterGameplay();});
      assert.deepEqual(await page.evaluate(()=>({bank,journey,score})),{...beforeReset,score:0});
      const actualFlight=await page.evaluate(()=>{
        const result=[];
        for(const [id,plane] of Object.entries(aircraftCatalog.PLANES)){
          selectedPlane=id;
          resetGame();
          fireWeapon();
          const baseBullets=bullets.filter(shot=>shot.weaponId===plane.weapons[0]);
          const stats=aircraftCatalog.flightStats(id,journey);
          const fuelBefore=player.fuel;
          update();
          result.push({id,pilot:plane.pilotName,weapon:player.weapon,
            flight:player.speed===stats.speed&&player.maxShield===stats.shield&&
              player.fuelDepletionRate===stats.fuelRate&&player.fuel<fuelBefore,
            damage:baseBullets.reduce((sum,shot)=>sum+shot.damage,0)===stats.damage,
            range:baseBullets.every(shot=>shot.rangeRemaining<(aircraftCatalog.SIGNATURE_SHOTS[shot.weaponId]?.range??520))
          });
        }
        return result;
      });
      assert.equal(actualFlight.length,11);
      assert.ok(actualFlight.every(plane=>plane.flight&&plane.damage&&plane.range),JSON.stringify(actualFlight));
      assert.equal(actualFlight.find(plane=>plane.id==='valquiria').pilot,'Rick Storm');
      await page.close();
    }
    for(const viewport of [{width:320,height:568},{width:568,height:320},{width:844,height:390},{width:768,height:1024},{width:1024,height:768}]){
      const page=await browser.newPage({viewport,isMobile:true,hasTouch:true});
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
      await page.locator('#mode-settings').click();
      await page.locator('#rs-tutorial-settings').click();
      const guide=page.locator('#rs-flight-tutorial');
      assert.equal(await page.locator('#rs-tutorial-mobile').getAttribute('aria-pressed'),'true');
      assert.ok(await guide.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Guia excede largura '+JSON.stringify(viewport));
      assert.equal(await page.locator('.rs-tutorial-command svg').count(),8);
      await page.locator('#rs-tutorial-back').click();
      await page.locator('#pad-close').click();
      await page.evaluate(()=>enterGameplay());
      await page.locator('#rs-mobile-hud-toggle').click();
      const layout=await page.evaluate(()=>{
        const ids=['game-container','compact-hud','rs-bottom-actions','touch-controls'];
        const rect=id=>document.getElementById(id).getBoundingClientRect().toJSON();
        return {rects:ids.map(rect),width:innerWidth,height:innerHeight,
          statsInHUD:['hud-fusion-status','rs-fusion-meter','hud-mission-damage'].every(id=>document.getElementById(id).closest('.rs-hud-grid')),
          hudFits:document.getElementById('compact-hud').scrollWidth<=document.getElementById('compact-hud').clientWidth+1,
          graphicsVisible:document.getElementById('graphics-preview-toggle').getClientRects().length};
      });
      assert.ok(layout.statsInHUD&&layout.hudFits&&!layout.graphicsVisible,JSON.stringify({viewport,layout}));
      assert.ok(layout.rects.every(r=>r.x>=-1&&r.y>=-1&&r.right<=layout.width+1&&r.bottom<=layout.height+1&&r.width>0&&r.height>0),JSON.stringify({viewport,layout}));
      const [arena,hud]=layout.rects;
      if(viewport.width>viewport.height&&viewport.height<=560)assert.ok(arena.right<=hud.left+1);
      else assert.ok(arena.bottom<=hud.top+1);
      for(const id of ['#btn-fire','#btn-bomb','#btn-roll-left','#btn-roll-right','#btn-pause-touch']){
        const bounds=await page.locator(id).boundingBox();
        assert.ok(bounds&&bounds.width>=40&&bounds.height>=38,JSON.stringify({viewport,id,bounds}));
      }
      console.log('Mobile layout',JSON.stringify(viewport));
      await page.close();
    }
  }finally{await browser?.close();server.kill('SIGKILL');}
})().catch(e=>{console.error(e);process.exitCode=1});
