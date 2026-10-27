/* RiverStorm - lobby WebRTC, até 8 participantes. Depende de PeerJS Cloud. */
(()=>{
'use strict';
const maxPlayers=8;
let peer=null,host=false,roomCode='',secret='',connections=new Map(),name='Piloto',peerReady=false;
const el=(tag,attrs={},children=[])=>{const n=document.createElement(tag);Object.assign(n,attrs);children.forEach(c=>n.append(c));return n;};
const css='background:#0b2137;color:#e2faff;border:1px solid #38bdf8;border-radius:8px;padding:8px;font:600 12px sans-serif;';
function show(message){const status=document.getElementById('river-room-status');if(status)status.textContent=message;}
function count(){const out=document.getElementById('river-room-count');if(out)out.textContent='Participantes conectados: '+(peerReady?1:0)+connections.size+' / '+maxPlayers;const b=document.getElementById('river-room-start');if(b){b.hidden=!host||!peerReady;b.disabled=!host||!peerReady;}}
function code(){return Array.from(crypto.getRandomValues(new Uint8Array(4))).map(n=>(n%10)).join('');}
function loadPeer(){
 return new Promise((resolve,reject)=>{
  if(window.Peer){resolve();return;}
  const script=document.createElement('script');
  script.src='https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js';
  script.onload=()=>window.Peer?resolve():reject(new Error('Biblioteca PeerJS indisponível'));
  script.onerror=()=>reject(new Error('Não foi possível carregar a conexão WebRTC'));
  document.head.appendChild(script);
 });
}
function disconnect(){
 for(const c of connections.values())try{c.close()}catch(_){}
 connections.clear();
 if(peer){try{peer.destroy()}catch(_){}peer=null;}
 host=false;peerReady=false;count();
}
function register(conn,fromHost){
 conn.on('open',()=>{
  if(!fromHost)conn.send({type:'hello',password:secret,name});
  else show('Conexão recebida: verificando senha…');
 });
 conn.on('data',msg=>{
  if(!msg||typeof msg!=='object')return;
  if(host&&msg.type==='hello'){
   if(String(msg.password)!==secret){conn.send({type:'reject',reason:'Senha incorreta'});conn.close();return;}
   if(connections.size>=maxPlayers-1){conn.send({type:'reject',reason:'Sala cheia'});conn.close();return;}
   connections.set(conn.peer,conn);
   conn.send({type:'welcome',room:roomCode,players:1+connections.size});
   show('Piloto '+String(msg.name||'visitante').slice(0,24)+' entrou na sala.');count();
  }else if(!host&&msg.type==='welcome'){
   connections.set(conn.peer,conn);show('Conectado à sala '+msg.room+'. Lobby pronto para teste.');count();
  }else if(msg.type==='start-challenge'){show('Desafio iniciado pelo anfitrião!');launchChallenge(msg.mission);}
  else if(msg.type==='reject'){show(msg.reason||'Entrada recusada');conn.close();}
 });
 conn.on('close',()=>{connections.delete(conn.peer);show('Conexão encerrada.');count();});
 conn.on('error',e=>show('Erro de conexão: '+(e.message||e.type||'desconhecido')));
}
function launchChallenge(mission){
 const select=document.getElementById('level-select');if(select&&mission)select.value=String(mission);
 document.getElementById('mode-selection')?.classList.add('hidden');
 const start=document.getElementById('start-btn');
 if(start)start.click();else show('Botão de iniciar missão indisponível.');
}
function startChallenge(){
 if(!host||!peerReady||!peer||peer.destroyed){show('A sala precisa estar conectada antes de começar.');return;}
 const mission=Number(document.getElementById('level-select')?.value)||1;
 for(const c of connections.values())if(c.open)c.send({type:'start-challenge',mission});
 launchChallenge(mission);
}
function setupPeer(id){
 return new Promise((resolve,reject)=>{
  peerReady=false;
  peer=id?new window.Peer(id,{host:'0.peerjs.com',port:443,path:'/',secure:true,debug:1}):new window.Peer({host:'0.peerjs.com',port:443,path:'/',secure:true,debug:1});
  let settled=false;
  const guard=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Tempo esgotado na sinalização PeerJS'));}},12000);
  peer.on('open',id=>{if(settled)return;settled=true;peerReady=true;clearTimeout(guard);count();resolve(id);});
  peer.on('error',err=>{const reason=err.message||err.type||'erro desconhecido';peerReady=false;count();show('Falha na sinalização: '+reason+'. Sala não criada.');if(!settled){settled=true;clearTimeout(guard);reject(err);}});

  peer.on('disconnected',()=>{peerReady=false;count();show('Servidor PeerJS desconectado: sessão indisponível.');});
  peer.on('connection',conn=>{if(!host){conn.close();return;}register(conn,true)});
 });
}
async function create(){
 const button=document.getElementById('river-room-create');button.disabled=true;
 try{
  await loadPeer();disconnect();host=true;
  name=(document.getElementById('river-room-name').value||'Piloto').slice(0,24);
  roomCode=code();secret=document.getElementById('river-room-password').value.trim()||code();
  document.getElementById('river-room-password').value=secret;
  const id='riverstorm-'+roomCode+'-'+code();
  show('Criando sala na rede…');await setupPeer(id);
  document.getElementById('river-room-code').value=id;
  show('Sala confirmada no servidor! Compartilhe código e senha.');count();
 }catch(error){disconnect();document.getElementById('river-room-code').value='';show('Sala NÃO criada: '+error.message+'. O PeerJS público pode estar indisponível.');}
 finally{button.disabled=false;}
}
async function join(){
 const button=document.getElementById('river-room-join');button.disabled=true;
 try{
  await loadPeer();disconnect();host=false;
  name=(document.getElementById('river-room-name').value||'Piloto').slice(0,24);
  secret=document.getElementById('river-room-password').value.trim();
  const id=document.getElementById('river-room-code').value.trim();
  if(!/^riverstorm-[0-9]{4}-[0-9]{4}$/.test(id)||!secret)throw Error('Preencha código válido e senha');
  show('Conectando…');await setupPeer();
  const conn=peer.connect(id,{reliable:true,serialization:'json'});
  if(!conn)throw Error('Não foi possível abrir canal de dados');
  register(conn,false);
  setTimeout(()=>{if(!connections.has(id))show('Ainda não entrou na sala: confira o anfitrião, código, senha e a rede.');},8000);
 }catch(error){show('Não foi possível entrar: '+error.message);disconnect();}
 finally{button.disabled=false;}
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
 const status=el('div',{id:'river-room-status',textContent:'A sala usa internet (WebRTC). Código e senha são necessários para entrar.'});
 status.style.marginTop='7px';
 const participants=el('div',{id:'river-room-count',textContent:'Participantes conectados: 0 / 8'});
 panel.append(heading,row,buttons,startBtn,status,participants);
 const notice=root.querySelector('p');if(root.id==='mode-multi-info'&&notice)notice.textContent='Crie uma sala ou participe usando código e senha. Requer internet.';
 const actions=root.id==='mode-multi-info'?document.getElementById('mode-multi-back'):document.getElementById('start-actions');root.insertBefore(panel,actions&&actions.parentNode===root?actions:null);count();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
