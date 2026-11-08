const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const base='http://127.0.0.1:4175/';
function installFake(){
 const bus=new BroadcastChannel('audit-peer');
 let current;
 class Events {
  constructor(){this.listeners={}}
  on(k,fn){(this.listeners[k]??=[]).push(fn)}
  emit(k,v){for(const fn of this.listeners[k]||[])fn(v)}
 }
 class Conn extends Events{
  constructor(peer,key){super();this.peer=peer;this.key=key;this.open=false;}
  send(data){bus.postMessage({to:this.peer,from:current.id,key:this.key,op:'data',data})}
  close(){this.open=false;bus.postMessage({to:this.peer,from:current.id,key:this.key,op:'close'});this.emit('close')}
 }
 class Peer extends Events{
  constructor(id){super();this.id=typeof id==='string'?id:crypto.randomUUID();this.channels=new Map();current=this;setTimeout(()=>this.emit('open',this.id),0)}
  connect(to){const key=crypto.randomUUID(),c=new Conn(to,key);this.channels.set(key,c);bus.postMessage({to,from:this.id,key,op:'connect'});return c}
  destroy(){this.destroyed=true;this.channels.clear()}
 }
 bus.onmessage=({data:m})=>{
  if(!current||current.destroyed||current.id!==m.to)return;
  if(m.op==='connect'){
   const c=new Conn(m.from,m.key);current.channels.set(m.key,c);current.emit('connection',c);
   c.open=true;c.emit('open');
   bus.postMessage({to:m.from,from:current.id,key:m.key,op:'open'});
  }else{
   const c=current.channels.get(m.key);if(!c)return;
   if(m.op==='open')c.open=true;
   if(m.op==='close')c.open=false;
   c.emit(m.op,m.data);
  }
 };
 window.Peer=Peer;
 window.auditConnection=()=>[...current.channels.values()].findLast(channel=>channel.open);
}

