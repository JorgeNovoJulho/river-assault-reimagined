const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const src=fs.readFileSync('index.html','utf8');
test('20 identidades possuem armas laterais e nucleos animados',()=>{
 assert.ok(src.includes('const family=Math.floor(id/5),variant=id%5'));
 assert.ok(src.includes('const blades=3+id%7'));
 assert.ok(src.includes('const mountX=w*(.28+variant*.015)'));
 assert.ok(src.includes("if(qualitySelect.value!=='eco')"));
});
test('identidade acompanha o boss e preserva hitbox',()=>{
 const a=src.indexOf('Assinaturas estruturais exclusivas dos vinte chefes');
 const b=src.indexOf('// RiverStorm: desgaste visual',a);
 assert.ok(a>=0&&b>a);
 const drawing=src.slice(a,b);
 assert.ok(drawing.includes('ctx.save()')&&drawing.includes('ctx.restore()'));
 assert.ok(!/e\.(x|y|width|height)\s*=/.test(drawing));
});
test('balanceamento individual e limites dos especiais continuam presentes',()=>{
 assert.ok(src.includes('const BOSS_BALANCE_20='));
 assert.ok(src.includes('bossClimateStrength*bossBalance[0]'));
 assert.match(src,/Math\.max\(420,Math\.round\(\(e\.specialCooldown \|\| 480\)\/adaptiveThreat\)\)/);
 assert.ok(src.includes('player.effectTimer=72'));
});
