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
  ZIGZAG:'approved/enemies/recurring/recon_plane/idle_000.png',TURRET:'enemies/turret.png',
  TANK:'enemies/tank.png',SUB:'enemies/submarine.png',
  SHIP:'enemies/ship.png',MECHA_GUN:'enemies/mecha-gun.png',
  MECHA_SWORD:'enemies/mecha-sword.png',
  // Recorrentes V3: somente IDs já usados pela simulação. A camada é visual.
  DRONE:'approved/enemies/recurring/drone/idle_000.png',
  HELI:'approved/enemies/recurring/attack_helicopter/idle_000.png',
  JET:'approved/enemies/recurring/elite_fighter/idle_000.png',
  TANK:'approved/enemies/recurring/tank/idle_000.png',
  TURRET:'approved/enemies/recurring/floating_turret/idle_000.png',
  SHIP:'approved/enemies/recurring/armed_boat/idle_000.png',
  WARSHIP:'approved/enemies/recurring/warship/idle_000.png',
  SUB:'approved/enemies/recurring/submarine/idle_000.png',
  MECHA_GUN:'approved/enemies/recurring/mecha_gun/idle_000.png',
  MECHA_SWORD:'approved/enemies/recurring/mecha_sword/idle_000.png',
  TUCANO:'approved/enemies/exclusive/01_tucano/idle_000.png',
  CRANE:'approved/enemies/exclusive/02_crane/idle_000.png',
  SCORPION:'approved/enemies/exclusive/03_scorpion/idle_000.png',
  ALLIGATOR:'approved/enemies/exclusive/04_alligator/idle_000.png',
  CORSAIR:'approved/enemies/exclusive/05_corsair/idle_000.png',
  WALRUS:'approved/enemies/exclusive/06_walrus/idle_000.png',
  MANTIS:'approved/enemies/exclusive/07_mantis/idle_000.png',
  MOTOJET:'approved/enemies/exclusive/08_motojet/idle_000.png',
  SALAMANDER:'approved/enemies/exclusive/09_salamander/idle_000.png',
  EAGLE:'approved/enemies/exclusive/10_eagle/idle_000.png',
  DREDGER:'approved/enemies/exclusive/11_dredger/idle_000.png',
  HOVERCAR:'approved/enemies/exclusive/12_hovercar/idle_000.png',
  PIRANHA:'approved/enemies/exclusive/13_piranha/idle_000.png',
  ICE_RAY:'approved/enemies/exclusive/14_ice_ray/idle_000.png',
  BEETLE:'approved/enemies/exclusive/15_beetle/idle_000.png',
  PRISM_WASP:'approved/enemies/exclusive/16_prism_wasp/idle_000.png',
  WELDER:'approved/enemies/exclusive/17_welder/idle_000.png',
  NARWHAL:'approved/enemies/exclusive/18_narwhal/idle_000.png',
  EEL:'approved/enemies/exclusive/19_eel/idle_000.png',
  HYBRID_HUNTER:'approved/enemies/exclusive/20_hybrid_hunter/idle_000.png'
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
// IDs da simulação legada e os nomes descritivos da biblioteca V3.
// Esta resolução é só visual: IA, dano, colisão e cadência permanecem intocados.
const ENEMY_ALIASES={
 RECON_PLANE:'ZIGZAG',RECON:'ZIGZAG',HELICOPTER:'HELI',ATTACK_HELICOPTER:'HELI',
 DRONE:'DRONE',MECHA_SWORD:'MECHA_SWORD',MECHA_GUN:'MECHA_GUN',TANK:'TANK',
 ARMED_BOAT:'SHIP',SUBMARINE:'SUB',FLOATING_TURRET:'TURRET',WARSHIP:'WARSHIP',
 HELI:'HELI',JET:'JET',ZIGZAG:'ZIGZAG',SHIP:'SHIP',SUB:'SUB',TURRET:'TURRET'
};
// Tamanho visual independente da hitbox para não reduzir os masters Premium
// ao tamanho das caixas lógicas originalmente usadas pelo canvas legado.
const ENEMY_DISPLAY={
 HELI:[48,38],JET:[42,48],ZIGZAG:[42,40],DRONE:[38,38],
 MECHA_SWORD:[50,52],MECHA_GUN:[50,50],TANK:[52,43],SHIP:[54,46],
 SUB:[52,52],TURRET:[42,42],WARSHIP:[64,50],TUCANO:[54,44]
};
const files=new Map();
for(const [group,items] of Object.entries(CATALOG))for(const [id,path] of Object.entries(items)){
 // Só arquivos existentes são habilitados por padrão. Nada de usar imagens erradas.
 const supported=(group==='player'&&id==='falcao')||(group==='fx'&&id==='explosion')||(group==='enemy'&&path.startsWith('approved/'))||(group==='enemy'&&(id==='TURRET'||id==='SHIP'));
 files.set(group+':'+id,{path,loaded:false,supported,img:null,base:path.startsWith('approved/')?'./assets/sprites/premium/':BASE});
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
  im.onload=()=>{entry.loaded=true;window.dispatchEvent(new CustomEvent('riverstorm-aircraft-ready',{detail:{id,state}}))};
  im.onerror=()=>{entry.loaded=false;console.warn('Sprite Arcade Premium indisponível:',id,state)};
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
 if(group==='enemy')id=ENEMY_ALIASES[String(id||'').toUpperCase()]||String(id||'').toUpperCase();
 const entry=files.get(group+':'+id);
 if(!entry||!entry.supported)return null;
 if(!entry.img){
   const im=new Image();entry.img=im;
   im.onload=()=>{entry.loaded=true};
   im.onerror=()=>{entry.loaded=false;entry.supported=false};
   im.src=(entry.base||BASE)+entry.path;
 }
 return entry.loaded&&entry.img.naturalWidth>0?entry.img:null;
}
function declared(group,id){
 if(group==='enemy')id=ENEMY_ALIASES[String(id||'').toUpperCase()]||String(id||'').toUpperCase();
 const entry=files.get(group+':'+id);return Boolean(entry&&entry.supported);
}
function displaySize(id,fallbackWidth=36,fallbackHeight=36){
 const canonical=ENEMY_ALIASES[String(id||'').toUpperCase()]||String(id||'').toUpperCase();
 return ENEMY_DISPLAY[canonical]||[Math.max(36,fallbackWidth),Math.max(36,fallbackHeight)];
}
function paint(ctx,group,id,x,y,w,h,rotation=0){
 const im=get(group,id);if(!im)return false;
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
 ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();return true;
}
function status(){
 return Array.from(files,([key,value])=>({key,available:value.supported,loaded:value.loaded,path:value.path}));
}
function preload(){
 for(const [key,entry] of files){if(entry.supported&&!key.startsWith('aircraft:'))get(...key.split(':'));}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',preload,{once:true});else preload();
global.RiverPremium={register,get,declared,displaySize,aircraft,paint,status,catalog:CATALOG};
})(window);
