const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const address='http://127.0.0.1:4176';
async function run(){
 const server=spawn(process.execPath,['scripts/lan-server.mjs'],{env:{...process.env,RIVER_LAN_BIND:'127.0.0.1',RIVER_LAN_PORT:'4176'},stdio:'inherit'});
 let browser;
 try{
  let ready=false;
  for(let i=0;i<100;i++){
   try{if((await fetch(address+'/river-lan-health')).ok){ready=true;break}}catch{}
   await new Promise(resolve=>setTimeout(resolve,150));
  }
  assert.ok(ready,'O servidor LAN não respondeu');
  browser=await chromium.launch({headless:true,executablePath:process.env.RIVER_CHROME||undefined});
  async function open(){
   const context=await browser.newContext();
   await context.route('**/*',route=>route.request().url().startsWith(address+'/')?route.continue():route.abort());
   const page=await context.newPage();
   const sockets=[];
   page.on('websocket',socket=>sockets.push(socket.url()));
   await page.goto(address+'/?lan=1',{waitUntil:'domcontentloaded'});
   await page.locator('#mode-multi').click();
   return {page,sockets};
  }
  const {page:host,sockets:hostSockets}=await open();
  const {page:guest,sockets:guestSockets}=await open();
  await host.locator('#river-room-password').fill('lan-teste');
  await host.locator('#river-room-create').click();
  await host.waitForFunction(()=>document.querySelector('#river-room-code').value.startsWith('riverstorm-'));
  async function enter(){
   await guest.locator('#river-room-code').fill(await host.locator('#river-room-code').inputValue());
   await guest.locator('#river-room-password').fill('lan-teste');
   await guest.locator('#river-room-join').click();
   for(const p of [host,guest])await p.waitForFunction(()=>document.querySelector('#river-room-count').textContent.endsWith('2 / 8'));
  }
  await enter();
  await guest.locator('#mode-multi-back').click();
  await host.waitForFunction(()=>document.querySelector('#river-room-count').textContent.endsWith('1 / 8'));
  await guest.locator('#mode-multi').click();
  await enter();
  assert.ok(hostSockets.length>0&&guestSockets.length>0,'Sinalização local ausente');
  assert.ok([...hostSockets,...guestSockets].every(url=>url.startsWith('ws://127.0.0.1:4176/river-peer/')));
  await host.locator('#river-room-start').click();
  for(const p of [host,guest])await p.waitForFunction(()=>gameState==='PLAYING'&&sector===1);
  console.log('LAN real: dois perfis independentes, sinalização local, saída, nova entrada e rodada iniciada com HTTP externo bloqueado');
 }finally{await browser?.close();server.kill();}
}
run().catch(error=>{console.error(error);process.exitCode=1});
