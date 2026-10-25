/* Catálogo compartilhado entre as futuras versões desktop e Android. */
(function(global){
'use strict';
const PLANES={
 falcao:{name:'FALCÃO',speed:6.5,scroll:3.2,fuel:0.05,color:'#ef4444',wing:'#dc2626',weapons:['SINGLE','DOUBLE','SPREAD','LASER','MISSILE']},
 vespa:{name:'VESPA',speed:7.3,scroll:3.9,fuel:0.065,color:'#fbbf24',wing:'#d97706',weapons:['BURST','ALTERNATE','NEEDLE','PULSE','ROCKET']},
 cometa:{name:'COMETA',speed:8.2,scroll:4.6,fuel:0.082,color:'#38bdf8',wing:'#2563eb',weapons:['RAPID','DIAGONAL','TRIDENT','BEAM','PRECISION']}
};
const WEAPONS={
 SINGLE:'TIRO SIMPLES',DOUBLE:'TIRO DUPLO',SPREAD:'LEQUE',LASER:'LASER',MISSILE:'MÍSSEIS GUIADOS',
 BURST:'RAJADA',ALTERNATE:'ALTERNADO',NEEDLE:'AGULHAS',PULSE:'PULSO',ROCKET:'MICROFOGUETES',
 RAPID:'CANHÃO RÁPIDO',DIAGONAL:'DIAGONAIS',TRIDENT:'TRIDENTE',BEAM:'RAIO CONCENTRADO',PRECISION:'PRECISÃO'
};
function shoot(weapon,player,bullets){
 const add=(dx=0,vx=0,speed=7,type='SINGLE',color='#facc15')=>bullets.push({x:player.x+dx,y:player.y-14,vx,speed,type,color});
 switch(weapon){
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
}
global.RiverAircraft={PLANES,WEAPONS,shoot};
})(window);
