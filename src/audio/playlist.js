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
 constructor(opts={}){this.audio=new Audio();this.audio.preload='auto';this.audio.loop=false;this.audio.volume=.38;this.tracks=[];this.order=[];this.current=-1;this.enabled=true;this.loading=false;this.onStatus=opts.onStatus||(()=>{});this.objectURL=null;this.random=true;this.customOrder=[];try{this.random=localStorage.getItem('river_playlist_random')!=='false';this.customOrder=JSON.parse(localStorage.getItem('river_playlist_order')||'[]')}catch(e){}this.audio.addEventListener('ended',()=>this.next());this.audio.addEventListener('error',()=>{this.onStatus('Faixa indisponível; passando para próxima');this.next(true)});}
 async load(){let rows=[];try{const db=await openDB();rows=await transaction(db,'readonly',s=>s.getAll())}catch(e){this.onStatus('Biblioteca local indisponível; verificando faixas oficiais')}try{const bundled=await Promise.all(PRESET.map(async item=>{
       try{
         const url=new URL(item.url,document.baseURI).href;
         let res=await fetch(url,{method:'HEAD',cache:'no-cache'});
         if(!res.ok && [403,405,501].includes(res.status)){
           res=await fetch(url,{method:'GET',cache:'force-cache'});
           if(res.body && res.body.cancel)res.body.cancel().catch(()=>{});
         }
         return res.ok?{...item,url,bundled:true}:null;
       }catch(e){return null}
     }));
     this.tracks=[...bundled.filter(Boolean),...rows.map(x=>({id:x.id,name:x.name,blob:x.blob}))];
     this.tracks.sort((a,b)=>{const x=this.customOrder.indexOf(a.id),y=this.customOrder.indexOf(b.id);return (x<0?999:x)-(y<0?999:y)});}catch(e){this.onStatus('Armazenamento local indisponível: '+e.message)}return this.tracks.length}
 async importFiles(files){const accepted=Array.from(files||[]).filter(f=>/^audio\//.test(f.type)||/\.(mp3|ogg|opus|m4a|wav)$/i.test(f.name));if(!accepted.length)return 0;
 let saved=0;
 for(let i=0;i<accepted.length;i++){const f=accepted[i];if(f.size>45*1024*1024)continue;const id='local-'+f.name+'-'+f.size;await transactionKeepOpenWorkaround(id,f);saved++}
 async function transactionKeepOpenWorkaround(id,f){const d=await openDB();await transaction(d,'readwrite',s=>s.put({id,name:f.name,blob:f}))}
 await this.load();this.onStatus(saved+' faixa(s) importada(s)');return saved}
 setRandom(value){this.random=!!value;try{localStorage.setItem('river_playlist_random',String(this.random))}catch(e){}}
 move(id,delta){const index=this.tracks.findIndex(x=>x.id===id),next=index+delta;if(index<0||next<0||next>=this.tracks.length)return;[this.tracks[index],this.tracks[next]]=[this.tracks[next],this.tracks[index]];this.customOrder=this.tracks.map(t=>t.id);try{localStorage.setItem('river_playlist_order',JSON.stringify(this.customOrder))}catch(e){}}
 preview(id){const item=this.tracks.find(x=>x.id===id);if(item){this.order=[item];this.current=0;this.playItem(item)}}
 startNewGame(){this.order=this.random?shuffle(this.tracks):[...this.tracks];this.current=-1;if(this.order.length){this.next();}else{this.onStatus('Toque em MÚSICAS e selecione seus MP3 para iniciar a trilha')}}
 next(recover=false){if(!this.enabled||!this.order.length)return; if(recover&&this.current>=this.order.length-1){this.stop();return;}this.current=(this.current+1)%this.order.length;const item=this.order[this.current];this.playItem(item)}
 playItem(item){if(this.objectURL){URL.revokeObjectURL(this.objectURL);this.objectURL=null}this.audio.pause();if(item.url){this.audio.src=item.url}else{this.objectURL=URL.createObjectURL(item.blob);this.audio.src=this.objectURL;}this.onStatus('Tocando: '+item.name);this.audio.play().catch(e=>this.onStatus('Toque em reproduzir para ativar o áudio: '+e.message))}
 pause(){this.audio.pause()}
 resume(){if(this.enabled&&this.order.length)this.audio.play().catch(()=>{})}
 stop(){this.audio.pause();this.audio.removeAttribute('src');this.audio.load();if(this.objectURL)URL.revokeObjectURL(this.objectURL);this.objectURL=null}
 toggle(){this.enabled=!this.enabled;if(!this.enabled)this.pause();else this.resume();return this.enabled}
 getName(){return this.order[this.current]?.name||'Nenhuma música'}
}
global.RiverPlaylist=RiverPlaylist;
})(window);
