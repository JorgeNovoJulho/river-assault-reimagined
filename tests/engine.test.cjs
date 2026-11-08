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
test('onze aeronaves têm cinco armas válidas e atributos próprios',()=>{
 const {PLANES,WEAPONS}=load('src/game/aircraft.js','RiverAircraft');
 assert.equal(Object.keys(PLANES).length,11);
 assert.equal(new Set(Object.values(PLANES).map(p=>p.scroll)).size,11);
 const extras=Object.values(PLANES).filter(plane=>plane.premiumExtra);
 assert.equal(extras.length,4);
 for(const plane of extras){
  assert.equal(plane.price,10000);
  assert.ok(plane.shieldMultiplier>1.5&&plane.damageMultiplier>1&&plane.powerMultiplier>1);
 }
 for(const plane of Object.values(PLANES)){
  assert.equal(plane.weapons.length,5);
  plane.weapons.forEach(w=>assert.ok(WEAPONS[w]));
 }
});
test('todos os padrões de armas produzem projéteis',()=>{
 const {PLANES,shoot}=load('src/game/aircraft.js','RiverAircraft');
 for(const plane of Object.values(PLANES))for(const weapon of plane.weapons){
  const bullets=[];
  shoot(weapon,{x:200,y:500},bullets);
  assert.ok(bullets.length>=1,weapon);
  assert.ok(bullets.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)));
 }
});

test('tiros padrão Premium têm perfis próprios e superam o alcance e dano da frota normal',()=>{
 const {PLANES,SIGNATURE_SHOTS,shoot,flightStats,shotOutOfRange}=load('src/game/aircraft.js','RiverAircraft');
 const fleet=Object.keys(PLANES).filter(id=>!PLANES[id].premiumExtra);
 const highestDamage=Math.max(...fleet.map(id=>flightStats(id).damage));
 const signatures=new Set();
 for(const [id,plane] of Object.entries(PLANES)){
  const shots=[];
  shoot(plane.weapons[0],{x:200,y:500,aircraftType:id},shots);
  const stats=flightStats(id);
  assert.equal(stats.damage,shots.reduce((total,shot)=>total+shot.damage,0));
  assert.equal(stats.speed,plane.speed);
  assert.equal(stats.shield,Math.round(150*(plane.shieldMultiplier||1)));
  assert.equal(stats.autonomy,100/(stats.fuelRate*60));
  const shot=shots[0],range=shot.rangeRemaining;
  if(plane.premiumExtra){
   assert.ok(stats.damage>highestDamage,id);
   assert.ok(range>520,id);
   assert.equal(range,SIGNATURE_SHOTS[plane.weapons[0]].range);
   signatures.add(JSON.stringify(shots.map(b=>[b.x,b.vx,b.speed,b.type])));
  }else assert.equal(range,520);
  assert.equal(shotOutOfRange(shot,shot.x,shot.y+range-1),false);
  assert.equal(shotOutOfRange(shot,shot.x,shot.y+2),true);
 }
 assert.equal(signatures.size,4);
});
