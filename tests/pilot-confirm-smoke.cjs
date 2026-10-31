const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4174'],{stdio:'pipe'});
 let browser;
 try{
  for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:4174/')).ok)break;}catch(e){}await new Promise(r=>setTimeout(r,300));}
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1366,height:768}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'domcontentloaded'});
  await page.locator('#mode-single').click();
  await page.locator('#rs-pilot-screen').waitFor({state:'visible'});
  const card=page.locator('#rs-pilot-grid .rs-pilot-card').nth(2);
  await card.hover();
  await page.waitForFunction(()=>document.querySelector('#rs-pilot-detail h3')?.textContent.includes('B.Tata'));
  await card.dblclick({delay:80});
  await page.waitForFunction(()=>window.gameState==='PLAYING'||(typeof gameState!=='undefined'&&gameState==='PLAYING'),{timeout:12000}).catch(()=>{});
  const state=await page.evaluate(()=>({
   game:typeof gameState==='undefined'?'UNDEFINED':gameState,
   pilotDisplay:getComputedStyle(document.querySelector('#rs-pilot-screen')).display,
   pilotVisible:document.querySelector('#rs-pilot-screen').getBoundingClientRect().width>0&&getComputedStyle(document.querySelector('#rs-pilot-screen')).visibility!=='hidden'&&getComputedStyle(document.querySelector('#rs-pilot-screen')).display!=='none',
   mainDisplay:getComputedStyle(document.querySelector('#mode-selection')).display,
   active:document.querySelector('#game-container')?.dataset.gameActive,
   error:document.querySelector('#runtime-error')?.textContent||''
  }));
  console.log('Pilot double-click flow:',JSON.stringify({state,errors}));
  if(state.game!=='PLAYING'||state.pilotVisible||state.mainDisplay!=='none'||state.active!=='true'||state.error||errors.length)throw Error('Seleção não iniciou a missão: '+JSON.stringify({state,errors}));
  // Diagnostic only: CI FPS varies by runner, so report instead of inventing a threshold.
  const metrics=await page.evaluate(async()=>{
    const begin=performance.now(),frames=[];
    await new Promise(resolve=>{
      let prev=0;
      const tick=t=>{if(prev)frames.push(t-prev);prev=t;if(t-begin<2200)requestAnimationFrame(tick);else resolve();};
      requestAnimationFrame(tick);
    });
    const sorted=frames.filter(x=>x>0).sort((a,b)=>a-b);
    const percentile=p=>sorted[Math.min(sorted.length-1,Math.floor(sorted.length*p))]||0;
    const canvas=document.querySelector('canvas');
    return {frames:sorted.length,medianMs:+percentile(.5).toFixed(2),p95Ms:+percentile(.95).toFixed(2),
      approximateFps:sorted.length?+(1000/(sorted.reduce((a,b)=>a+b,0)/sorted.length)).toFixed(1):0,
      canvasPixels:canvas?canvas.width*canvas.height:0,
      usedJsHeapMb:performance.memory?+(performance.memory.usedJSHeapSize/1048576).toFixed(1):null,
      screenWidth:innerWidth,devicePixelRatio:devicePixelRatio};
  });
  console.log('Performance baseline (CI, not physical device):',JSON.stringify(metrics));
  if(!metrics.frames||!metrics.canvasPixels)throw Error('Sem animação ou superfície de renderização: '+JSON.stringify(metrics));

 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
