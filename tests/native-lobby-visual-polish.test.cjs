const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8'),renderer=fs.readFileSync('src/render/scene2d5.js','utf8'),workflow=fs.readFileSync('.github/workflows/native-test-packages.yml','utf8');
test('modo solo e multiplayer selecionaveis antes da campanha',()=>{for(const id of ['mode-selection','mode-single','mode-multi','mode-multi-info','riverstorm-update-notice'])assert.ok(html.includes('id="'+id+'"'));assert.ok(html.includes("modeSelection.classList.add('hidden')"));});
test('mobile layout respeita safe area, HUD e botoes',()=>{assert.ok(html.includes('height:100dvh'));assert.ok(html.includes('#touch-controls{padding-bottom:env(safe-area-inset-bottom)'));assert.ok(html.includes('#compact-hud{max-width:100%'));});
test('atualização nativa mostra as duas versões e exige confirmação',()=>{
 const updates=fs.readFileSync('src/game/app-updates.js','utf8');
 assert.ok(html.includes('rs-update-current'));
 assert.ok(html.includes('rs-update-next'));
 assert.ok(updates.includes("install.addEventListener('click'"));
 assert.ok(updates.includes('native.install(available)'));
});
test('naves dos bosses usam pecas reconheciveis e tiro limitado',()=>{assert.ok(renderer.includes('function bossAccessories('));assert.ok(renderer.includes('bossAccessories(c,e,d)'));assert.ok(html.includes('enemyBullets.length<27'));assert.ok(html.includes('firingWindow'));});
test('pacotes Windows e APK configurados',()=>{const tauri=JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json','utf8'));assert.equal(tauri.bundle.targets[0],'nsis');assert.ok(fs.existsSync('capacitor.config.ts'));assert.ok(workflow.includes('runs-on: windows-latest'));assert.ok(workflow.includes('assembleDebug'));});
