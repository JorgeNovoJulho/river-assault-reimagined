/* Texturas reais de água e margens do pacote RiverStorm_Cenario_Premium_Instalacao.
 * Nenhum movimento, hitbox ou spawn é modificado.
 */
(function(root){
'use strict';
const folder='./assets/sprites/premium/runtime/environment/';
const base=Array.from(document.querySelectorAll('script[src]')).find(el=>el.src.includes('premium-environment.js'))?.src;
const assetRoot=base?new URL('../../assets/sprites/premium/runtime/environment/',base).href:folder;
const textures={};
let failed=false;
for(const [key,file] of Object.entries({water:'water_calm.png',left:'riverbank_left.png',right:'riverbank_right.png'})){
 const img=new Image();img.onerror=()=>{failed=true;console.warn('[RiverStorm Premium] Textura ausente:',file)};img.src=assetRoot+file;textures[key]=img;
}
function ready(){return !failed&&Object.values(textures).every(im=>im.complete&&im.naturalWidth>0);}
function status(){return {ready:ready(),failed,images:Object.entries(textures).map(([key,im])=>({key,loaded:im.complete&&im.naturalWidth>0,width:im.naturalWidth,height:im.naturalHeight}))};}
function paint(c,d,bankAt,riverPath){
 if(!ready()||!d.riverPoints||d.riverPoints.length<2)return false;
 const {w,h,riverPoints}=d;
 const dist=Number(d.distance??d.scroll??d.scrollDistance??0)||0;
 // Agua: textura raster recortada pela mesma máscara sinuosa do rio original.
 c.save();riverPath(c,riverPoints);c.clip();
 const water=textures.water,scale=Math.max(1,w/water.naturalWidth);
 const tileH=water.naturalHeight*scale,offset=((dist*.5)%tileH+tileH)%tileH;
 for(let y=offset-tileH;y<h;y+=tileH)c.drawImage(water,0,y,w,tileH);
 c.restore();
 // Margens: mosaico com recorte orgânico em cada lado, sem invadir a água.
 for(const side of ['left','right']){
  c.save();c.beginPath();
  if(side==='left'){
   c.moveTo(0,0);c.lineTo(0,h);
   for(let y=h;y>=0;y-=5)c.lineTo(bankAt(riverPoints,y,w)[0],y);
  }else{
   c.moveTo(w,0);c.lineTo(w,h);
   for(let y=h;y>=0;y-=5)c.lineTo(bankAt(riverPoints,y,w)[1],y);
  }
  c.closePath();c.clip();
  const im=textures[side],tw=Math.max(140,Math.round(w*.47)),th=tw*im.naturalHeight/im.naturalWidth;
  const start=((dist*.5)%th+th)%th;
  for(let y=start-th;y<h;y+=th)c.drawImage(im,side==='left'?0:w-tw,y,tw,th);
  c.restore();
 }
 return true;
}
root.RiverPremiumEnvironment={ready,paint,status};
})(window);
