const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const scene=fs.readFileSync('src/render/scene2d5.js','utf8');
test('o dialogo do boss aparece uma unica vez antes do HUD',()=>{
  assert.equal((html.match(/id="boss-dialogue-strip"/g)||[]).length,1);
  assert.ok(html.indexOf('id="boss-dialogue-strip"')<html.indexOf('id="compact-hud"'));
  assert.ok(html.includes('#boss-dialogue-strip:not(.hidden){display:block!important;position:relative!important'));
  assert.ok(!html.includes('top:50%!important'));
});
test('clima e horario sao exibidos no HUD sem duplicacao superior',()=>{
  assert.ok(html.includes('id="hud-environment"'));
  assert.ok(html.includes("set('hud-environment',env"));
  assert.ok(scene.includes('root.RiverStormEnvironment='));
  assert.ok(!scene.includes('c.fillText(periodNames[climate[2]]'));
});
test('tela atual conserva perfil do piloto e seus dados',()=>{
 for(const id of ['start-pilot-avatar','start-pilot-name','start-pilot-rank','hud-pilot-name','hud-rank'])assert.ok(html.includes('id="'+id+'"'),id);
});
test('alerta critico do escudo e falas do boss estao presentes',()=>{
 assert.ok(html.includes('updateCriticalShieldWarning'));
 assert.ok(html.includes('sectorBossLines'));
 assert.ok(html.includes('rs-shield-critical'));
});
