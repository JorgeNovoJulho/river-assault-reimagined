/* RiverStorm - lobby WebRTC, até 8 participantes. Depende de PeerJS Cloud. */
(()=>{
'use strict';
const maxPlayers=8, reconnectWindow=25000, roundLimit=15*60*1000;
const members=new Map();
let round=null, roundNumber=0, champion=null, joinId='', ticket='', pending=[], retryTimer, reconnectDeadline=0;
let busy=false, attempt=0;
let peer=null,host=false,roomCode='',secret='',connections=new Map(),name='Piloto',peerReady=false, rosterSize=0, joinTimer, session=0;
const el=(tag,attrs={},children=[])=>{const n=document.createElement(tag);Object.assign(n,attrs);children.forEach(c=>n.append(c));return n;};
const css='background:#0b2137;color:#e2faff;border:1px solid #38bdf8;border-radius:8px;padding:8px;font:600 12px sans-serif;';
function show(message){const status=document.getElementById('river-room-status');if(status)status.textContent=message;}
function count(){
 const out=document.getElementById('river-room-count');
 const total=host&&peerReady?1+connections.size:rosterSize;
 if(out)out.textContent='Participantes conectados: '+total+' / '+maxPlayers;
 const b=document.getElementById('river-room-start');
 if(b){b.hidden=!host||!peerReady;b.disabled=!host||!peerReady||connections.size===0||Boolean(round)||Boolean(champion)||[...members.values()].some(member=>!member.out&&!member.online);}
}
function broadcast(message){
 for(const conn of connections.values())if(conn.open)conn.send(message);
}
function publishRoster(){
 broadcast({type:'roster',players:1+connections.size});count();
}
function drawStandings(rows,summary){
 const board=document.getElementById('river-room-standings');
 if(!board)return;
 board.replaceChildren(el('strong',{textContent:summary}));
 for(const row of rows)board.append(el('div',{textContent:row.name+' · '+row.points+' pts · '+(row.out?'ELIMINADO':row.online?'CONECTADO':'RECONECTANDO')}));
}
function standings(){
 const rows=[...members.values()].sort((a,b)=>b.points-a.points||a.name.localeCompare(b.name));
 const summary=champion?'CAMPEÃO: '+champion:round?'RODADA '+round.round+' · MISSÕES '+round.start+'–'+round.end:'PLACAR DA SALA';
 drawStandings(rows,summary);
 broadcast({type:'standings',rows:rows.map(({name,points,out,online})=>({name,points,out,online})),summary});
 count();
}
function clearCompetition(){
 for(const member of members.values())clearTimeout(member.timer);
 members.clear();clearTimeout(round?.timer);round=null;roundNumber=0;champion=null;pending=[];ticket='';joinId='';
 clearTimeout(retryTimer);reconnectDeadline=0;
 drawStandings([],'');
 window.RiverRoomGame?.stop();
}
function finishRound(){
 if(!round)return;
 const pilots=[...round.results.values()];
 if(pilots.some(result=>!result.done))return;
 pilots.sort((a,b)=>Number(a.failed)-Number(b.failed)||b.next-a.next||b.points-a.points||a.hits-b.hits||a.id.localeCompare(b.id));
 for(const pilot of pilots)if(pilot.failed)members.get(pilot.id).out=true;
 const survivors=pilots.filter(pilot=>!members.get(pilot.id).out);
 if(survivors.length>1)members.get(survivors.at(-1).id).out=true;
 const remaining=survivors.filter(pilot=>!members.get(pilot.id).out);
 if(remaining.length<=1||round.end===20)champion=remaining[0]?members.get(remaining[0].id).name:'SEM VENCEDOR';
 clearTimeout(round.timer);round=null;
 window.RiverRoomGame?.stop();
 standings();
 show(champion?'Torneio encerrado. '+champion:'Rodada concluída. O anfitrião já pode iniciar a próxima.');
 broadcast({type:'round-ended',champion});
}
function acceptResult(id,msg){
 const member=members.get(id);
 if(!member)return false;
 if(!round||msg.round!==round.round)return msg.round===member.receipt?.round&&Number.isInteger(msg.mission)&&msg.mission<=member.receipt.mission;
 const result=round.results.get(id);
 if(!result||!Number.isInteger(msg.mission)||msg.mission<round.start||msg.mission>round.end)return false;
 if(msg.mission<result.next)return true; // retransmissão de um resultado já aceito
 if(result.done||msg.mission!==result.next||!Number.isInteger(msg.points)||msg.points<0||msg.points>250000||
    !Number.isInteger(msg.hits)||msg.hits<0||msg.hits>10000||typeof msg.failed!=='boolean')return false;
 result.next++;result.points+=msg.points;result.hits+=msg.hits;result.failed=msg.failed;
 result.done=msg.failed||msg.mission===round.end;
 member.points+=msg.points;
 member.receipt={round:msg.round,mission:msg.mission};
 standings();finishRound();
 return true;
}
function forfeit(id){
 const member=members.get(id);if(!member)return;
 member.out=true;member.online=false;clearTimeout(member.timer);
 const result=round?.results.get(id);
 if(result&&!result.done){result.failed=true;result.done=true;}
 if(roundNumber===0)members.delete(id);
 finishRound();standings();
}
function retryGuest(){
 clearTimeout(retryTimer);
 if(!ticket||!joinId||!peer||peer.destroyed)return;
 if(!reconnectDeadline)reconnectDeadline=Date.now()+reconnectWindow;
 if(Date.now()>=reconnectDeadline){
  disconnect();show('Tempo de reconexão esgotado.');return;
 }
 show('Conexão interrompida. Tentando retornar à sala…');
 retryTimer=setTimeout(()=>{
  if(peer.disconnected){try{peer.reconnect();}catch(_){}}
  const conn=peer.connect(joinId,{reliable:true,serialization:'json'});
  if(conn)register(conn,false);
  retryTimer=setTimeout(retryGuest,3000);
 },1200);
}
window.RiverRoom={
 report(msg){
  if(host){acceptResult(peer.id,msg);return;}
  pending.push(msg);
  broadcast({type:'mission-result',...msg});
 }
};
function code(){return Array.from(crypto.getRandomValues(new Uint8Array(4))).map(n=>(n%10)).join('');}
const lan=new URLSearchParams(location.search).get('lan')==='1';
function loadPeer(){
 if(!window.Peer)throw new Error('Cliente PeerJS indisponível no pacote');
}
function signalOptions(){
 if(lan)return {host:location.hostname,port:Number(location.port)||(location.protocol==='https:'?443:80),
  path:'/river-peer',secure:location.protocol==='https:',config:{iceServers:[]}};
 return {host:'0.peerjs.com',port:443,path:'/',secure:true,debug:1};
}
function disconnect(graceful=false){
 session++;clearTimeout(joinTimer);
 const channels=[...connections.values()], signaling=peer;
 connections.clear();peer=null;
 const close=()=>{
  for(const channel of channels)try{channel.close()}catch(_){}
  if(signaling)try{signaling.destroy()}catch(_){}
 };
 if(graceful)setTimeout(close,250);else close();
 host=false;peerReady=false;rosterSize=0;clearCompetition();count();
}
function register(conn,fromHost){
 const generation=session;
 let rejected=false;
 const guard=setTimeout(()=>{if(connections.get(conn.peer)!==conn)conn.close();},10000);
 const current=()=>generation===session;
 conn.on('open',()=>{
  if(!current()){conn.close();return;}
  if(!fromHost)conn.send({type:'hello',password:secret,name,ticket});
  else show('Conexão recebida: verificando senha…');
 });
 conn.on('data',msg=>{
  if(!current()||rejected||!msg||typeof msg!=='object')return;
  const authenticated=connections.get(conn.peer)===conn;
  if(fromHost&&host&&msg.type==='hello'&&!authenticated){
   const existing=members.get(conn.peer);
   const resume=Boolean(existing&&existing.ticket===msg.ticket&&!existing.out);
   const reason=resume?'':roundNumber?'Torneio já iniciado':String(msg.password)!==secret?'Senha incorreta':
     members.size>=maxPlayers?'Sala cheia':existing?'Conexão duplicada':'';
   if(reason){rejected=true;conn.send({type:'reject',reason});clearTimeout(guard);setTimeout(()=>conn.close(),400);return;}
   clearTimeout(guard);
   const member=resume?existing:{name:String(msg.name||'visitante').slice(0,24),points:0,out:false,ticket:Array.from(crypto.getRandomValues(new Uint8Array(16)),byte=>byte.toString(16).padStart(2,'0')).join('')};
   clearTimeout(member.timer);member.online=true;members.set(conn.peer,member);
   const previous=connections.get(conn.peer);
   connections.set(conn.peer,conn);
   if(previous&&previous!==conn)previous.close();
   conn.send({type:'welcome',room:roomCode,players:1+connections.size,ticket:member.ticket});
   show('Piloto '+member.name+(resume?' retornou à sala.':' entrou na sala.'));
   publishRoster();standings();
  }else if(fromHost&&host&&authenticated){
   if(msg.type==='mission-result'&&acceptResult(conn.peer,msg))conn.send({type:'result-ack',round:msg.round,mission:msg.mission});
   if(msg.type==='leave'){forfeit(conn.peer);conn.close();}
  }else if(!fromHost&&!host){
   if(msg.type==='welcome'&&!authenticated){
    clearTimeout(guard);clearTimeout(joinTimer);clearTimeout(retryTimer);
    reconnectDeadline=0;ticket=msg.ticket;
    connections.set(conn.peer,conn);rosterSize=msg.players;
    show('Conectado à sala '+msg.room+'.');count();
    for(const result of pending)conn.send({type:'mission-result',...result});
   }else if(msg.type==='reject'&&!authenticated){
    rejected=true;clearTimeout(joinTimer);disconnect();show(msg.reason||'Entrada recusada');conn.close();
   }else if(authenticated&&msg.type==='roster'){
    if(Number.isInteger(msg.players)&&msg.players>=1&&msg.players<=maxPlayers){rosterSize=msg.players;count();}
   }else if(authenticated&&msg.type==='room-closed'){
    disconnect();show('O anfitrião encerrou a sala.');
   }else if(authenticated&&msg.type==='standings'&&Array.isArray(msg.rows)){
    drawStandings(msg.rows,msg.summary);
   }else if(authenticated&&msg.type==='result-ack'){
    pending=pending.filter(result=>result.round!==msg.round||result.mission!==msg.mission);
   }else if(authenticated&&msg.type==='round-ended'){
    window.RiverRoomGame?.stop();
    show(msg.champion?'Torneio encerrado. '+msg.champion:'Rodada concluída. Aguarde o anfitrião.');
   }else if(authenticated&&msg.type==='start-challenge'&&Number.isInteger(msg.round)&&msg.round>roundNumber&&
     Number.isInteger(msg.start)&&msg.start>=1&&Number.isInteger(msg.end)&&msg.end>=msg.start&&msg.end<=20){
    roundNumber=msg.round;
    show('Rodada '+msg.round+' iniciada pelo anfitrião!');
    window.RiverRoomGame?.start(msg);
   }
  }
 });
 conn.on('close',()=>{
  clearTimeout(guard);
  if(!current()||rejected||connections.get(conn.peer)!==conn)return;
  connections.delete(conn.peer);
  if(host){
   const member=members.get(conn.peer);
   if(member){
    member.online=false;
    clearTimeout(member.timer);
    if(!member.out)member.timer=setTimeout(()=>forfeit(conn.peer),reconnectWindow);
   }
   show('Conexão de um convidado interrompida.');publishRoster();standings();
  }else{rosterSize=0;count();retryGuest();}
 });
 conn.on('error',e=>{if(current()&&!rejected)show('Erro de conexão: '+(e.message||e.type||'desconhecido'));});
}
function startChallenge(){
 if(!host||!peerReady||!peer||peer.destroyed||round||champion)return;
 const pilots=[...members].filter(([,member])=>!member.out);
 if(pilots.length<2||pilots.some(([,member])=>!member.online)){
  show('Aguarde pelo menos dois participantes ativos e conectados.');return;
 }
 const start=roundNumber*3+1;
 const descriptor={round:roundNumber+1,start,end:Math.min(20,start+2)};
 if(pilots.some(([id])=>id===peer.id)&&!window.RiverRoomGame?.start(descriptor)){show('Não foi possível iniciar a rodada.');return;}
 roundNumber=descriptor.round;
 round={...descriptor,results:new Map(pilots.map(([id])=>[id,{id,next:start,points:0,hits:0,done:false,failed:false}]))};
 round.timer=setTimeout(()=>{
  for(const result of round.results.values())if(!result.done){result.done=true;result.failed=true;}
  finishRound();
 },roundLimit);
 for(const [id,member] of pilots)if(id!==peer.id)connections.get(id)?.send({type:'start-challenge',...descriptor});
 standings();
}
function setupPeer(id){
 return new Promise((resolve,reject)=>{
  peerReady=false;
  const options=signalOptions();
  peer=id?new window.Peer(id,options):new window.Peer(options);
  const generation=session;
  let settled=false;
  const guard=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Tempo esgotado na sinalização PeerJS'));}},12000);
  peer.on('open',id=>{if(generation!==session)return;peerReady=true;count();if(!settled){settled=true;clearTimeout(guard);resolve(id);}});
  peer.on('error',err=>{if(generation!==session)return;const reason=err.message||err.type||'erro desconhecido';peerReady=false;count();show('Falha na sinalização: '+reason+'. Sala não criada.');if(!settled){settled=true;clearTimeout(guard);reject(err);}});

  peer.on('disconnected',()=>{if(generation!==session)return;peerReady=false;count();show('Sinalização interrompida. Tentando reconectar…');
   try{peer.reconnect();}catch(_){}});
  peer.on('connection',conn=>{if(generation!==session||!host){conn.close();return;}register(conn,true)});
 });
}
async function create(){
 if(busy)return;
 busy=true;const operation=++attempt;
 const button=document.getElementById('river-room-create');button.disabled=true;
 try{
  await loadPeer();if(operation!==attempt)return;disconnect();host=true;
  name=(document.getElementById('river-room-name').value||'Piloto').slice(0,24);
  roomCode=code();secret=document.getElementById('river-room-password').value.trim()||code();
  document.getElementById('river-room-password').value=secret;
  const id='riverstorm-'+roomCode+'-'+code();
  show('Criando sala na rede…');await setupPeer(id);
  if(operation!==attempt)return;
  members.set(id,{name,points:0,out:false,online:true});
  document.getElementById('river-room-code').value=id;
  show('Sala confirmada no servidor! Compartilhe código e senha.');standings();
 }catch(error){if(operation!==attempt)return;disconnect();document.getElementById('river-room-code').value='';show('Sala NÃO criada: '+error.message+(lan?'. Verifique se o sinalizador LAN está ativo.':'. O PeerJS público pode estar indisponível.'));}
 finally{button.disabled=false;if(operation===attempt)busy=false;}
}
async function join(){
 if(busy)return;
 busy=true;const operation=++attempt;
 const button=document.getElementById('river-room-join');button.disabled=true;
 try{
  await loadPeer();if(operation!==attempt)return;disconnect();host=false;
  name=(document.getElementById('river-room-name').value||'Piloto').slice(0,24);
  secret=document.getElementById('river-room-password').value.trim();
  const id=document.getElementById('river-room-code').value.trim();
  if(!/^riverstorm-[0-9]{4}-[0-9]{4}$/.test(id)||!secret)throw Error('Preencha código válido e senha');
  joinId=id;show('Conectando…');await setupPeer();
  if(operation!==attempt)return;
  const conn=peer.connect(id,{reliable:true,serialization:'json'});
  if(!conn)throw Error('Não foi possível abrir canal de dados');
  register(conn,false);
  joinTimer=setTimeout(()=>{if(!connections.has(id)){show('Ainda não entrou na sala: confira o anfitrião, código, senha e a rede.');conn.close();}},8000);
 }catch(error){if(operation!==attempt)return;show('Não foi possível entrar: '+error.message);disconnect();}
 finally{button.disabled=false;if(operation===attempt)busy=false;}
}
function init(){
 const root=document.getElementById('mode-multi-info')||document.getElementById('start-screen');if(!root||document.getElementById('river-room-panel'))return;
 const panel=el('section',{id:'river-room-panel'});
 panel.style.cssText='position:relative;z-index:3;width:min(95%,440px);max-height:270px;overflow:auto;margin:8px auto;padding:9px;border:1px solid #38bdf8;border-radius:10px;background:#061624ed;color:#fff;font:12px sans-serif;';
 const heading=el('strong',{textContent:'MULTIPLAYER — CRIAR OU ENTRAR NA SALA (até 8)'});
 const row=el('div');row.style.cssText='display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;';
 const mk=(id,ph,type='text')=>{const input=el('input',{id,placeholder:ph,type});input.style.cssText=css+'min-width:90px;flex:1';return input;};
 const nickname=mk('river-room-name','Nome do piloto');nickname.maxLength=24;
 const room=mk('river-room-code','Código da sala');
 const pass=mk('river-room-password','Senha');pass.maxLength=36;
 row.append(nickname,room,pass);
 const buttons=el('div');buttons.style.cssText='display:flex;gap:5px;margin-top:6px;';
 const createBtn=el('button',{id:'river-room-create',textContent:'CRIAR SALA',type:'button'});
 const joinBtn=el('button',{id:'river-room-join',textContent:'ENTRAR NA SALA',type:'button'});
 for(const b of [createBtn,joinBtn])b.style.cssText=css+'cursor:pointer;flex:1';
 createBtn.addEventListener('click',create);joinBtn.addEventListener('click',join);
 buttons.append(createBtn,joinBtn);
 const startBtn=el('button',{id:'river-room-start',textContent:'INICIAR DESAFIO COM A SALA',type:'button'});
 startBtn.style.cssText=css+'width:100%;margin-top:6px;cursor:pointer;background:#14532d';
 startBtn.hidden=true;startBtn.addEventListener('click',startChallenge);
 const status=el('div',{id:'river-room-status',textContent:lan?'Sinalização LAN local. Use código e senha.':'Sala online por WebRTC. Use código e senha.'});
 status.style.marginTop='7px';
 const participants=el('div',{id:'river-room-count',textContent:'Participantes conectados: 0 / 8'});
 panel.append(heading,row,buttons,startBtn,status,participants,el('div',{id:'river-room-standings'}));
 document.getElementById('mode-multi-back')?.addEventListener('click',()=>{
  attempt++;busy=false;
  broadcast({type:host?'room-closed':'leave'});
  disconnect(true);room.value='';show('Sala encerrada neste navegador.');
 });
 const notice=root.querySelector('p');if(root.id==='mode-multi-info'&&notice)notice.textContent=lan?'Rede local com sinalizador RiverStorm.':'Sala online. Requer internet.';
 const actions=root.id==='mode-multi-info'?document.getElementById('mode-multi-back'):document.getElementById('start-actions');root.insertBefore(panel,actions&&actions.parentNode===root?actions:null);count();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
