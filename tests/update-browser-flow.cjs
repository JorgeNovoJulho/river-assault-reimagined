const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {chromium} = require('playwright');
const url = 'http://127.0.0.1:4179/';
(async () => {
  const server = spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4179','--strictPort'],{stdio:'ignore'});
  let browser;
  try {
    let ready = false;
    for (let n=0;n<80;n++) {
      try { if ((await fetch(url)).ok) {ready=true;break;} } catch {}
      await new Promise(resolve => setTimeout(resolve,150));
    }
    assert.ok(ready);
    browser = await chromium.launch({headless:true,executablePath:process.env.RIVER_CHROME||undefined});
    const windows = await browser.newPage();
    await windows.addInitScript(() => {
      window.updateCalls = [];
      window.releaseVersion = '0.2.0';
      window.__TAURI__ = {
        app:{getVersion:async ()=>'0.1.0'},
        core:{invoke:async (name,params)=>{
          window.updateCalls.push([name,params]);
          return name==='river_check_update'?{currentVersion:'0.1.0',version:window.releaseVersion}:undefined;
        }}
      };
    });
    await windows.goto(url);
    await windows.locator('#rs-update-dialog').waitFor({state:'visible'});
    assert.equal(await windows.locator('#rs-update-current').textContent(),'0.1.0');
    assert.equal(await windows.locator('#rs-update-next').textContent(),'0.2.0');
    assert.deepEqual(await windows.evaluate(()=>updateCalls.map(call=>call[0])),['river_check_update']);
    await windows.locator('#rs-update-close').click();
    await windows.locator('#mode-settings').click();
    await windows.locator('#rs-update-open').click();
    await windows.locator('#rs-update-install').click();
    assert.deepEqual(await windows.evaluate(()=>updateCalls.at(-1)),['river_install_update',{version:'0.2.0'}]);
    await windows.evaluate(()=>{window.releaseVersion=null;});
    await windows.locator('#rs-update-retry').click();
    assert.equal(await windows.locator('#rs-update-install').isDisabled(),true);
    assert.equal(await windows.locator('#rs-update-next').textContent(),'—');
    const android = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await android.addInitScript(() => {
      window.Capacitor={
        getPlatform:()=> 'android',
        registerPlugin:name=> {
          if(name!=='RiverUpdate')return {};
          return {
            installed:async()=>({currentVersion:'0.1.5'}),
            check:async()=>({currentVersion:'0.1.5',version:'0.3.0'}),
            install:async({version})=>{window.chosenVersion=version;return {permissionRequired:true};}
          };
        }
      };
    });
    await android.goto(url);
    await android.locator('#rs-update-dialog').waitFor({state:'visible'});
    assert.equal(await android.locator('#rs-update-current').textContent(),'0.1.5');
    await android.locator('#rs-update-install').click();
    assert.equal(await android.evaluate(()=>chosenVersion),'0.3.0');
    await android.waitForFunction(()=>document.getElementById('rs-update-status').textContent.includes('Autorize'));
    const web = await browser.newPage();
    await web.goto(url);
    await web.locator('#mode-settings').click();
    await web.locator('#rs-update-open').click();
    assert.equal(await web.locator('#rs-update-install').isDisabled(),true);
    assert.match(await web.locator('#rs-update-status').textContent(),/Prévia web/);
    console.log('Atualização: confirmação, versão exata, permissões Android e prévia web aprovadas');
  } finally {await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1});
