const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
test('bosses retêm vinte identidades por setor',()=>{
  assert.match(html,/bossIdentity=Math\.max\(0,Math\.min\(19/);
  assert.match(html,/const sectorBossLines=/);
  assert.match(html,/bossId: sector/);
});
test('desgaste visual proporcional à vida sem alterar hitbox',()=>{
  assert.match(html,/const integrity=Math\.max\(0,Math\.min\(1,e\.hp\/Math\.max\(1,e\.maxHp\)\)\)/);
  assert.match(html,/const cracks=integrity<\.3\?5:integrity<\.5\?3:1/);
  assert.match(html,/if\(qualitySelect\.value!=='eco'\)/);
});
test('recarga mínima e EMP curto permanecem ativos',()=>{
  assert.ok(html.includes('Math.max(420,e.specialCooldown || 480)'));
  assert.ok(html.includes("player.effectTimer=72"));
});
