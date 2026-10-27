const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const src=fs.readFileSync('index.html','utf8');
test('20 chefes utilizam 12 familias de casco independentes',()=>{
 const m=src.match(/const BOSS_HULL_ARCHETYPES=\[([^\]]+)\]/);
 assert.ok(m,'tabela de familias ausente');
 const ids=m[1].split(',').map(x=>Number(x.trim()));
 assert.equal(ids.length,20);assert.equal(new Set(ids).size,12);
 for(const n of ids)assert.ok(n>=0&&n<12);
 for(let n=0;n<12;n++)assert.ok(src.includes('case '+n+':'));
});
test('render dos bosses mantem a renderizacao anterior como fallback',()=>{
 assert.ok(src.includes('if(e.bossId>=1&&e.bossId<=20)'));
 assert.ok(src.includes("else if(e.bossSubType===0)"));
 assert.ok(src.includes('ctx.restore();'));
});
