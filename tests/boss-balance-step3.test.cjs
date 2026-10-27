const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const src=fs.readFileSync('index.html','utf8');
test('20 chefes com balanceamento individual',()=>{
 const part=src.split('const BOSS_BALANCE_20=')[1]?.split('];')[0];
 assert.ok(part,'tabela ausente');
 const rows=[...part.matchAll(/\[(\d+\.\d+|\.\d+),(\d+\.\d+|\.\d+),(\d+\.\d+|\.\d+)\]/g)];
 assert.equal(rows.length,20);
 for(const m of rows)for(let i=1;i<=3;i++)assert.ok(+m[i]>=.9&&+m[i]<=1.25);
 assert.ok(src.includes('bossClimateStrength*bossBalance[0]'));
 assert.ok(src.includes('bossBalance[1]'));
 assert.ok(src.includes('bossBalance[2]'));
});
test('sprites inimigos animados sem animacao dependente da hora local',()=>{
 assert.ok(src.includes('const ticks=missionTicks*.06'));
 assert.ok(src.includes('ctx.translate(0,bob)'));
 assert.ok(src.includes("if(e.type==='HELI')ctx.rotate"));
});
