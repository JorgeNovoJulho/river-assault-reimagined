/* River Assault - renderer 2.5D leve: sombras, relevo, rios e sprites vetoriais. */
(function(root){
'use strict';
const THEMES=[
 {name:"FLORESTA TROPICAL",ground:['#122d28','#285344'],water:['#0a3650','#0d7890'],accent:'#6dd4a0',foliage:'#2d795b',time:'day'},
 {name:"COSTA INDUSTRIAL",ground:['#182838','#46576b'],water:['#092b47','#21658b'],accent:'#ffc46c',foliage:'#446a72',time:'night'},
 {name:"DESERTO QUENTE",ground:['#745037','#c79a55'],water:['#06415d','#158aaa'],accent:'#eac57c',foliage:'#6f8554',time:'sunset'},
 {name:"PÂNTANO",ground:['#19342b','#456e4e'],water:['#1b4b45','#448577'],accent:'#b7e884',foliage:'#4b875f',time:'day'},
 {name:"ARQUIPÉLAGO",ground:['#245054','#5b937e'],water:['#0b4d70','#2ea0bd'],accent:'#f5b76e',foliage:'#388874',time:'sunset'},
 {name:"FIORDE ÁRTICO",ground:['#728e9f','#dfebef'],water:['#103c56','#4d9ab9'],accent:'#d3f3ff',foliage:'#9cbbc7',time:'night'},
 {name:"SELVA DENSA",ground:['#102e28','#366b45'],water:['#0a434c','#167d88'],accent:'#95f4a5',foliage:'#24764e',time:'day'},
 {name:"MEGACIDADE",ground:['#202c45','#485c6f'],water:['#142c4b','#376a8a'],accent:'#e4b96e',foliage:'#416d78',time:'night'},
 {name:"CÂNION VULCÂNICO",ground:['#221e30','#584653'],water:['#3e1628','#a23832'],accent:'#ff8e5b',foliage:'#6f575c',time:'sunset'},
 {name:"VALE ALPINO",ground:['#2b4b55','#8da6a2'],water:['#17415e','#38869c'],accent:'#b6eadf',foliage:'#547e72',time:'day'},
 {name:"RIO DOURADO",ground:['#375b3f','#97a76a'],water:['#1a5064','#55a9a0'],accent:'#f6e394',foliage:'#4b976b',time:'sunset'},
 {name:"CIDADE NEON",ground:['#151e3e','#3d426e'],water:['#101e4e','#326cc2'],accent:'#fa78d4',foliage:'#4658a0',time:'night'},
 {name:"DELTA SELVAGEM",ground:['#18423b','#628f58'],water:['#124c65','#2a93a4'],accent:'#b4f29b',foliage:'#3a8964',time:'day'},
 {name:"TEMPESTADE GLACIAL",ground:['#53667e','#d1e0e9'],water:['#174768','#69a7ba'],accent:'#e4fcff',foliage:'#92b3bc',time:'night'},
 {name:"OÁSIS DESÉRTICO",ground:['#8b6041','#dcc17a'],water:['#145977','#48bbba'],accent:'#fce6a1',foliage:'#6da479',time:'day'},
 {name:"FLORESTA LUMINOSA",ground:['#162d39','#2d636a'],water:['#12425f','#308d97'],accent:'#8bffdf',foliage:'#369b8a',time:'night'},
 {name:"ESTALEIRO MILITAR",ground:['#26323f','#627077'],water:['#103e5a','#37718a'],accent:'#fcb983',foliage:'#6d7b81',time:'sunset'},
 {name:"ILHAS GLACIAIS",ground:['#80939e','#e5f5f9'],water:['#1a4a71','#75bdd0'],accent:'#defaff',foliage:'#accad3',time:'day'},
 {name:"RUÍNAS ELÉTRICAS",ground:['#202d45','#53687b'],water:['#143553','#507d9e'],accent:'#91ebff',foliage:'#517e85',time:'night'},
 {name:"CONFLUÊNCIA DOS REINOS",ground:['#344b55','#9d9c75'],water:['#1b5678','#4eb3bd'],accent:'#f8e49b',foliage:'#5a8d73',time:'sunset'}
];
function hash(n){const t=Math.sin(n*127.1+78.233)*43758.5453;return t-Math.floor(t)}
function poly(c,coords,fill){c.fillStyle=fill;c.beginPath();c.moveTo(coords[0],coords[1]);for(let i=2;i<coords.length;i+=2)c.lineTo(coords[i],coords[i+1]);c.closePath();c.fill()}
function lerp(a,b,t){return a+(b-a)*t}
function ground(c,w,h,t){const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,t.ground[0]);g.addColorStop(1,t.ground[1]);c.fillStyle=g;c.fillRect(0,0,w,h)}
function bankAt(points,y,w){for(let i=0;i<points.length-1;i++){let a=points[i],b=points[i+1];if(y<=a.y&&y>=b.y||y>=a.y&&y<=b.y){let k=(y-a.y)/(b.y-a.y||1);let mid=lerp(a.center,b.center,k),width=lerp(a.width,b.width,k);return [mid-width/2,mid+width/2]}}return [w*.12,w*.88]}
function riverPath(c,points){if(points.length<2)return false;c.beginPath();c.moveTo(points[0].center-points[0].width/2,points[0].y);for(let p of points)c.lineTo(p.center-p.width/2,p.y);for(let i=points.length-1;i>=0;i--){let p=points[i];c.lineTo(p.center+p.width/2,p.y)}c.closePath();return true}
function tree(c,x,y,s,t,night){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='rgba(1,12,20,.27)';c.beginPath();c.ellipse(4,6,12,5,0,0,Math.PI*2);c.fill();c.fillStyle='#42372d';c.fillRect(-2,-3,4,12);c.fillStyle=t.foliage;poly(c,[-11,2,-7,-8,1,-19,10,-6,12,3],t.foliage);poly(c,[-6,-2,0,-17,6,-2],night?'#277264':'#51a07a');c.restore()}
function building(c,x,y,s,night){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='rgba(0,0,0,.28)';c.fillRect(-7,3,21,18);poly(c,[-10,0,0,-9,10,0,0,9],'#152a3e');c.fillStyle='#486276';c.fillRect(-10,0,20,21);c.fillStyle='#263e50';c.fillRect(4,0,6,21);if(night){c.fillStyle='#ffd68e';for(let i=-7;i<=3;i+=7)for(let j=4;j<20;j+=8)c.fillRect(i,j,3,3)}c.restore()}
function landscape(c,data,t){
 let {w,h,riverPoints:points,distance=0,quality='balanced'}=data;
 ground(c,w,h,t);
 const water=c.createLinearGradient(0,0,0,h);water.addColorStop(0,t.water[0]);water.addColorStop(1,t.water[1]);
 if(riverPath(c,points)){c.fillStyle=water;c.fill();c.strokeStyle='rgba(165,240,232,.27)';c.lineWidth=3;c.stroke()}
 const tile=quality==='eco'?70:42, phase=(distance*.17)%tile;
 for(let y=-tile+phase;y<h+tile;y+=tile){
   let banks=bankAt(points,y,w);
   for(let side=0;side<2;side++){
     const span=side===0?banks[0]:w-banks[1];
     for(let col=0;col<2;col++){
       let seed=Math.floor((y-phase)/tile)*17+side*311+col*97;
       const x=side===0?span*(col+.35)/2:w-span*(col+.35)/2;
       const jitter=(hash(seed)-.5)*Math.min(20,span*.25);
       if(span<22)continue;
       if(/CIDADE|INDUSTRIAL|ESTALEIRO|MEGACIDADE|RUÍNAS/.test(t.name))building(c,x+jitter,y,0.65+hash(seed+1)*.5,t.time==='night');
       else if(/DESERTO|OÁSIS/.test(t.name)){poly(c,[x-13,y+10,x-2,y-7,x+13,y+10],hash(seed)>.5?'#bf8f57':'#9e7648');if(hash(seed+3)>.68)tree(c,x,y,0.55,t,false)}
       else if(/ÁRTICO|GLACIAL|ALPINO|FIORDE/.test(t.name)){poly(c,[x-17,y+13,x,y-15,x+20,y+13],hash(seed)>.5?'#a9c1c3':'#607d83');poly(c,[x-8,y,x,y-15,x+8,y],'#e3eff1')}
       else tree(c,x+jitter,y,.75+hash(seed+2)*.45,t,t.time==='night');
     }
   }
 }
 c.save();if(riverPath(c,points)){c.clip();c.strokeStyle='rgba(205,249,244,.12)';c.lineWidth=1;for(let y=(distance*.26)%35;y<h;y+=35){let b=bankAt(points,y,w);let x=lerp(b[0],b[1],.17+hash(y|0)*.66);c.beginPath();c.ellipse(x,y,12,2,-.2,0,Math.PI);c.stroke()}}c.restore();
 // Vinheta leve preservando visibilidade dos alvos noturnos.
 if(t.time==='night'){c.fillStyle='rgba(5,10,30,.16)';c.fillRect(0,0,w,h);c.fillStyle='rgba(255,220,143,.1)';for(let y=26;y<h;y+=130){let b=bankAt(points,y,w);c.beginPath();c.arc(b[0]-6,y,10,0,Math.PI*2);c.fill();c.beginPath();c.arc(b[1]+6,y,10,0,Math.PI*2);c.fill()}}
}
function plane(c,x,y,style='falcao',size=1){
 const colors={falcao:['#c7e2ec','#df4a42','#263e59'],vespa:['#e8be57','#f79430','#453b49'],cometa:['#7bdcf7','#3782df','#25386e']};
 const [body,trim,dark]=colors[style]||colors.falcao;
 c.save();c.translate(x,y);c.scale(size,size);
 c.fillStyle='rgba(1,14,28,.35)';c.beginPath();c.ellipse(5,13,22,11,0,0,Math.PI*2);c.fill();
 if(style==='cometa'){poly(c,[-21,11,-7,-12,0,-25,7,-12,21,11,7,7,0,14,-7,7],dark);poly(c,[-16,8,0,-23,16,8,0,3],body)}
 else if(style==='vespa'){poly(c,[-19,3,-7,-4,0,-23,7,-4,19,3,10,12,-10,12],dark);poly(c,[-17,3,0,-23,17,3,0,9],body)}
 else{poly(c,[-23,8,-7,-5,0,-23,7,-5,23,8,9,11,-9,11],dark);poly(c,[-19,5,0,-22,19,5,0,9],body)}
 poly(c,[-3,10,-3,-16,0,-25,3,-16,3,10],trim);
 poly(c,[-4,-4,0,-14,4,-4,2,1,-2,1],'#8ae6ff');
 c.fillStyle=trim;c.fillRect(-19,6,6,3);c.fillRect(13,6,6,3);
 c.fillStyle='#fbba5a';poly(c,[-5,13,0,23,5,13],'#ff984f');
 c.restore();
}
function enemy(c,e,time){
 c.save();c.translate(e.x,e.y);let type=e.type||'JET';
 c.fillStyle='rgba(0,8,20,.36)';c.beginPath();c.ellipse(3,8,Math.max(13,(e.width||22)*.5),8,0,0,Math.PI*2);c.fill();
 if(type==='HELI'){poly(c,[-8,-9,8,-9,12,9,-12,9],'#b7a465');c.fillStyle='#65b8d2';c.fillRect(-5,-7,10,7);c.strokeStyle='#e5f6ed';c.lineWidth=2;c.beginPath();c.moveTo(-18,-10);c.lineTo(18,-10);c.stroke()}
 else if(type==='SHIP'){poly(c,[-13,-14,0,-20,13,-14,10,19,-10,19],'#5d7c8a');c.fillStyle='#c7d6dc';c.fillRect(-6,-6,12,13);c.fillStyle='#f0b95f';c.fillRect(-2,-13,4,7)}
 else if(type==='TURRET'){c.fillStyle='#6a778b';c.beginPath();c.arc(0,0,11,0,Math.PI*2);c.fill();c.fillStyle='#efbe7b';c.fillRect(-3,-16,6,16)}
 else if(type==='BOSS'){const w=Math.min(175,e.width||110),h=Math.min(75,e.height||50);poly(c,[-w*.5,4,-w*.32,-h*.4,w*.32,-h*.4,w*.5,4,w*.23,h*.4,-w*.23,h*.4],'#536b86');poly(c,[-w*.18,0,0,-h*.5,w*.18,0],'#da717a');c.fillStyle='#65d7eb';c.fillRect(-12,-4,24,12)}
 else{poly(c,[-13,-7,0,-15,13,-7,9,13,0,5,-9,13],'#bb606d');poly(c,[-3,-14,0,-19,3,-14,3,13,-3,13],'#3d4666')}
 if(time==='night'){c.fillStyle='#ffd581';c.beginPath();c.arc(-5,7,2,0,7);c.arc(5,7,2,0,7);c.fill()}
 c.restore();
 if(e.maxHp>1){c.fillStyle='#122535';c.fillRect(e.x-e.width/2,e.y-e.height/2-9,e.width,5);c.fillStyle='#7cf0ca';c.fillRect(e.x-e.width/2,e.y-e.height/2-9,e.width*Math.max(0,e.hp/e.maxHp),5)}
}
function islands(c,items,t){for(let p of items){c.fillStyle='rgba(2,12,20,.32)';c.beginPath();c.ellipse(p.x+4,p.y+5,p.width*.57,p.height*.5,0,0,7);c.fill();c.fillStyle=t.ground[1];c.beginPath();c.ellipse(p.x,p.y,p.width*.5,p.height*.45,0,0,7);c.fill();tree(c,p.x,p.y,.65,t,t.time==='night')}}
function draw(c,d){const t=THEMES[((d.sector-1)%THEMES.length+THEMES.length)%THEMES.length];landscape(c,d,t);islands(c,d.islands,t);for(let e of d.enemies)enemy(c,e,t.time);if(!d.invulnerable||Math.floor(Date.now()/110)%2)plane(c,d.player.x,d.player.y,d.aircraft,1);}
root.RiverVisuals={draw,plane,enemy,THEMES};
})(window);
