const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('let confirming=false,lastCard=-1,lastCardClick=0;');
const end=html.indexOf("detail.querySelector('#rs-pilot-confirm')",start);
const code=html.slice(start,end)+'\nthis.confirm=confirm;';
function fixture(id,allowed=true,entrySucceeds=true){
 const queue=[],classes=new Set(),hidden=[];let entries=0;
 const ids=['falcao','vespa','cometa','fenix','helicoptero','disco','titan'];
 const select={value:'',dispatchEvent(){}};
 const ctx={ids,current:ids.indexOf(id),names:ids,unlocked:allowed?[id]:[],
  document:{getElementById:()=>select},Event:class{},localStorage:{setItem(){}},
  buttons:ids.map(()=>({classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}})),
  screen:{classList:{add:c=>hidden.push(c)},querySelector:()=>({textContent:''})},
  modeSelection:{classList:{add:c=>hidden.push(c)}},gameState:'START',
  setTimeout:fn=>queue.push(fn),startSoloFlight:launch=>launch(),enterGameplay(){entries++;if(entrySucceeds)ctx.gameState='PLAYING';}};
 vm.runInNewContext(code,ctx);return {ctx,queue,classes,hidden,select,entries:()=>entries};
}
test('seven unlocked pilot identities flash then enter the full campaign exactly once',()=>{
 for(const id of ['falcao','vespa','cometa','fenix','helicoptero','disco','titan']){
  const f=fixture(id);f.ctx.confirm();f.ctx.confirm();
  assert.equal(f.select.value,id);assert.equal(f.queue.length,1);assert.equal(f.entries(),0);
  assert.ok(f.classes.has('rs-pilot-confirming'));assert.equal(f.hidden.length,0);
  f.queue[0]();assert.equal(f.entries(),1);assert.equal(f.ctx.gameState,'PLAYING');
  assert.equal(f.hidden.length,2);assert.equal(f.classes.size,0);
 }
});
test('locked aircraft and failed campaign entry do not silently dismiss pilot selection',()=>{
 const locked=fixture('titan',false);locked.ctx.confirm();assert.equal(locked.queue.length,0);
 const failed=fixture('falcao',true,false);failed.ctx.confirm();failed.queue[0]();assert.equal(failed.hidden.length,0);
});
