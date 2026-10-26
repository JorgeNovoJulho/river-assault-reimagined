const {chromium}=require('playwright');const {spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{stdio:'pipe'});
 let browser;
 try{
  let serverReady=false;
  for(let attempt=0;attempt<75;attempt++){
    try{const resp=await fetch('http://127.0.0.1:4173/');if(resp.ok){serverReady=true;break}}catch(e){}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  if(!serverReady)throw new Error('Servidor Vite não respondeu em 30 segundos');
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:700},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:20000});
  // Confirma que os scripts globais NÃO estão ausentes no pacote de produção.
  for (const key of ['RiverGamepadInput','RiverAircraft','RiverClock','RiverPilotProgress','RiverCampaign','RiverVisuals','RiverMusic','RiverPlaylist']) {
    const ok = await page.evaluate(k => !!window[k],key);
    if(!ok) throw Error('Script ausente no BUILD: '+key);
  }
  await page.locator('#menu-settings-btn').click();
  await page.evaluate(()=>{
    for(const [id,value] of [['music-volume','22'],['sfx-volume','31'],['sarcasm-level','4'],['pad-deadzone','30']]){
      const el=document.getElementById(id);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));
    }
  });
  console.log('STARTUP DIAGNOSTICS:',JSON.stringify({errors})); if(errors.length)throw Error('Erro de inicialização: '+JSON.stringify(errors));
  const settings=await page.evaluate(()=>({
     open:getComputedStyle(document.getElementById('controller-settings')).display,
     parent:document.getElementById('controller-settings').parentElement.tagName,
     scroll:document.getElementById('controller-settings').scrollHeight,
     height:document.getElementById('controller-settings').clientHeight,
     music:userPrefs.music,sfx:userPrefs.sfx,sarcasm:sarcasmLevel,
     deadzone:physicalGamepad.settings.deadzone
  }));
  console.log('Settings controls:',JSON.stringify(settings));
  if(settings.open==='none'||settings.parent!=='BODY'||settings.music!==22||settings.sfx!==31||settings.sarcasm!==4||Math.abs(settings.deadzone-.30)>.011)throw Error('Controles de Configurações sem efeito '+JSON.stringify(settings));
  await page.locator('#settings-plane').selectOption('fenix');
  await page.locator('#settings-buy-plane').click();
  if(!(await page.locator('#settings-wallet').innerText()).includes('SALDO'))throw Error('Hangar não respondeu');

  if (!await page.locator('#controller-settings').isVisible()) throw Error('Botão CONTROLE falhou');
  await page.locator('#pad-close').click();
  if (await page.locator('#controller-settings').isVisible()) throw Error('Botão VOLTAR falhou');
  await page.locator('#quality-select').selectOption('balanced');
  await page.locator('#plane-select').selectOption('vespa');
  await page.locator('#level-select').selectOption('5');
  console.log('Start hit test:',JSON.stringify(await page.evaluate(()=>{
    const b=document.getElementById('start-btn'),r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    return {x,y,target:document.elementFromPoint(x,y)?.id,overlay:document.getElementById('controller-settings').style.display,dialogOpen:controllerMenuOpen,scrollTop:document.getElementById('start-screen').scrollTop}
  })));
  await page.locator('#start-btn').click({timeout:12000});
  await page.waitForTimeout(1500);
  const result=await page.evaluate(()=>{const c=document.getElementById('gameCanvas');const p=c.getContext('2d').getImageData(0,0,Math.min(40,c.width),Math.min(40,c.height)).data;return {state:gameState,sector,aircraft:selectedPlane,hidden:document.getElementById('start-screen').classList.contains('hidden'),overlayVisible:getComputedStyle(document.getElementById('start-screen')).display!=='none',error:document.getElementById('runtime-error')?.textContent,canvas:!!c,painted:p.some((value,i)=>i%4===3&&value>0),active:document.getElementById('game-container').dataset.gameActive==='true'}});
  console.log(JSON.stringify({result,errors},null,2));
  if(result.sector!==5||result.aircraft!=='vespa'||result.state!=='PLAYING'||!result.hidden||result.overlayVisible||!result.active||!result.painted||result.error||errors.length)throw Error('O jogo não iniciou corretamente!');

  const crtBefore=await page.locator('#crt-toggle').innerText();
  await page.locator('#crt-toggle').click();
  console.log('CRT status:',JSON.stringify({before:crtBefore,after:await page.locator('#crt-toggle').innerText(),errors,notice:await page.locator('#runtime-error').count(),scripts:await page.evaluate(()=>({gameState:typeof gameState==='undefined'?'undefined':gameState,settings:!!document.getElementById('settings-plane')}))}));
  if (await page.locator('#crt-toggle').innerText()===crtBefore) throw Error('Botão CRT falhou');
  const soundBefore=await page.locator('#sound-toggle').innerText();
  await page.locator('#sound-toggle').click();
  if (await page.locator('#sound-toggle').innerText()===soundBefore) throw Error('Botão SOM falhou');
  const musicBefore=await page.locator('#music-toggle').innerText();
  await page.locator('#music-toggle').click();
  if (await page.locator('#music-toggle').innerText()===musicBefore) throw Error('Botão MÚSICA falhou');

  // Regression: destroying the craft must respawn twice, then offer continue.
  const lifeFlow=await page.evaluate(()=>{
    player.invulnerable=0;player.shield=1;applyDamage(200,'TESTE VIDA 1');
    const a={lives,state:gameState,shield:player.shield};
    player.invulnerable=0;player.shield=1;applyDamage(200,'TESTE VIDA 2');
    const b={lives,state:gameState};
    player.invulnerable=0;player.shield=1;applyDamage(200,'TESTE VIDA 3');
    const c={lives,state:gameState,visible:!document.getElementById('game-over-screen').classList.contains('hidden')};
    return {a,b,c};
  });
  console.log('Life flow:',JSON.stringify(lifeFlow));
  if(lifeFlow.a.lives!==2||lifeFlow.b.lives!==1||lifeFlow.c.lives!==0||lifeFlow.c.state!=='GAMEOVER'||!lifeFlow.c.visible)throw Error('Fluxo de vidas/game over não funciona');
  await page.locator('#continue-btn').click();
  const continued=await page.evaluate(()=>({lives,state:gameState,credits:continues,screenHidden:document.getElementById('game-over-screen').classList.contains('hidden')}));
  if(continued.lives!==3||continued.state!=='PLAYING'||continued.credits!==9||!continued.screenHidden)throw Error('O botão CONTINUAR falhou: '+JSON.stringify(continued));
  const bossFlow=await page.evaluate(()=>{
    enemies=[];bullets=[];enemyBullets=[];bossDefeatedThisMission=false;
    missionTransitionTicks=0;missionTicks=5500;player.invulnerable=5000;player.shield=player.maxShield;
    spawnBoss(-100,true);
    const boss=enemies.find(e=>e.type==='BOSS');boss.x=player.x;boss.y=110;boss.hp=1;
    bullets.push({x:boss.x,y:boss.y,speed:0,vx:0});
    update();
    const transitionStarted={bossActive,defeated:bossDefeatedThisMission,ticks:missionTransitionTicks,sector};
    for(let i=0;i<180;i++)update();
    return {transitionStarted,finished:{sector,bossActive,defeated:bossDefeatedThisMission,ticks:missionTransitionTicks,mission:document.getElementById('mission-banner').textContent}};
  });
  console.log('Boss transition:',JSON.stringify(bossFlow));
  if(bossFlow.transitionStarted.bossActive||!bossFlow.transitionStarted.defeated||bossFlow.transitionStarted.ticks!==180||
     bossFlow.finished.sector!==6||bossFlow.finished.ticks!==0||bossFlow.finished.defeated)
     throw Error('Chefe bloqueou a transição de missão: '+JSON.stringify(bossFlow));
  const checkpointFlow=await page.evaluate(()=>{
    const prevSector=sector,prevVerified=campaignVerified;
    sector=7;campaignVerified=true;writeCheckpoint(8);
    const good=readCheckpoint(),raw=localStorage.getItem(CHECKPOINT_KEY);
    sector=20;campaignVerified=false;
    const rejected=writeCheckpoint(20),stillStored=localStorage.getItem(CHECKPOINT_KEY);
    sector=prevSector;campaignVerified=prevVerified;
    return {good:good?.sector,rejected,unchanged:raw===stillStored};
  });
  if(checkpointFlow.good!==8||checkpointFlow.rejected!==false||!checkpointFlow.unchanged)
    throw Error('Checkpoint legítimo sobrescrito por missão avulsa: '+JSON.stringify(checkpointFlow));
  // Campaign regression: direct mission 20 must never grant a promotion.
  const campaignFlow=await page.evaluate(()=>{
    const startingJourney=journey,startingPoints=careerPoints;
    gameState='PLAYING';sector=20;campaignVerified=false;
    finishFullCampaign();
    const direct={journey,careerPoints,title:document.querySelector('#victory-screen h2').textContent};
    document.getElementById('victory-screen').classList.add('hidden');
    gameState='PLAYING';sector=20;campaignVerified=true;
    finishFullCampaign();
    const legitimate={journey,careerPoints,title:document.querySelector('#victory-screen h2').textContent};
    return {startingJourney,startingPoints,direct,legitimate};
  });
  console.log('Campaign progression:',JSON.stringify(campaignFlow));
  if(campaignFlow.direct.journey!==campaignFlow.startingJourney||
     campaignFlow.direct.careerPoints!==campaignFlow.startingPoints||
     campaignFlow.legitimate.careerPoints<=campaignFlow.startingPoints||
     campaignFlow.legitimate.journey!==Math.min(campaignFlow.startingJourney+1,16))
     throw Error('Validação de promoção NG+ falhou: '+JSON.stringify(campaignFlow));

  if(errors.length)throw Error('Erros no browser: '+JSON.stringify(errors));

 }finally{await browser?.close();server.kill('SIGKILL');}
})().catch(e=>{console.error(e);process.exit(1)});
