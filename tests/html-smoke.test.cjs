const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('HTML contém área de jogo, controles e interface de seleção',()=>{
 const html=fs.readFileSync('index.html','utf8');
 for(const id of ['gameCanvas','start-btn','plane-select','virtual-joystick','btn-fire','btn-bomb','controller-settings']){
  assert.ok(html.includes('id="'+id+'"'),id+' ausente');
 }
 assert.ok(html.includes('src="./src/game/clock.js"'));
 assert.ok(html.includes('src="./src/game/aircraft.js"'));
});
test('script principal tem sintaxe JavaScript válida',()=>{
 const html=fs.readFileSync('index.html','utf8');
 const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
 assert.equal(inline.length,1);
 new vm.Script(inline[0],{filename:'index-inline.js'});
});
