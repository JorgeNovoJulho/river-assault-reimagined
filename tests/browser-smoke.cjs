const {chromium}=require('playwright');const {spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'pipe'});
 let browser;
 try{
  let serverReady=false;
  for(let attempt=0;attempt<75;attempt++){
    try{const resp=await fetch('http://127.0.0.1:5173/');if(resp.ok){serverReady=true;break}}catch(e){}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  if(!serverReady)throw new Error('Servidor Vite não respondeu em 30 segundos');
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:700},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded',timeout:20000});
  await page.locator('#start-btn').click({timeout:12000});
  await page.waitForTimeout(1500);
  const result=await page.evaluate(()=>{const c=document.getElementById('gameCanvas');const p=c.getContext('2d').getImageData(0,0,Math.min(40,c.width),Math.min(40,c.height)).data;return {state:gameState,hidden:document.getElementById('start-screen').classList.contains('hidden'),overlayVisible:getComputedStyle(document.getElementById('start-screen')).display!=='none',error:document.getElementById('runtime-error')?.textContent,canvas:!!c,painted:p.some((value,i)=>i%4===3&&value>0),active:document.getElementById('game-container').dataset.gameActive==='true'}});
  console.log(JSON.stringify({result,errors},null,2));
  if(result.state!=='PLAYING'||!result.hidden||result.overlayVisible||!result.active||!result.painted||result.error||errors.length)throw Error('O jogo não iniciou corretamente!');
 }finally{await browser?.close();server.kill('SIGKILL');}
})().catch(e=>{console.error(e);process.exit(1)});
