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
  for (const key of ['RiverGamepadInput','RiverAircraft','RiverClock','RiverCampaign','RiverVisuals','RiverMusic','RiverPlaylist']) {
    const ok = await page.evaluate(k => !!window[k],key);
    if(!ok) throw Error('Script ausente no BUILD: '+key);
  }
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
  await page.locator('#controller-settings-btn').click();
  if (!await page.locator('#controller-settings').isVisible()) throw Error('Botão CONTROLE falhou');
  await page.locator('#pad-close').click();
  if (await page.locator('#controller-settings').isVisible()) throw Error('Botão VOLTAR falhou');
  await page.locator('#quality-select').selectOption('balanced');
  await page.locator('#plane-select').selectOption('vespa');
  await page.locator('#level-select').selectOption('5');
  await page.locator('#start-btn').click({timeout:12000});
  await page.waitForTimeout(1500);
  const result=await page.evaluate(()=>{const c=document.getElementById('gameCanvas');const p=c.getContext('2d').getImageData(0,0,Math.min(40,c.width),Math.min(40,c.height)).data;return {state:gameState,sector,aircraft:selectedPlane,hidden:document.getElementById('start-screen').classList.contains('hidden'),overlayVisible:getComputedStyle(document.getElementById('start-screen')).display!=='none',error:document.getElementById('runtime-error')?.textContent,canvas:!!c,painted:p.some((value,i)=>i%4===3&&value>0),active:document.getElementById('game-container').dataset.gameActive==='true'}});
  console.log(JSON.stringify({result,errors},null,2));
  if(result.sector!==5||result.aircraft!=='vespa'||result.state!=='PLAYING'||!result.hidden||result.overlayVisible||!result.active||!result.painted||result.error||errors.length)throw Error('O jogo não iniciou corretamente!');

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
  if(continued.lives!==3||continued.state!=='PLAYING'||continued.credits!==0||!continued.screenHidden)throw Error('O botão CONTINUAR falhou: '+JSON.stringify(continued));
  if(errors.length)throw Error('Erros no browser: '+JSON.stringify(errors));

 }finally{await browser?.close();server.kill('SIGKILL');}
})().catch(e=>{console.error(e);process.exit(1)});
