/* RiverStorm Premium: camadas raster por bioma, sem tocar na logica de jogo.
 * Arquivos opcionais: na ausencia de PNGs originais usa-se o desenho existente.
 */
(function(root){
'use strict';
const script=Array.from(document.querySelectorAll('script[src]')).find(el=>el.src.includes('premium-environment.js'));
const assetBase=script?new URL('../../assets/sprites/premium/',script.src).href:'./assets/sprites/premium/';
const BIOMES=[
 'jungle','industrial','desert','swamp','islands','arctic','jungle','city','volcanic','alpine',
 'valley','neon','delta','glacial','oasis','bioluminescent','shipyard','arctic','electric','final'
];
const cache=new Map();
function image(path){
 if(cache.has(path))return cache.get(path);
 const img=new Image(),entry={img,loaded:false,failed:false,path};
 img.onload=()=>{entry.loaded=img.naturalWidth>0};
 img.onerror=()=>{entry.failed=true};
 img.src=new URL(path,assetBase).href;
 cache.set(path,entry);return entry;
}
function paths(sector){
 const n=Math.max(1,Math.min(20,Math.floor(Number(sector)||1)));
 const folder='candidates/biomes/mission_'+String(n).padStart(2,'0')+'_'+BIOMES[n-1]+'/';
 return {water:folder+'water.png',left:folder+'bank_left.png',right:folder+'bank_right.png'};
}
function approvedPaths(sector){
 const n=Math.max(1,Math.min(20,Math.floor(Number(sector)||1)));
 const folder='approved/environment/mission_'+String(n).padStart(2,'0')+'_'+BIOMES[n-1]+'/';
 return {water:folder+'water.png',left:folder+'bank_left.png',right:folder+'bank_right.png'};
}
const fallback={water:'runtime/environment/water_calm.png',left:'runtime/environment/riverbank_left.png',right:'runtime/environment/riverbank_right.png'};
function groupReady(paths){return Object.values(paths).every(path=>image(path).loaded);}
function ready(sector){preload(sector);return groupReady(approvedPaths(sector))||groupReady(paths(sector))||groupReady(fallback);}
function active(sector){
 const approved=approvedPaths(sector);
 if(groupReady(approved))return {mode:'approved',textures:approved};
 const mission=paths(sector);
 if(groupReady(mission))return {mode:'biome',textures:mission};
 if(groupReady(fallback))return {mode:'fallback',textures:fallback};
 return null;
}
function status(sector){
 const item=active(sector);
 return {ready:!!item,sector:Math.max(1,Math.min(20,Math.floor(Number(sector)||1))),mode:item?.mode||'original',
  images:Object.entries(item?.textures||paths(sector)).map(([key,path])=>({key,path,loaded:image(path).loaded,failed:image(path).failed}))};
}
function paint(c,d,bankAt,riverPath){
 if(!d?.riverPoints||d.riverPoints.length<2)return false;
 preload(d.sector);
 const item=active(d.sector);if(!item)return false;
 const {w,h,riverPoints}=d;
 const dist=Number(d.distance??d.scroll??d.scrollDistance??0)||0;
 const water=image(item.textures.water).img;
 const left=image(item.textures.left).img,right=image(item.textures.right).img;
 c.save();riverPath(c,riverPoints);c.clip();
 const scale=Math.max(1,w/water.naturalWidth),tileH=water.naturalHeight*scale;
 const offset=((dist*.5)%tileH+tileH)%tileH;
 for(let y=offset-tileH;y<h;y+=tileH)c.drawImage(water,0,y,w,tileH);
 c.restore();
 for(const [side,im] of [['left',left],['right',right]]){
  c.save();c.beginPath();
  if(side==='left'){
   c.moveTo(0,0);c.lineTo(0,h);
   for(let y=h;y>=0;y-=5)c.lineTo(bankAt(riverPoints,y,w)[0],y);
  }else{
   c.moveTo(w,0);c.lineTo(w,h);
   for(let y=h;y>=0;y-=5)c.lineTo(bankAt(riverPoints,y,w)[1],y);
  }
  c.closePath();c.clip();
  const tw=Math.max(140,Math.round(w*.47)),th=tw*im.naturalHeight/im.naturalWidth;
  const start=((dist*.5)%th+th)%th;
  for(let y=start-th;y<h;y+=th)c.drawImage(im,side==='left'?0:w-tw,y,tw,th);
  c.restore();
 }
 return true;
}
function preload(sector){
 const n=Math.max(1,Math.min(20,Math.floor(Number(sector)||1)));
 for(const p of Object.values(approvedPaths(n)))image(p);
 for(const p of Object.values(paths(n)))image(p);
 for(const p of Object.values(fallback))image(p);
}
preload(1);
root.RiverPremiumEnvironment={ready,paint,status,preload,BIOMES};
})(window);
