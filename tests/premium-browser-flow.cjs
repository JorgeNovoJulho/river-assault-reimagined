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
    browser=await chromium.launch({headless:true});
    for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
      const page=await browser.newPage({viewport,isMobile:viewport.width<600,hasTouch:viewport.width<600});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
      await page.locator('#mode-single').waitFor({state:'visible',timeout:15000});
      assert.equal(await page.locator('#rs-premium-pilots').count(),0,'Tela de pilotos não deve montar antes do clique');
      const opening=await page.evaluate(()=>{const r=document.getElementById('mode-selection').getBoundingClientRect();return {width:r.width,height:r.height,screenWidth:innerWidth,screenHeight:innerHeight,legacy:getComputedStyle(document.getElementById('start-main')).display}});
      if(opening.width<opening.screenWidth-5||opening.height<opening.screenHeight-5||opening.legacy!=='none')throw Error('Abertura reduzida ou hangar legado visivel: '+JSON.stringify(opening));
      await page.locator('#mode-single').click({timeout:12000});
      const selection=page.locator('#rs-premium-pilots');
      await selection.waitFor({state:'visible',timeout:10000});
      assert.equal(await page.locator('#rs-premium-pilot-cards button').count(),7,'Sete pilotos obrigatórios');
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
      await page.waitForTimeout(1000);
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
      for(const level of [1,2]){
        await page.waitForFunction(sector=>{
          const sprites=window.RiverPremium;
          return window.RiverPremiumEnvironment.ready(sector)&&
            sprites.get('terrain','TARGET',sector)&&sprites.get('terrain','ARMED_ISLAND',sector)&&
            sprites.get('terrain','BRIDGE',sector)&&sprites.get('enemy','MEGAZORD',sector)&&
            sprites.get('enemy',sector===1?'TUCANO':'CRANE',sector)&&sprites.get('pickup','GAS',sector);
        },level);
        const calls=await page.evaluate(level=>{
          const previous={sector,enemies,islands,structures,fuelDepots};
          const result=[];
          const context=document.getElementById('gameCanvas').getContext('2d');
          const drawImage=context.drawImage;
          context.drawImage=function(image,...args){
            result.push({path:image.getAttribute?.('src')||'',source:image.naturalWidth/image.naturalHeight,
              destination:args.length===4?args[2]/args[3]:null});
            return drawImage.call(this,image,...args);
          };
          try{
            sector=level;
            const x=VIRTUAL_WIDTH/2;
            const biomeId=level===1?'TUCANO':'CRANE';
            enemies=[
              {type:'BIOME_ENEMY',biomeId,terrainObstacle:true,terrainName:level===1?'RAIZ':'CONTAINER',x:x-35,y:100,width:35,height:32,hp:7,maxHp:14},
              {type:'BIOME_ENEMY',biomeId,x:x+35,y:170,width:34,height:34,hp:5,maxHp:5},
              {type:'MEGAZORD',x,y:250,width:82,height:95,hp:150,maxHp:150}
            ];
            islands=[{x:x-65,y:300,width:56,height:68,shape:0}];
            structures=[{type:'BRIDGE',x,y:355,width:180,height:22,opening:100,hp:18,maxHp:18}];
            fuelDepots=[{x,y:405}];
            render();
            return result;
          }finally{
            ({sector,enemies,islands,structures,fuelDepots}=previous);
            context.drawImage=drawImage;
          }
        },level);
        const expected=level===1?['roots.png','island.png','01_tucano/idle_000.png']:
          ['container.png','dock.png','02_crane/idle_000.png'];
        for(const name of [...expected,'bridge.png','gas.png','megazord.png']){
          assert.ok(calls.some(call=>call.path.endsWith(name)),'Sprite ausente no quadro: '+name);
        }
        assert.ok(!calls.some(call=>call.path.endsWith('.svg')),'SVG desenhado na missão '+level);
        if(level===2){
          for(const name of ['water.png','bank_left.png','bank_right.png']){
            const tiles=calls.filter(call=>call.path.includes('mission_02_industrial/')&&call.path.endsWith(name));
            assert.ok(tiles.length,'Textura industrial ausente: '+name);
            assert.ok(tiles.every(tile=>Math.abs(tile.source-tile.destination)<1e-8),'Textura esticada: '+name);
          }
        }
        console.log('Premium raster scene',JSON.stringify({viewport,level,sprites:expected}));
      }
      await page.close();
    }
  }finally{await browser?.close();server.kill('SIGKILL');}
})().catch(e=>{console.error(e);process.exitCode=1});
