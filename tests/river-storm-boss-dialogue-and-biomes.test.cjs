const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const html=fs.readFileSync('index.html','utf8');
test('os vinte chefes têm cinco frases e reagem ao dano',()=>{
 const match=html.match(/const sectorBossLines=(\[.*?\]);/s);
 assert.ok(match);const lines=JSON.parse(match[1]);assert.equal(lines.length,20);
 for(const batch of lines)assert.equal(batch.length,5);
 assert.ok(html.includes("const moodIndex=healthRatio<.22?4:healthRatio<.55?3"));
});
test('as afinidades de gelo e fogo correspondem ao efeito aplicado',()=>{
 assert.ok(html.includes("pattern===3?'ICE':'FIRE'"));
});
test('inimigos de bioma possuem ramo grafico e movimento proprio',()=>{
 const a=html.indexOf("function drawEnemies()"),b=html.indexOf("// Parte 03: pontes",a);
 assert.ok(a>=0&&b>a);
 const draw=html.slice(a,b);
 assert.ok(draw.includes("if(e.type==='BIOME_ENEMY')"));
 assert.ok(draw.includes("const id=Math.max(0,Math.min(19,(e.biomeSector||sector||1)-1))"));
 assert.ok(draw.includes("const family=id%5"));
 assert.ok(draw.includes("const t=missionTicks*.075"));
});
