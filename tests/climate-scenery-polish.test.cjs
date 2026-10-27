const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const g=fs.readFileSync('index.html','utf8'),r=fs.readFileSync('src/render/scene2d5.js','utf8');
test('renderizadores íntegros',()=>{assert.ok(g.length>300000);assert.ok(r.length>90000);});
test('cinco climas possuem efeitos visuais',()=>{for(const id of ['RAIN','WIND','HEAT','FOG','SNOW'])assert.ok(g.includes("weather==='"+id+"'"));assert.ok(g.includes("function drawClimateOverlay()"));assert.ok(g.includes("drawClimateOverlay();"));});
test('clima atua no jogo e tem efeito sonoro',()=>{assert.ok(g.includes('updateClimateGameplay();'));assert.ok(g.includes("playClimateSound('THUNDER')"));assert.ok(g.includes('climateSnow'));assert.ok(g.includes('climateHeat'));});
test('vinte setores possuem adereços ambientais',()=>{assert.ok(r.includes('function livingSetDressing('));assert.ok(r.includes('livingSetDressing(c,d,t);'));const m=r.match(/const kinds=\[([^\]]+)\]/);assert.ok(m);assert.equal(m[1].split(',').length,20);});
