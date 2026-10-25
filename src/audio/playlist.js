/* Playlist offline: imports persisted in IndexedDB; optional bundled assets. */
(function(global) {
'use strict';
const STORE='songs',DB='river-assault-music-v1';
const PRESET=[
 {id:'01',name:'Airwolf Main Theme 2026',url:'./music/track-01.mp3'},
 {id:'02',name:'Airwolf Theme HQ Audio',url:'./music/track-02.mp3'},
 {id:'03',name:'Below the Radar',url:'./music/track-03.mp3'},
 {id:'04',name:'Ethereal Instrumental Remix',url:'./music/track-04.mp3'}
];
function openDB(){return new Promise((resolve,reject)=>{if(!global.indexedDB)return reject(Error('IndexedDB indisponível'));const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});req.onerror=()=>reject(req.error);req.onsuccess=()=>resolve(req.result)})}
function transaction(db,mode,action){return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode),request=action(tx.objectStore(STORE));request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error)})}
function shuffle(arr){const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
class RiverPlaylist{
 constructor(opts={}){this.audio=new Audio();this.audio.preload='auto';this.audio.loop=false;this.audio.volume=.38;this.tracks=[];this.order=[];this.current=-1;this.enabled=true;this.loading=false;this.onStatus=opts.onStatus||(()=>{});this.objectURL=null;this.audio.addEventListener('ended',()=>this.next());this.audio.addEventListener('error',()=>{this.onStatus('Faixa indisponível; passando para próxima');this.next(true)});}
 async load(){try{const db=await openDB();const rows=await transaction(db,'readonly',s=>s.getAll());this.tracks=rows.map(x=>({id:x.id,name:x.name,blob:x.blob}));}catch(e){this.onStatus('Armazenamento local indisponível: '+e.message)}return this.tracks.length}
 async importFiles(files){const accepted=Array.from(files||[]).filter(f=>/^audio\//.test(f.type)||/\.(mp3|ogg|m4a|wav)$/i.test(f.name));if(!accepted.length)return 0;
 let saved=0;
 for(let i=0;i<accepted.length;i++){const f=accepted[i];if(f.size>45*1024*1024)continue;const id='local-'+f.name+'-'+f.size;await transactionKeepOpenWorkaround(id,f);saved++}
 async function transactionKeepOpenWorkaround(id,f){const d=await openDB();await transaction(d,'readwrite',s=>s.put({id,name:f.name,blob:f}))}
 await this.load();this.onStatus(saved+' faixa(s) importada(s)');return saved}
 startNewGame(){this.order=shuffle(this.tracks);this.current=-1;if(this.order.length){this.next();}else{this.onStatus('Toque em MÚSICAS e selecione seus MP3 para iniciar a trilha')}}
 next(recover=false){if(!this.enabled||!this.order.length)return; if(recover&&this.current>=this.order.length-1){this.stop();return;}this.current=(this.current+1)%this.order.length;const item=this.order[this.current];this.playItem(item)}
 playItem(item){if(this.objectURL){URL.revokeObjectURL(this.objectURL);this.objectURL=null}this.audio.pause();this.objectURL=URL.createObjectURL(item.blob);this.audio.src=this.objectURL;this.onStatus('Tocando: '+item.name);this.audio.play().catch(e=>this.onStatus('Toque em reproduzir para ativar o áudio: '+e.message))}
 pause(){this.audio.pause()}
 resume(){if(this.enabled&&this.order.length)this.audio.play().catch(()=>{})}
 stop(){this.audio.pause();this.audio.removeAttribute('src');this.audio.load();if(this.objectURL)URL.revokeObjectURL(this.objectURL);this.objectURL=null}
 toggle(){this.enabled=!this.enabled;if(!this.enabled)this.pause();else this.resume();return this.enabled}
 getName(){return this.order[this.current]?.name||'Nenhuma música'}
}
global.RiverPlaylist=RiverPlaylist;
})(window);
