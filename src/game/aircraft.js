/* Catálogo compartilhado entre as futuras versões desktop e Android. */
(function(global){
'use strict';
const PLANES={
 falcao:{name:'FALCÃO',pilotName:'T. Snabo',speed:6.5,scroll:3.2,fuel:0.05,color:'#ef4444',wing:'#dc2626',weapons:['SINGLE','DOUBLE','SPREAD','LASER','MISSILE']},
 vespa:{name:'VESPA',pilotName:'Ed Jhow',speed:7.3,scroll:3.9,fuel:0.065,color:'#fbbf24',wing:'#d97706',weapons:['BURST','ALTERNATE','NEEDLE','PULSE','ROCKET']},
 cometa:{name:'COMETA',pilotName:'B. Tata',speed:8.2,scroll:4.6,fuel:0.082,color:'#38bdf8',wing:'#2563eb',weapons:['RAPID','DIAGONAL','TRIDENT','BEAM','PRECISION']},
 fenix:{name:'FÊNIX',pilotName:'S. Napas',speed:7.4,scroll:4.1,fuel:0.065,color:'#f472b6',wing:'#be185d',price:3500,weapons:['HYBRID','CIRCLE','TRACKER','TRIDENT','MISSILE']},
 helicoptero:{name:'ÁGUIA VTOL',pilotName:'G. Casper',speed:6.6,scroll:3.5,fuel:0.052,color:'#60a5fa',wing:'#1e40af',price:8500,weapons:['HYBRID','SPREAD','TRACKER','MULTI','LASER']},
 disco:{name:'DISCO AURORA',pilotName:'R. Roger',speed:7.2,scroll:3.8,fuel:0.048,color:'#c4b5fd',wing:'#7c3aed',price:15000,requiredJourney:6,shieldMultiplier:1.5,weapons:['PULSE','CIRCLE','BEAM','TRACKER','MULTI']},
 titan:{name:'TITÃ',pilotName:'L. Dudu',speed:5.8,scroll:3.1,fuel:0.043,color:'#a3e635',wing:'#4d7c0f',price:6000,weapons:['MULTI','TRACKER','BEAM','CIRCLE','ROCKET']},
 pioneira:{name:'PIONEIRA NX',pilotName:'CAP. JON ARDENT',speed:6.8,scroll:3.6,fuel:.038,color:'#7dd3fc',wing:'#94a3b8',price:10000,premiumExtra:true,shieldMultiplier:1.85,damageMultiplier:1.38,powerMultiplier:1.2,weapons:['NX_PHASE','LASER','TRACKER','BEAM','MULTI']},
 cruzada:{name:'CRUZADA X',pilotName:'LUC SKYWARD',speed:8.5,scroll:4.4,fuel:.041,color:'#f87171',wing:'#e2e8f0',price:10000,premiumExtra:true,shieldMultiplier:1.62,damageMultiplier:1.55,powerMultiplier:1.15,weapons:['X_FALCON','PRECISION','MISSILE','BEAM','ROCKET']},
 valquiria:{name:'VALQUÍRIA VF',pilotName:'Rick Storm',speed:7.9,scroll:4.2,fuel:.04,color:'#fde047',wing:'#f8fafc',price:10000,premiumExtra:true,shieldMultiplier:1.72,damageMultiplier:1.45,powerMultiplier:1.28,weapons:['VF_SENTINEL','TRACKER','PULSE','LASER','CIRCLE']},
 colosso:{name:'COLOSSO GX',pilotName:'JÔN VALE & RINA VALE',speed:6.3,scroll:3.4,fuel:.039,color:'#fb7185',wing:'#60a5fa',price:10000,premiumExtra:true,shieldMultiplier:1.95,damageMultiplier:1.34,powerMultiplier:1.35,weapons:['GX_TITAN','ROCKET','TRACKER','PULSE','BEAM']}
};
const SIGNATURE_SHOTS={
 NX_PHASE:{name:'Pulso de Fase NX',description:'Três pulsos paralelos, com o central mais rápido.',sprite:'BEAM',
  damage:6.1,color:'#67e8f9',range:760,shots:[[-12,0,10],[0,0,13],[12,0,10]]},
 X_FALCON:{name:'Lanças Estelares X',description:'Quatro lanças em leque para cobrir as laterais.',sprite:'NEEDLE',
  damage:4.8,color:'#fca5a5',range:780,shots:[[-16,-2.5,11],[-7,-.9,12],[7,.9,12],[16,2.5,11]]},
 VF_SENTINEL:{name:'Mísseis Sentinela VF',description:'Dois mísseis que rastreiam inimigos a longa distância.',sprite:'TRACKER',
  damage:9,color:'#fbbf24',range:840,tracking:480,shots:[[-12,-.45,9,'MISSILE'],[12,.45,9,'MISSILE']]},
 GX_TITAN:{name:'Onda Titânica GX',description:'Cinco pulsos em arco, com a onda central à frente.',sprite:'PULSE',
  damage:4.3,color:'#c4b5fd',range:720,shots:[[-18,-2.8,8],[-10,-1.2,10],[0,0,12],[10,1.2,10],[18,2.8,8]]}
};
const STANDARD_RANGE=520;
const WEAPONS={
 SINGLE:'TIRO SIMPLES',DOUBLE:'TIRO DUPLO',SPREAD:'LEQUE',LASER:'LASER',MISSILE:'MÍSSEIS GUIADOS',
 BURST:'RAJADA',ALTERNATE:'ALTERNADO',NEEDLE:'AGULHAS',PULSE:'PULSO',ROCKET:'MICROFOGUETES',
 RAPID:'CANHÃO RÁPIDO',DIAGONAL:'DIAGONAIS',TRIDENT:'TRIDENTE',BEAM:'RAIO CONCENTRADO',PRECISION:'PRECISÃO',HYBRID:'RETO + DIAGONAIS',CIRCLE:'360 GRAUS',TRACKER:'MÍSSEIS PERSEGUIDORES',MULTI:'CANHÃO + MÍSSEIS',
 ...Object.fromEntries(Object.entries(SIGNATURE_SHOTS).map(([id,shot])=>[id,shot.name]))
};
function shoot(weapon,player,bullets){
 const tuning={SINGLE:[2.2,'#facc15'],DOUBLE:[2.5,'#fde68a'],SPREAD:[1.8,'#f59e0b'],LASER:[5.5,'#22d3ee'],MISSILE:[9,'#fb923c'],BURST:[2.3,'#fb7185'],ALTERNATE:[3.2,'#e879f9'],NEEDLE:[4.8,'#fef08a'],PULSE:[3.6,'#a78bfa'],ROCKET:[11,'#f97316'],RAPID:[1.8,'#4ade80'],DIAGONAL:[3.1,'#38bdf8'],TRIDENT:[3.3,'#60a5fa'],BEAM:[6.5,'#67e8f9'],PRECISION:[12,'#f8fafc'],HYBRID:[2.8,'#34d399'],CIRCLE:[1.6,'#f0abfc'],TRACKER:[7.5,'#fb7185'],MULTI:[4.1,'#fbbf24']};
 const origin=bullets.length;
 const add=(dx=0,vx=0,speed=7,type='SINGLE',color='#facc15')=>bullets.push({x:player.x+dx,y:player.y-14,vx,speed,type,color});
 const signature=SIGNATURE_SHOTS[weapon];
 if(signature){for(const shot of signature.shots)add(...shot);}
 else switch(weapon){
 case 'HYBRID':add();add(-9,-2.3,8);add(9,2.3,8);break;
 case 'CIRCLE':for(let i=0;i<12;i++){const a=i*Math.PI/6;bullets.push({x:player.x,y:player.y,vx:Math.cos(a)*6,speed:-Math.sin(a)*6,type:'OMNI',color:'#f0abfc'})}break;
 case 'TRACKER':add(-10,0,8,'MISSILE','#fb7185');add(10,0,8,'MISSILE','#fb7185');break;
 case 'MULTI':add(0,0,12);add(-12,0,7,'MISSILE','#ffca72');add(12,0,7,'MISSILE','#ffca72');break;
 case 'DOUBLE':add(-7);add(7);break;
 case 'SPREAD':add();add(-5,-1.8,6.5);add(5,1.8,6.5);break;
 case 'LASER':add(0,0,10,'LASER','#06b6d4');break;
 case 'MISSILE':add(-8,0,6,'MISSILE','#f97316');add(8,0,6,'MISSILE','#f97316');break;
 case 'BURST':add(-5,-0.3,9);add(5,0.3,9);break;
 case 'ALTERNATE':add((Date.now()%300)<150?-10:10,0,8);break;
 case 'NEEDLE':add(-6,0,12,'LASER','#fbbf24');add(6,0,12,'LASER','#fbbf24');break;
 case 'PULSE':add(0,0,7,'LASER','#a78bfa');add(-12,-0.6,7,'LASER','#a78bfa');add(12,0.6,7,'LASER','#a78bfa');break;
 case 'ROCKET':add(-9,0,6.5,'MISSILE','#f97316');add(9,0,6.5,'MISSILE','#f97316');break;
 case 'RAPID':add(0,0,13);break;
 case 'DIAGONAL':add(-5,-2.5,8);add(5,2.5,8);break;
 case 'TRIDENT':add(-9,-0.8,9);add(0,0,9);add(9,0.8,9);break;
 case 'BEAM':add(0,0,14,'LASER','#38bdf8');add(0,0,12,'LASER','#93c5fd');break;
 case 'PRECISION':add(0,0,9,'MISSILE','#fb7185');break;
 default:add();
 }
 const [baseDamage,color]=signature?[signature.damage,signature.color]:(tuning[weapon]||tuning.SINGLE);
 const plane=PLANES[player.aircraftType];
 const standard=weapon===plane?.weapons[0];
 const power=standard?1:(plane?.powerMultiplier||1);
 const damage=baseDamage*(plane?.damageMultiplier||1)*power;
 for(const bullet of bullets.slice(origin)){
   bullet.weaponId=weapon;bullet.damage=damage;bullet.color=color;
   bullet.visualSeed=(bullet.x*17+bullet.vx*23)%100;
   bullet.trailMax=['BEAM','LASER','ROCKET','TRACKER','MISSILE'].includes(weapon)?3:2;
   bullet.trail=[];bullet.sprite=signature?.sprite||weapon;bullet.trailWidth=weapon==='BEAM'?2.5:1.5;
   if(standard||signature)bullet.rangeRemaining=signature?.range??STANDARD_RANGE;
   if(signature?.tracking)bullet.trackingRange=signature.tracking;
 }
}
function flightStats(id,journey=1){
 const plane=PLANES[id];
 const fuelRate=plane.fuel*.8*Math.max(.72,1-(journey-1)*.018);
 const volley=[];
 shoot(plane.weapons[0],{x:0,y:0,aircraftType:id},volley);
 return {
  speed:plane.speed,shield:Math.round(150*(plane.shieldMultiplier||1)*(1+(journey-1)*.035)),
  fuelRate,autonomy:100/(fuelRate*60),damage:volley.reduce((total,bullet)=>total+bullet.damage,0)
 };
}
function shotOutOfRange(bullet,previousX,previousY){
 if(bullet.rangeRemaining===undefined)return false;
 bullet.rangeRemaining-=Math.hypot(bullet.x-previousX,bullet.y-previousY);
 return bullet.rangeRemaining<=0;
}
global.RiverAircraft={PLANES,WEAPONS,SIGNATURE_SHOTS,shoot,flightStats,shotOutOfRange};
})(window);
