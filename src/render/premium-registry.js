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
  HELI:'approved/enemies/recurring/attack_helicopter/idle_000.png',
  RECON_PLANE:'approved/enemies/recurring/recon_plane/idle_000.png',
  ZIGZAG:'approved/enemies/recurring/recon_plane/idle_000.png',
  TURRET:'approved/enemies/recurring/floating_turret/idle_000.png',
  TANK:'approved/enemies/recurring/tank/idle_000.png',SUB:'approved/enemies/recurring/submarine/idle_000.png',
  SHIP:'approved/enemies/recurring/armed_boat/idle_000.png',MECHA_GUN:'approved/enemies/recurring/mecha_gun/idle_000.png',
  MECHA_SWORD:'approved/enemies/recurring/mecha_sword/idle_000.png',
  // Recorrentes V3: somente IDs já usados pela simulação. A camada é visual.
  DRONE:'approved/enemies/recurring/drone/idle_000.png',
  HELI:'approved/enemies/recurring/attack_helicopter/idle_000.png',
  JET:'approved/enemies/recurring/elite_fighter/idle_000.png',
  TANK:'approved/enemies/recurring/tank/idle_000.png',
  TURRET:'approved/enemies/recurring/floating_turret/idle_000.png',
  SHIP:'approved/enemies/recurring/armed_boat/idle_000.png',
  WARSHIP:'approved/enemies/recurring/warship/idle_000.png',BOMBER:'approved/enemies/recurring/bomber/idle_000.png',
  FLOATING_MINE:'approved/enemies/recurring/floating_mine/idle_000.png',
  ITEM_CAPSULE:'approved/enemies/recurring/item_capsule/idle_000.png',
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
  ISLAND:'approved/environment/mission_01_rio_verde/structures/armed_island_small.png',
  ARMED_ISLAND:'approved/environment/mission_01_rio_verde/structures/armed_island_small.png',
  BRIDGE:'approved/environment/mission_01_rio_verde/structures/bridge_section.png',
  DAM:'approved/environment/mission_01_rio_verde/structures/river_structure_destructible.png',
  BRIDGE_DAMAGED:'approved/environment/mission_01_rio_verde/structures/bridge_damaged.png',
  DAM_DAMAGED:'terrain/dam-damaged.png'
 },
 pickup:{
  BOMB:'approved/items/bomb.png',SHIELD:'approved/items/shield.png',FUEL:'approved/items/gas.png',
  GAS:'approved/items/gas.png',SOS:'approved/items/sos.png',RESCUE:'approved/items/sos.png',
  SPECIAL:'approved/items/special_weapon.png',WEAPON_ITEM:'approved/items/special_weapon.png',
  DRONES:'approved/items/wingman_drone.png',WINGMAN:'approved/items/wingman_drone.png',
  LIFE:'approved/items/life.png',HP:'approved/items/life.png',XP:'approved/items/xp.png',
  COIN:'approved/items/coin.png',MX:'approved/items/multiplier_mx.png',MUL:'approved/items/multiplier_mx.png',MULTIPLIER:'approved/items/multiplier_mx.png',
  REPAIR:'approved/items/life.png'
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
 RECON_PLANE:'RECON_PLANE',RECON:'RECON_PLANE',HELICOPTER:'HELI',ATTACK_HELICOPTER:'HELI',
 DRONE:'DRONE',MECHA_SWORD:'MECHA_SWORD',MECHA_GUN:'MECHA_GUN',TANK:'TANK',
 ARMED_BOAT:'SHIP',SUBMARINE:'SUB',FLOATING_TURRET:'TURRET',WARSHIP:'WARSHIP',BOMBER:'BOMBER',
 FLOATING_MINE:'FLOATING_MINE',MINE:'FLOATING_MINE',ITEM_CAPSULE:'ITEM_CAPSULE',
 HELI:'HELI',JET:'JET',ZIGZAG:'ZIGZAG',SHIP:'SHIP',SUB:'SUB',TURRET:'TURRET'
};
// Tamanho visual independente da hitbox para não reduzir os masters Premium
// ao tamanho das caixas lógicas originalmente usadas pelo canvas legado.
const ENEMY_DISPLAY={
 HELI:[68,56],JET:[62,64],RECON_PLANE:[62,64],ZIGZAG:[62,64],DRONE:[52,52],
 MECHA_SWORD:[70,72],MECHA_GUN:[70,70],TANK:[70,60],SHIP:[78,64],
 SUB:[78,70],TURRET:[55,55],WARSHIP:[110,78],BOMBER:[78,73],FLOATING_MINE:[45,45],ITEM_CAPSULE:[46,46],TUCANO:[54,44],CRANE:[70,64]
};
const EARLY_MISSION_ENEMY_BOX={
 DRONE:[30,32],TUCANO:[46,44],HELI:[47,42],JET:[48,43],RECON_PLANE:[44,42],ZIGZAG:[44,42],
 TANK:[36,34],TURRET:[33,34],SHIP:[54,46],SUB:[64,50],WARSHIP:[88,62],BOMBER:[65,48],
 MECHA_GUN:[46,50],MECHA_SWORD:[46,50],FLOATING_MINE:[27,27],ITEM_CAPSULE:[26,32],CRANE:[55,48],MEGAZORD:[82,95]
};
const RIO_VERDE_ASSETS={
 enemy:{HELI:'heli',SHIP:'ship',DRONE:'drone',BOMBER:'bomber',FLOATING_MINE:'mine',MEGAZORD:'megazord'},
 terrain:{ARMED_ISLAND:'island',BRIDGE:'bridge',BRIDGE_DAMAGED:'bridge',DAM:'dam',TARGET:'roots'},
 pickup:{BOMB:'bomb',SHIELD:'shield',FUEL:'gas',GAS:'gas',SOS:'sos',RESCUE:'sos',
  SPECIAL:'special_weapon',WEAPON_ITEM:'special_weapon',DRONES:'wingman_drone',WINGMAN:'wingman_drone',
  LIFE:'life',HP:'life',XP:'xp',COIN:'coin',MX:'multiplier_mx',MUL:'multiplier_mx',MULTIPLIER:'multiplier_mx',MULTI:'multiplier_mx',REPAIR:'life',CAPSULE:'special_weapon'}
};
const INDUSTRIAL_TERRAIN={ARMED_ISLAND:'dock',BRIDGE:'bridge',BRIDGE_DAMAGED:'bridge',DAM:'floodgate',TARGET:'container'};
const files=new Map();
for(const [group,items] of Object.entries(CATALOG))for(const [id,path] of Object.entries(items)){
 // Só arquivos existentes são habilitados por padrão. Nada de usar imagens erradas.
 const supported=(group==='player'&&id==='falcao')||(group==='fx'&&id==='explosion')||path.startsWith('approved/');
 files.set(group+':'+id,{path,loaded:false,supported,img:null,base:path.startsWith('approved/')?'./assets/sprites/premium/':BASE});
}
function registerMissionSprites(sector,folder,group,items){
 for(const [id,name] of Object.entries(items)){
  files.set(sector+':'+group+':'+id,{path:'approved/environment/'+folder+'/runtime/'+name+'.png',
   loaded:false,supported:true,img:null,base:'./assets/sprites/premium/'});
 }
}
for(const [group,items] of Object.entries(RIO_VERDE_ASSETS)){
 registerMissionSprites(1,'mission_01_rio_verde',group,items);
}
registerMissionSprites(2,'mission_02_industrial','terrain',INDUSTRIAL_TERRAIN);
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
function get(group,id,sector){
 if(group==='enemy')id=ENEMY_ALIASES[String(id||'').toUpperCase()]||String(id||'').toUpperCase();
 const key=group+':'+id;
 const level=Number(sector);
 const shared=level===2&&group!=='terrain'?1:level;
 const mission=files.get(shared+':'+key);
 const entry=mission?.supported?mission:files.get(key);
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
function drawFitted(ctx,image,x,y,w,h){
 const scale=Math.min(w/image.naturalWidth,h/image.naturalHeight);
 const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
 ctx.drawImage(image,x-width/2,y-height/2,width,height);
}
function drawEarlyMissionEnemy(ctx,image,id,x,y){
 const [w,h]=EARLY_MISSION_ENEMY_BOX[ENEMY_ALIASES[id]||id]||[42,42];
 drawFitted(ctx,image,x,y,w,h);
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
 for(const [key,entry] of files){
  if(!entry.supported||key.startsWith('aircraft:'))continue;
  const parts=key.split(':');
  if(parts.length===3)get(parts[1],parts[2],Number(parts[0]));
  else get(...parts);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',preload,{once:true});else preload();
global.RiverPremium={register,get,declared,displaySize,drawFitted,drawEarlyMissionEnemy,aircraft,paint,status,catalog:CATALOG};
})(window);
