const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function progress(){const context={window:{}};vm.runInNewContext(fs.readFileSync('src/game/pilot-progress.js','utf8'),context);return context.window.RiverPilotProgress;}
test('XP: começa no nível zero e chega ao nível máximo 100',()=>{
 const p=progress();assert.equal(p.levelFor(0),0);assert.equal(p.levelFor(899),0);
 assert.equal(p.levelFor(900),1);assert.equal(p.levelFor(p.threshold(100)),100);
 assert.equal(p.levelFor(Number.MAX_SAFE_INTEGER),100);assert.equal(p.levelFor(-100),0);
});
test('XP: níveis crescentes e limite de pontos',()=>{
 const p=progress();for(let l=0;l<100;l++){assert.ok(p.threshold(l+1)>p.threshold(l));assert.equal(p.levelFor(p.threshold(l)),l);}
 assert.equal(p.cap(Infinity),p.threshold(100));assert.equal(p.cap(p.threshold(100)+100000),p.threshold(100));
});
test('XP: bônus graduais de dano, resistência e combustível',()=>{
 const p=progress(),a=p.bonus(0),b=p.bonus(50),c=p.bonus(100);
 assert.equal(a.damage,1);assert.equal(a.resistance,1);assert.equal(a.fuel,1);
 assert.ok(a.damage<b.damage&&b.damage<c.damage);
 assert.ok(a.resistance>b.resistance&&b.resistance>c.resistance);
 assert.ok(a.fuel>b.fuel&&b.fuel>c.fuel);
 assert.equal(p.bonus(200).damage,c.damage);
});
