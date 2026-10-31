const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
test('barra especial do boss e dialogo sao independentes da arena',()=>{
 const special=html.indexOf('id="boss-special-hud"'),dialogue=html.indexOf('id="boss-dialogue-strip"'),hud=html.indexOf('id="compact-hud"');
 assert.ok(special>0&&dialogue>special&&hud>dialogue);
 assert.ok(!html.includes('#boss-special-hud{display:none!important}'));
});
test('EMP do boss dura no maximo 1.2 s e especiais têm recarga mínima',()=>{
 assert.ok(html.includes("player.effectTimer=72"));
 assert.match(html,/Math\.max\(420,Math\.round\(\(e\.specialCooldown \|\| 480\)\/adaptiveThreat\)\)/);
 assert.ok(!html.includes("createFloatingText(player.x,player.y,'EMP · 5 S'"));
});
test('existem 20 identidades de boss e frases distintas por setor',()=>{
 assert.ok(html.includes('const sectorBossLines='));
 const section=html.slice(html.indexOf('const sectorBossLines='),html.indexOf('let sarcasmLevel='));
 assert.equal((section.match(/\],\[/g)||[]).length+1,20);
 assert.ok(html.includes('bossIdentity=Math.max(0,Math.min(19,((e.bossId||sector||1)-1)%20))'));
});
