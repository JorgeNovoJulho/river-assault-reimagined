const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8').replace(/\r\n/g,'\n'),renderer=fs.readFileSync('src/render/scene2d5.js','utf8'),workflow=fs.readFileSync('.github/workflows/native-test-packages.yml','utf8');
test('modo solo e multiplayer selecionaveis antes da campanha',()=>{for(const id of ['mode-selection','mode-single','mode-multi','mode-multi-info','riverstorm-update-notice'])assert.ok(html.includes('id="'+id+'"'));assert.ok(html.includes("modeSelection.classList.add('hidden')"));});
test('mobile layout respeita safe area, HUD e botoes',()=>{assert.ok(html.includes('height:100dvh'));assert.ok(html.includes('#touch-controls{padding-bottom:env(safe-area-inset-bottom)'));assert.ok(html.includes('#compact-hud{max-width:100%'));});
test('atualizaÃ§Ã£o nativa mostra as duas versÃµes e exige confirmaÃ§Ã£o',()=>{
 const updates=fs.readFileSync('src/game/app-updates.js','utf8');
 assert.ok(html.includes('rs-update-current'));
 assert.ok(html.includes('rs-update-next'));
 assert.ok(updates.includes("install.addEventListener('click'"));
 assert.ok(updates.includes('windows.install(available, showProgress)'));
});
test('naves dos bosses usam pecas reconheciveis e tiro limitado',()=>{assert.ok(renderer.includes('function bossAccessories('));assert.ok(renderer.includes('bossAccessories(c,e,d)'));assert.ok(html.includes('enemyBullets.length<27'));assert.ok(html.includes('firingWindow'));});
test('pacotes Windows e APK configurados',()=>{const tauri=JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json','utf8'));assert.equal(tauri.bundle.targets[0],'nsis');assert.equal(tauri.app.windows[0].fullscreen,true);assert.ok(fs.existsSync('capacitor.config.ts'));assert.ok(workflow.includes('runs-on: windows-latest'));assert.ok(workflow.includes('assembleDebug'));});

test('Windows: fechar em tela cheia e Esc volta à janela sem acionar o jogo',async ()=>{
 const config=JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json','utf8'));
 const caps=JSON.parse(fs.readFileSync('src-tauri/capabilities/default.json','utf8'));
 assert.equal(config.app.windows[0].decorations,true);
 for(const permission of ['allow-close','allow-set-fullscreen'])assert.ok(caps.permissions.includes('core:window:'+permission));

 const script=html.slice(html.indexOf('        {\n            const nativeWindow='),html.indexOf('                syncFullscreen();')+'                syncFullscreen();\n            }\n        }'.length);
 const button={hidden:true,addEventListener(name,fn){this[name]=fn}};
 const listeners={};
 let fullscreen=true;
 let closed=false;
 const nativeWindow={
  isFullscreen:async ()=>fullscreen,
  setFullscreen:async value=>{fullscreen=value},
  close:async ()=>{closed=true}
 };
 const window={addEventListener(name,fn,capture){listeners[name]=fn;if(name==='keydown')assert.equal(capture,true)}};
 const document={getElementById:()=>button};
 vm.runInNewContext(script,{window,document,console});
 assert.equal(button.hidden,true,'No navegador, o botão permanece oculto');
 window.__TAURI__={window:{getCurrentWindow:()=>nativeWindow}};
 vm.runInNewContext(script,{window,document,console});
 assert.equal(button.hidden,false);
 await button.click();
 assert.equal(closed,true);

 async function escape(repeat=false){
  let consumed=false;
  await listeners.keydown({code:'Escape',repeat,preventDefault(){},stopImmediatePropagation(){consumed=true}});
  return consumed;
 }
 assert.equal(await escape(),true);
 assert.equal(fullscreen,false);
 assert.equal(button.hidden,true);
 assert.equal(await escape(true),true,'Segurar Esc não deve pausar o jogo');
 assert.equal(await escape(),false,'Um novo Esc em janela continua disponível ao jogo');
 fullscreen=true;
 await listeners.resize();
 assert.equal(button.hidden,false);
});
