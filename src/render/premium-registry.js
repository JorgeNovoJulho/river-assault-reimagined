/* RiverStorm Premium — imagem separada da lógica de jogo.
 * Não modifica física, IA, colisões, inventário ou áudio.
 * Ausência de sprite não causa erro: permanece o renderizador original.
 */
(function(global){
'use strict';
const BASE='./assets/sprites/premium/runtime/';
const AIRCRAFT_BASE='./assets/sprites/premium/aircraft/';
const AIRCRAFT_IDS=['falcao','vespa','cometa','fenix','helicoptero','disco','titan'];
const AIRCRAFT_STATES=['normal','disparo','boost','especial'];
const CATALOG={
 player:{falcao:'player/fighter_candidate.png'},
 fx:{explosion:'fx/explosion_atlas_4x3.png'},
 enemy:{
  HELI:'enemies/helicopter.png',JET:'enemies/jet.png',
  ZIGZAG:'enemies/zigzag.png',TURRET:'enemies/turret.png',
  TANK:'enemies/tank.png',SUB:'enemies/submarine.png',
  SHIP:'enemies/ship.png',MECHA_GUN:'enemies/mecha-gun.png',
  MECHA_SWORD:'enemies/mecha-sword.png'
 },
 terrain:{
  ISLAND:'terrain/island.png',BRIDGE:'terrain/bridge.png',
  DAM:'terrain/dam.png',BRIDGE_DAMAGED:'terrain/bridge-damaged.png',
  DAM_DAMAGED:'terrain/dam-damaged.png'
 },
 pickup:{
  BOMB:'items/bomb.png',SHIELD:'items/shield.png',FUEL:'items/fuel.png',
  DRONES:'items/drones.png',REPAIR:'items/repair.png'
 },
 projectile:{
  SINGLE:'projectiles/single.png',DOUBLE:'projectiles/double.png',
  SPREAD:'projectiles/spread.png',LASER:'projectiles/laser.png',
  MISSILE:'projectiles/missile.png',BURST:'projectiles/burst.png',
  ALTERNATE:'projectiles/alternate.png',NEEDLE:'projectiles/needle.png',
  PULSE:'projectiles/pulse.png',ROCKET:'projectiles/rocket.png',
  RAPID:'projectiles/rapid.png',DIAGONAL:'projectiles/diagonal.png',
  TRIDENT:'projectiles/trident.png',BEAM:'projectiles/beam.png',
  PRECISION:'projectiles/precision.png',HYBRID:'projectiles/hybrid.png',
  CIRCLE:'projectiles/circle.png',TRACKER:'projectiles/tracker.png',
  MULTI:'projectiles/multi.png'
 }
};
const files=new Map();
for(const [group,items] of Object.entries(CATALOG))for(const [id,path] of Object.entries(items)){
 // Só arquivos existentes são habilitados por padrão. Nada de usar imagens erradas.
 const supported=(group==='player'&&id==='falcao')||(group==='fx'&&id==='explosion')||(group==='enemy'&&(id==='TURRET'||id==='SHIP'));
 files.set(group+':'+id,{path,loaded:false,supported,img:null});
}
for(const id of AIRCRAFT_IDS)for(const state of AIRCRAFT_STATES){
 files.set('aircraft:'+id+':'+state,{path:id+'_'+state+'.png',loaded:false,supported:true,img:null,base:AIRCRAFT_BASE});
}
function aircraft(id,state='normal'){
 if(!AIRCRAFT_IDS.includes(id))return null;
 const entry=files.get('aircraft:'+id+':'+(AIRCRAFT_STATES.includes(state)?state:'normal'));
 if(!entry)return null;
 if(!entry.img){
  const im=new Image();entry.img=im;
  im.onload=()=>{entry.loaded=true};
  im.onerror=()=>{entry.loaded=false};
  im.src=entry.base+entry.path;
 }
 return entry.loaded&&entry.img.naturalWidth>0?entry.img:null;
}
function register(group,id,path){
 if(!CATALOG[group])throw Error('Grupo desconhecido: '+group);
 if(typeof path!=='string'||!/^[-\w/]+\.png$/i.test(path))throw Error('Caminho PNG inválido');
 files.set(group+':'+id,{path,loaded:false,supported:true,img:null});
}
function get(group,id){
 const entry=files.get(group+':'+id);
 if(!entry||!entry.supported)return null;
 if(!entry.img){
   const im=new Image();entry.img=im;
   im.onload=()=>{entry.loaded=true};
   im.onerror=()=>{entry.loaded=false;entry.supported=false};
   im.src=BASE+entry.path;
 }
 return entry.loaded&&entry.img.naturalWidth>0?entry.img:null;
}
function paint(ctx,group,id,x,y,w,h,rotation=0){
 const im=get(group,id);if(!im)return false;
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
 ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();return true;
}
function status(){
 return Array.from(files,([key,value])=>({key,available:value.supported,loaded:value.loaded,path:value.path}));
}
global.RiverPremium={register,get,aircraft,paint,status,catalog:CATALOG};
})(window);