async function run(){
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4175'],{stdio:'ignore'});
 let browser;
 try{
  let ready=false;
  for(let i=0;i<80;i++){
   try{if((await fetch(base)).ok){ready=true;break}}catch{}
   await new Promise(resolve=>setTimeout(resolve,200));
  }
  assert.ok(ready,'Prévia indisponível');
  browser=await chromium.launch({headless:true,executablePath:process.env.RIVER_CHROME||undefined});
  const context=await browser.newContext();
  await context.addInitScript(installFake);
  const open=async ()=>{
   const p=await context.newPage();
   await p.goto(base,{waitUntil:'domcontentloaded'});
   await p.locator('#mode-multi').click();
   return p;
  };
  const host=await open(),guest=await open(),guest2=await open();
  const status=p=>p.locator('#river-room-status').textContent();
  const counts=async expected=>{
   for(const p of [host,guest,guest2])await p.waitForFunction(value=>document.querySelector('#river-room-count').textContent.endsWith(value),expected);
  };
  await host.locator('#river-room-password').fill('audit-1234');
  await host.locator('#river-room-create').click();
  await host.waitForFunction(()=>document.querySelector('#river-room-code').value.startsWith('riverstorm-'));
  const room=await host.locator('#river-room-code').inputValue();
  assert.equal(await host.locator('#river-room-start').isEnabled(),false);
  // O canal abre, mas não tem senha nem autorização para iniciar o jogo.
  await guest2.evaluate(id=>new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(Error('A tentativa inválida não foi recusada')),5000);
   const attacker=new window.Peer();
   attacker.on('open',()=>{
    const conn=attacker.connect(id);
    conn.on('data',message=>{if(message.type==='reject'){clearTimeout(timeout);resolve();}});
    conn.on('open',()=>{
     conn.send({type:'start-challenge',mission:5});
     conn.send({type:'start-challenge',round:1,start:1,end:3});
     conn.send({type:'hello',password:'inválida',name:'Intruso'});
    });
   });
  }),room);
  await host.waitForFunction(()=>document.querySelector('#river-room-status').textContent.includes('verificando'));
  assert.equal(await host.evaluate(()=>gameState),'START');
  async function join(p,password){
   await p.locator('#river-room-code').fill(room);
   await p.locator('#river-room-password').fill(password);
   await p.locator('#river-room-join').click();
  }
  await join(guest,'errada');
  await guest.waitForFunction(()=>document.querySelector('#river-room-status').textContent==='Senha incorreta');
  await join(guest,'audit-1234');
  await join(guest2,'audit-1234');
  await counts('3 / 8');
  const capacity=await guest2.evaluate(async id=>{
   const bus=new BroadcastChannel('audit-peer');
   const accepted=[];
   try{
    for(let i=0;i<6;i++){
     const from='capacity-'+i,key=crypto.randomUUID();
     const reply=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('Teste de lotação sem resposta')),3000);
      bus.onmessage=({data:message})=>{
       if(message.to!==from||message.key!==key)return;
       if(message.op==='open')bus.postMessage({to:id,from,key,op:'data',data:{type:'hello',password:'audit-1234',name:from}});
       if(message.op==='data'){clearTimeout(timer);resolve(message.data);}
      };
      bus.postMessage({to:id,from,key,op:'connect'});
     });
     if(reply.type==='welcome')accepted.push({from,key});
     else return {accepted:accepted.length,reason:reply.reason};
    }
   }finally{
    for(const {from,key} of accepted)bus.postMessage({to:id,from,key,op:'data',data:{type:'leave'}});
    bus.close();
   }
  },room);
  assert.deepEqual(capacity,{accepted:5,reason:'Sala cheia'});
  await counts('3 / 8');
  const saved=await host.evaluate(()=>{
   localStorage.setItem(PENDING_MISSION_KEY,JSON.stringify({lastScore:850,lastEarned:850,lastPlane:'falcao'}));
   localStorage.setItem(CHECKPOINT_KEY,JSON.stringify({version:2,sector:8,journey,verifiedRun:true}));
   return [localStorage.getItem(PENDING_MISSION_KEY),localStorage.getItem(CHECKPOINT_KEY),pilotXP,bank,journey];
  });
  const play=async start=>{
   await host.locator('#river-room-start').click();
   await Promise.all([host,guest,guest2].slice(0,start===1?3:2).map(p=>p.waitForFunction(start=>gameState==='PLAYING'&&sector===start&&score===0,start)));
  };
  const mission=async(p,level,points)=>{
   await p.evaluate(({level,points})=>{
    sector=level;score+=points;reportRoomMission();
   },{level,points});
  };
  await play(1);
  assert.equal(await host.evaluate(()=>saveActiveProgress()),false);
  await guest.evaluate(()=>window.auditConnection().send({type:'mission-result',round:1,mission:3,points:250000,hits:0,failed:false}));
  await guest.evaluate(()=>window.auditConnection().close());
  await counts('3 / 8');
  await guest.waitForFunction(()=>document.querySelector('#river-room-status').textContent.startsWith('Conectado à sala'));
  await host.evaluate(()=>{
   spawnBoss(0,true);
   const boss=enemies.find(enemy=>enemy.type==='BOSS');
   boss.score=100;
   finishBossDefeatedBySkill(boss);
  });
  await guest.waitForFunction(()=>document.querySelector('#river-room-standings').textContent.includes('100 pts'));
  for(let level=1;level<=3;level++){
   if(level!==1)await mission(host,level,100);
   await mission(guest,level,75);
   await mission(guest2,level,25);
  }
  await host.waitForFunction(()=>document.querySelector('#river-room-standings').textContent.includes('75 pts · ELIMINADO'));
  assert.match(await guest.locator('#river-room-standings').textContent(),/225 pts/);
  await play(4);
  assert.equal(await guest2.evaluate(()=>gameState),'START');
  for(let level=4;level<=6;level++){
   await mission(host,level,100);
   await mission(guest,level,70);
  }
  await host.waitForFunction(()=>document.querySelector('#river-room-standings').textContent.includes('CAMPEÃO'));
  assert.equal(await host.locator('#river-room-start').isEnabled(),false);
  const after=await host.evaluate(()=>[localStorage.getItem(PENDING_MISSION_KEY),localStorage.getItem(CHECKPOINT_KEY),pilotXP,bank,journey]);
  assert.deepEqual(after,saved,'Torneio alterou o progresso da campanha solo');
  await guest2.locator('#mode-multi-back').click();
  for(const p of [host,guest])await p.waitForFunction(()=>document.querySelector('#river-room-count').textContent.endsWith('2 / 8'));
  await host.locator('#mode-multi-back').click();
  await guest.waitForFunction(()=>document.querySelector('#river-room-status').textContent==='O anfitrião encerrou a sala.');
  assert.equal(await status(guest),'O anfitrião encerrou a sala.');
  console.log('Lobby e torneio: autenticação, reconexão, eliminação, campeão e isolamento solo aprovados');
 }finally{await browser?.close();server.kill();}
}
run().catch(error=>{console.error(error);process.exitCode=1});
