const {chromium}=require('playwright');const {spawn}=require('node:child_process');
(async()=>{
 const server=spawn('npm',['run','dev','--','--host','127.0.0.1'],{stdio:'pipe'});
 let browser;
 try{
  await new Promise((ok,fail)=>{let buf='';let timer=setTimeout(()=>fail(new Error('Vite indisponível')),25000);server.stdout.on('data',d=>{buf+=d.toString();if(buf.includes('127.0.0.1:5173')){clearTimeout(timer);ok()}});server.on('exit',code=>fail(new Error('Vite saiu: '+code)))});
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:700},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  await page.locator('#start-btn').click();
  await page.waitForTimeout(1500);
  const result=await page.evaluate(()=>({state:gameState,hidden:document.getElementById('start-screen').classList.contains('hidden'),error:document.getElementById('runtime-error')?.textContent,canvas:!!document.getElementById('gameCanvas')}));
  console.log(JSON.stringify({result,errors},null,2));
  if(result.state!=='PLAYING'||!result.hidden||result.error||errors.length)throw Error('O jogo não iniciou corretamente!');
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exit(1)});
