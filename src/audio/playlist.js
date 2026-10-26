/* Playlist offline: imports persisted in IndexedDB; optional bundled assets. */
(function(global) {
'use strict';
const STORE='songs',DB='river-assault-music-v1';
const PRESET=[
 {
  "id": "bundled-01",
  "name": "Airwolf — Main Theme (Remix 2026)",
  "url": "./music/track-01.opus"
 },
 {
  "id": "bundled-02",
  "name": "Airwolf — Theme (HQ Mix)",
  "url": "./music/track-02.opus"
 },
 {
  "id": "bundled-03",
  "name": "Airwolf — Below the Radar (Synthwave Cover)",
  "url": "./music/track-03.opus"
 },
 {
  "id": "bundled-04",
  "name": "Airwolf — Ethereal Instrumental Remix",
  "url": "./music/track-04.opus"
 },
 {
  "id": "bundled-05",
  "name": "Esaka / KOF ’98 — Epic Rock Version",
  "url": "./music/track-05.opus"
 },
 {
  "id": "bundled-06",
  "name": "Rising Crimson — Heroic Cyber Rock",
  "url": "./music/track-06.opus"
 },
 {
  "id": "bundled-07",
  "name": "Salamander — Planet Ratis (Arrange)",
  "url": "./music/track-07.opus"
 },
 {
  "id": "bundled-08",
  "name": "Samurai Shodown — Galford Theme (Metal Arrange)",
  "url": "./music/track-08.opus"
 },
 {
  "id": "bundled-09",
  "name": "Sarah Regina — U.S. Mangá (Instrumental)",
  "url": "./music/track-09.opus"
 },
 {
  "id": "bundled-10",
  "name": "Sector 7 Defense Line — Shoot ’em Up Music",
  "url": "./music/track-10.opus"
 },
 {
  "id": "bundled-11",
  "name": "Skyfire — Breaking the Sound Barrier",
  "url": "./music/track-11.opus"
 },
 {
  "id": "bundled-12",
  "name": "Star Fox — Corneria (Restored)",
  "url": "./music/track-12.opus"
 },
 {
  "id": "bundled-13",
  "name": "Star Fox / Starwing — Corneria (Metal Cover)",
  "url": "./music/track-13.opus"
 },
 {
  "id": "bundled-14",
  "name": "KOF ’96 — Seoul Road (Arrange)",
  "url": "./music/track-14.opus"
 }
];
function openDB(){return new Promise((resolve,reject)=>{if(!global.indexedDB)return reject(Error('IndexedDB indisponível'));const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});req.onerror=()=>reject(req.error);req.onsuccess=()=>resolve(req.result)})}
function transaction(db,mode,action){return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode),request=action(tx.objectStore(STORE));request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error)})}
function shuffle(arr){const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
class RiverPlaylist{
 constructor(opts={}){this.audio=new Audio();this.audio.preload='auto';this.audio.loop=false;this.audio.volume=.38;this.tracks=[];this.order=[];this.current=-1;this.enabled=true;this.loading=false;this.started=false;this.failedTracks=new Set();this.onStatus=opts.onStatus||(()=>{});this.objectURL=null;this.random=true;this.customOrder=[];try{this.random=localStorage.getItem('river_playlist_random')!=='false';this.customOrder=JSON.parse(localStorage.getItem('river_playlist_order')||'[]')}catch(e){}this.audio.addEventListener('ended',()=>this.next());this.audio.addEventListener('error',()=>{if(!this.audio.getAttribute('src'))return;
 const item=this.bossMode?this.tracks.find(t=>t.id==='bundled-14'):this.order[this.current];
 if(item)this.failedTracks.add(item.id);
 if(this.bossMode){this.bossMode=false;this.audio.loop=false;this.onStatus('Faixa de chefe indisponível; retomando playlist');this.next(true);return}
 this.onStatus('Faixa indisponível; procurando outra');this.next(true)});}
 async load(){let rows=[];this.loading=true;try{const db=await openDB();rows=await transaction(db,'readonly',s=>s.getAll())}catch(e){this.onStatus('Biblioteca local indisponível; verificando faixas oficiais')}try{const bundled=await Promise.all(PRESET.map(async item=>{
       try{
         // Vite publica public/ na raiz; GitHub/GitHack serve a pasta literalmente.
         // Detectar ambas as estruturas permite tocar as mesmas 14 faixas nos dois ambientes.
         const candidates=[item.url,item.url.replace(/^\.\/music\//,'./public/music/')];
         for(const candidate of candidates){
           const url=new URL(candidate,document.baseURI).href;
           try{
             let res=await fetch(url,{method:'HEAD',cache:'no-cache'});
             if(!res.ok && [403,405,501].includes(res.status)){
               res=await fetch(url,{method:'GET',cache:'force-cache'});
               if(res.body && res.body.cancel)res.body.cancel().catch(()=>{});
             }
             if(res.ok)return {...item,url,bundled:true};
           }catch(error){/* testar caminho alternativo */}
         }
         return null;
       }catch(e){return null}
     }));
     this.tracks=[...bundled.filter(Boolean),...rows.map(x=>({id:x.id,name:x.name,blob:x.blob}))];
     this.tracks.sort((a,b)=>{const x=this.customOrder.indexOf(a.id),y=this.customOrder.indexOf(b.id);return (x<0?999:x)-(y<0?999:y)});}catch(e){this.onStatus('Armazenamento local indisponível: '+e.message)}this.loading=false;this.onReady?.(this.tracks.length);return this.tracks.length}
 async importFiles(files){const accepted=Array.from(files||[]).filter(f=>/^audio\//.test(f.type)||/\.(mp3|ogg|opus|m4a|wav)$/i.test(f.name));if(!accepted.length)return 0;
 let saved=0;
 for(let i=0;i<accepted.length;i++){const f=accepted[i];if(f.size>45*1024*1024)continue;const id='local-'+f.name+'-'+f.size;await transactionKeepOpenWorkaround(id,f);saved++}
 async function transactionKeepOpenWorkaround(id,f){const d=await openDB();await transaction(d,'readwrite',s=>s.put({id,name:f.name,blob:f}))}
 await this.load();this.onStatus(saved+' faixa(s) importada(s)');return saved}
 setRandom(value){this.random=!!value;try{localStorage.setItem('river_playlist_random',String(this.random))}catch(e){}}
 move(id,delta){const index=this.tracks.findIndex(x=>x.id===id),next=index+delta;if(index<0||next<0||next>=this.tracks.length)return;[this.tracks[index],this.tracks[next]]=[this.tracks[next],this.tracks[index]];this.customOrder=this.tracks.map(t=>t.id);try{localStorage.setItem('river_playlist_order',JSON.stringify(this.customOrder))}catch(e){}}
 preview(id){const item=this.tracks.find(x=>x.id===id);if(item){this.order=[item];this.current=0;this.playItem(item)}}
 startNewGame(){this.started=true;this.failedTracks.clear();this.bossMode=false;this.audio.loop=false;const missionTracks=this.tracks.filter(t=>t.id!=='bundled-14'&&!/Seoul Road/i.test(t.name));this.order=this.random?shuffle(missionTracks):[...missionTracks];this.current=-1;if(this.order.length){this.next();}else{this.onStatus('Músicas do pacote não encontradas; ative trilha sintetizada ou importe arquivos')}}
 next(recover=false){if(!this.enabled||!this.order.length||this.bossMode)return;
 let tries=0;do{this.current=(this.current+1)%this.order.length;tries++}while(tries<=this.order.length&&this.failedTracks.has(this.order[this.current].id));
 if(tries>=this.order.length&&this.failedTracks.has(this.order[this.current].id)){this.onStatus('Nenhuma faixa reproduzível. Ativando trilha sintetizada.');this.stop();this.onUnavailable?.();return}
 const item=this.order[this.current];this.playItem(item)}
 playItem(item){if(!item)return;if(this.objectURL){URL.revokeObjectURL(this.objectURL);this.objectURL=null}this.audio.pause();if(item.url){this.audio.src=item.url}else{this.objectURL=URL.createObjectURL(item.blob);this.audio.src=this.objectURL;}this.onStatus('Carregando: '+item.name);this.audio.play().then(()=>this.onStatus('Tocando: '+item.name)).catch(e=>{if(e.name==='AbortError')return;if(e.name==='NotAllowedError'){this.onStatus('Clique em MÚSICA para liberar a reprodução');this.needsGesture=true;return}this.failedTracks.add(item.id);this.onStatus('Erro na faixa: '+item.name);if(this.bossMode){this.bossMode=false;this.audio.loop=false}this.next(true)})}
 fadeTo(target,duration=850,onDone){
  clearInterval(this.fadeTimer);const steps=20,start=this.audio.volume,delta=(target-start)/steps;let step=0;
  this.fadeTimer=setInterval(()=>{step++;this.audio.volume=Math.max(0,Math.min(1,start+delta*step));if(step>=steps){clearInterval(this.fadeTimer);this.fadeTimer=null;if(onDone)onDone()}},duration/steps);
 }
 beginBossTheme(){
  if(!this.enabled)return;
  const theme=this.tracks.find(t=>t.id==='bundled-14')||this.tracks.find(t=>/Seoul Road/i.test(t.name));
  if(!theme){this.onStatus('Trilha de chefe não disponível; mantendo música atual');return;}
  clearInterval(this.fadeTimer);this.fadeTimer=null;
  this.bossMode=true;this.audio.loop=true;
  this.audio.volume=.38;
  this.playItem(theme);
  this.onStatus('BATALHA: '+theme.name);
 }
 endBossTheme(){
  if(!this.bossMode)return;
  clearInterval(this.fadeTimer);this.fadeTimer=null;
  this.bossMode=false;this.audio.loop=false;this.audio.volume=.38;
  if(this.enabled&&this.order.length)this.next();
  else this.pause();
 }
 pause(){this.audio.pause()}
 resume(){if(!this.enabled)return;this.needsGesture=false;if(this.bossMode){this.audio.play().catch(()=>{});return}if(this.order.length&&!this.audio.src)this.next();else if(this.order.length)this.audio.play().catch(()=>{});else this.onUnavailable?.()}
 stop(){this.audio.pause();this.audio.removeAttribute('src');this.audio.load();if(this.objectURL)URL.revokeObjectURL(this.objectURL);this.objectURL=null}
 toggle(){this.enabled=!this.enabled;if(!this.enabled)this.pause();else this.resume();return this.enabled}
 getName(){return this.order[this.current]?.name||'Nenhuma música'}
}
global.RiverPlaylist=RiverPlaylist;
})(window);
