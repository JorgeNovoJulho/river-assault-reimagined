const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const game=fs.readFileSync('index.html','utf8');
test('jogo possui inicializacao e canvas',()=>{assert.match(game,/id="gameCanvas"/);assert.match(game,/function update\(\)/);});
test('JavaScript inline compila',()=>{
 const scripts=[...game.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
 for(const [,attrs,code] of scripts){if(!attrs.includes('src='))assert.doesNotThrow(()=>new vm.Script(code));}
});
test('fusao dura 6s, impede tiros e restaura armamento',()=>{
 assert.match(game,/fusionTicks=360/);
 assert.match(game,/fusionTicks>0\) return/);
 assert.match(game,/fusionPreviousArmament/);
 assert.match(game,/player\.weapon=fusionPreviousArmament\.weapon/);
 assert.match(game,/w\.hp=w\.maxHp/);
});
test('feixe de fusao verifica pontes represas e ilhas',()=>{
 assert.match(game,/for\(const collection of \[structures,islands\]\)/);
 assert.match(game,/beamHalfWidth=27/);
 assert.match(game,/collection\.splice\(i,1\)/);
});
test('scripts obrigatorios existem',()=>{
 for(const [,p] of game.matchAll(/<script[^>]+src="\.\/([^"]+)"/g)){
  assert.ok(fs.existsSync(p.split('?')[0]),p);
 }
});
test('lobby e renderer compilam',()=>{
 for(const p of ['src/net/room-lobby.js','src/render/scene2d5.js']){
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(p,'utf8')));
 }
});
