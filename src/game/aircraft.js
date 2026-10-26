/* Catálogo compartilhado entre as futuras versões desktop e Android. */
(function(global){
'use strict';
const PLANES={
 falcao:{name:'FALCÃO',speed:6.5,scroll:3.2,fuel:0.05,color:'#ef4444',wing:'#dc2626',weapons:['SINGLE','DOUBLE','SPREAD','LASER','MISSILE']},
 vespa:{name:'VESPA',speed:7.3,scroll:3.9,fuel:0.065,color:'#fbbf24',wing:'#d97706',weapons:['BURST','ALTERNATE','NEEDLE','PULSE','ROCKET']},
 cometa:{name:'COMETA',speed:8.2,scroll:4.6,fuel:0.082,color:'#38bdf8',wing:'#2563eb',weapons:['RAPID','DIAGONAL','TRIDENT','BEAM','PRECISION']},
 fenix:{name:'FÊNIX',speed:7.4,scroll:4.1,fuel:0.065,color:'#f472b6',wing:'#be185d',price:3500,weapons:['HYBRID','CIRCLE','TRACKER','TRIDENT','MISSILE']},
 helicoptero:{name:'ÁGUIA VTOL',speed:6.6,scroll:3.5,fuel:0.052,color:'#60a5fa',wing:'#1e40af',price:8500,weapons:['HYBRID','SPREAD','TRACKER','MULTI','LASER']},
 disco:{name:'DISCO AURORA',speed:7.2,scroll:3.8,fuel:0.048,color:'#c4b5fd',wing:'#7c3aed',price:15000,requiredJourney:6,shieldMultiplier:1.5,weapons:['PULSE','CIRCLE','BEAM','TRACKER','MULTI']},
 titan:{name:'TITÃ',speed:5.8,scroll:3.1,fuel:0.043,color:'#a3e635',wing:'#4d7c0f',price:6000,weapons:['MULTI','TRACKER','BEAM','CIRCLE','ROCKET']}
};
const WEAPONS={
 SINGLE:'TIRO SIMPLES',DOUBLE:'TIRO DUPLO',SPREAD:'LEQUE',LASER:'LASER',MISSILE:'MÍSSEIS GUIADOS',
 BURST:'RAJADA',ALTERNATE:'ALTERNADO',NEEDLE:'AGULHAS',PULSE:'PULSO',ROCKET:'MICROFOGUETES',
 RAPID:'CANHÃO RÁPIDO',DIAGONAL:'DIAGONAIS',TRIDENT:'TRIDENTE',BEAM:'RAIO CONCENTRADO',PRECISION:'PRECISÃO',HYBRID:'RETO + DIAGONAIS',CIRCLE:'360 GRAUS',TRACKER:'MÍSSEIS PERSEGUIDORES',MULTI:'CANHÃO + MÍSSEIS'
};
function shoot(weapon,player,bullets){
 const tuning={SINGLE:[2.2,'#facc15'],DOUBLE:[2.5,'#fde68a'],SPREAD:[1.8,'#f59e0b'],LASER:[5.5,'#22d3ee'],MISSILE:[9,'#fb923c'],BURST:[2.3,'#fb7185'],ALTERNATE:[3.2,'#e879f9'],NEEDLE:[4.8,'#fef08a'],PULSE:[3.6,'#a78bfa'],ROCKET:[11,'#f97316'],RAPID:[1.8,'#4ade80'],DIAGONAL:[3.1,'#38bdf8'],TRIDENT:[3.3,'#60a5fa'],BEAM:[6.5,'#67e8f9'],PRECISION:[12,'#f8fafc'],HYBRID:[2.8,'#34d399'],CIRCLE:[1.6,'#f0abfc'],TRACKER:[7.5,'#fb7185'],MULTI:[4.1,'#fbbf24']};
 const origin=bullets.length;
 const add=(dx=0,vx=0,speed=7,type='SINGLE',color='#facc15')=>bullets.push({x:player.x+dx,y:player.y-14,vx,speed,type,color});
 switch(weapon){
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
 const [damage,color]=tuning[weapon]||tuning.SINGLE;
 for(const bullet of bullets.slice(origin)){bullet.weaponId=weapon;bullet.damage=damage;bullet.color=color;bullet.visualSeed=(bullet.x*17+bullet.vx*23)%100;}
}
global.RiverAircraft={PLANES,WEAPONS,shoot};
})(window);
