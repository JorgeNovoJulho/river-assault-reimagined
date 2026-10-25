const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function load(file,key){
 const window={}; const sandbox={window,localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{getGamepads:()=>[]},Date,Math};
 vm.runInNewContext(fs.readFileSync(file,'utf8'),sandbox);
 return window[key];
}
test('relógio executa 60 updates em um segundo com frames normais',()=>{
 const Clock=load('src/game/clock.js','RiverClock');
 const clock=new Clock();
 let count=0;
 clock.advance(0,()=>count++);
 for(let i=1;i<=60;i++)clock.advance(i*1000/60,()=>count++);
 assert.ok(count>=59&&count<=60, 'passos obtidos: '+count);
});
test('relógio limita atualizações em travamentos',()=>{
 const Clock=load('src/game/clock.js','RiverClock');
 const clock=new Clock({maxSteps:4});
 clock.advance(0,()=>{});
 let count=0;
 clock.advance(1000,()=>count++);
 assert.equal(count,4);
 assert.equal(clock.droppedFrames,1);
});
test('cada aeronave tem cinco armas válidas e propriedades distintas',()=>{
 const {PLANES,WEAPONS}=load('src/game/aircraft.js','RiverAircraft');
 assert.equal(Object.keys(PLANES).length,3);
 assert.equal(new Set(Object.values(PLANES).map(p=>p.scroll)).size,3);
 for(const plane of Object.values(PLANES)){
  assert.equal(plane.weapons.length,5);
  plane.weapons.forEach(w=>assert.ok(WEAPONS[w]));
 }
});
test('todas as quinze armas produzem projéteis',()=>{
 const {PLANES,shoot}=load('src/game/aircraft.js','RiverAircraft');
 for(const plane of Object.values(PLANES))for(const weapon of plane.weapons){
  const bullets=[];
  shoot(weapon,{x:200,y:500},bullets);
  assert.ok(bullets.length>=1,weapon);
  assert.ok(bullets.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)));
 }
});
