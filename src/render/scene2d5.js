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
// RiverStorm Fase 02: efeitos determinísticos, ligados à distância percorrida.
function waterMotion(c,points,w,h,distance,quality,t){
 if(!riverPath(c,points))return;
 c.save();c.clip();
 const step=quality==='eco'?76:quality==='enhanced'?35:51;
 const travel=distance*.42,phase=((travel%step)+step)%step;
 for(let y=-step+phase;y<h+step;y+=step){
   const banks=bankAt(points,y,w),span=banks[1]-banks[0];
   if(span<35)continue;
   for(let lane=1;lane<=(quality==='eco'?2:quality==='enhanced'?5:3);lane++){
     const seed=Math.floor((y-phase)/step)*17+lane*83;
     const x=banks[0]+span*(lane/(quality==='eco'?3:quality==='enhanced'?6:4));
     const dx=(hash(seed)-.5)*Math.min(span*.12,18);
     const len=8+hash(seed+4)*17;
     c.strokeStyle=lane%2?'rgba(210,252,255,.15)':'rgba(6,26,44,.19)';
     c.lineWidth=lane%2?1.4:2.1;
     c.beginPath();c.moveTo(x+dx-len*.5,y-4);c.quadraticCurveTo(x+dx,y,x+dx+len*.5,y-2);c.stroke();
   }
 }
 c.restore();
}
function bankDetails(c,points,w,h,distance,quality,t){
 const step=quality==='eco'?95:quality==='enhanced'?39:62;
 const phase=((distance*.8%step)+step)%step;
 for(let y=-step+phase;y<h+step;y+=step){
   const banks=bankAt(points,y,w);
   for(const side of [-1,1]){
     const edge=side<0?banks[0]:banks[1],outside=edge+side*13;
     if(outside<4||outside>w-4)continue;
     const seed=Math.floor((y-phase)/step)*19+(side<0?3:7);
     if(hash(seed)>.42){
       c.fillStyle=hash(seed+2)>.5?'rgba(21,40,46,.53)':'rgba(188,198,168,.36)';
       c.beginPath();c.ellipse(outside+side*5,y,4+hash(seed+1)*5,2+hash(seed+3)*4,hash(seed+6)*.8,0,Math.PI*2);c.fill();
     }else if(quality!=='eco'){
       c.strokeStyle=t.foliage;c.lineWidth=2;
       c.beginPath();c.moveTo(outside,y+6);c.lineTo(outside-2,y-6);c.moveTo(outside,y+3);c.lineTo(outside+side*5,y-4);c.stroke();
     }
   }
 }
}
function landscape(c,data,t){
 let {w,h,riverPoints:points,distance=0,quality='balanced'}=data;
 ground(c,w,h,t);
 // Volume e profundidade simulados com sombras nas margens; pulso leve no ritmo da ação.
 const beat=(Math.sin(Date.now()/215)+1)*.5;
 const water=c.createLinearGradient(0,0,0,h);water.addColorStop(0,t.water[0]);water.addColorStop(1,t.water[1]);
 if(riverPath(c,points)){
   c.shadowColor='rgba(0,11,26,.75)';c.shadowBlur=quality==='eco'?6:quality==='enhanced'?19:15;
   c.fillStyle=water;c.fill();c.shadowBlur=0;
   c.strokeStyle='rgba(165,240,232,'+(.3+beat*.15)+')';c.lineWidth=3;c.stroke();
 }
 if(quality!=='eco'){
   for(let y=24;y<h;y+=54){
     const b=bankAt(points,y,w);
     for(const edge of [b[0],b[1]]){
       c.strokeStyle='rgba(6,15,24,.24)';c.lineWidth=10;c.beginPath();c.moveTo(edge-3,y-17);c.lineTo(edge+2,y+18);c.stroke();
       c.strokeStyle='rgba(255,249,208,.18)';c.lineWidth=2;c.beginPath();c.moveTo(edge-7,y-15);c.lineTo(edge-2,y+15);c.stroke();
     }
   }
 }
 const tile=quality==='eco'?70:quality==='enhanced'?34:42, phase=(distance*.17)%tile;
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
 waterMotion(c,points,w,h,distance,quality,t);
 bankDetails(c,points,w,h,distance,quality,t);
 // Clima por missão: neblina, chuva, inverno e tempo aberto, legível em telas pequenas.
 const mission=Math.max(1,Math.min(20,data.sector||1));
 const weather=['sun','mist','rain','sun','sun','snow','rain','mist','sun','snow','sun','rain','mist','snow','sun','mist','rain','snow','rain','sun'][(mission-1)%20];
 if(weather==='mist'){
   const fog=c.createLinearGradient(0,0,0,h);fog.addColorStop(0,'rgba(225,239,241,.17)');fog.addColorStop(.55,'rgba(196,215,221,.08)');fog.addColorStop(1,'rgba(213,239,244,.21)');c.fillStyle=fog;c.fillRect(0,0,w,h);
 }else if(weather==='rain'||weather==='snow'){
   const amount=quality==='eco'?28:quality==='enhanced'?76:62;
   c.strokeStyle=weather==='rain'?'rgba(171,214,255,.34)':'rgba(255,255,255,.6)';
   c.lineWidth=weather==='rain'?1:2;
   const phase=(Date.now()/(weather==='rain'?7:21))%h;
   for(let k=0;k<amount;k++){const x=hash(k*33+mission)*w,y=(hash(k*13+mission)*h+phase*(.3+hash(k*9)))%h;c.beginPath();c.moveTo(x,y);c.lineTo(x+(weather==='rain'?7:2),y+(weather==='rain'?17:3));c.stroke()}
 }
 // Perfil Aprimorado: reflexos discretos limitados ao canal, sem afetar colisões.
 if(quality==='enhanced'&&riverPath(c,points)){
   c.save();c.clip();c.lineWidth=1;
   const phase=(distance*.35)%58;
   for(let y=phase-58;y<h;y+=58){
     const b=bankAt(points,y,w);const x=lerp(b[0],b[1],.27+hash(y+mission)*.46);
     c.strokeStyle='rgba(208,252,255,.16)';
     c.beginPath();c.moveTo(x-18,y);c.quadraticCurveTo(x,y-3,x+20,y);c.stroke();
   }
   c.restore();
 }
 // Vinheta leve preservando visibilidade dos alvos noturnos.
 if(t.time==='night'){c.fillStyle='rgba(5,10,30,.16)';c.fillRect(0,0,w,h);c.fillStyle='rgba(255,220,143,'+(.1+beat*.09)+')';for(let y=26;y<h;y+=130){let b=bankAt(points,y,w);c.beginPath();c.arc(b[0]-6,y,10,0,Math.PI*2);c.fill();c.beginPath();c.arc(b[1]+6,y,10,0,Math.PI*2);c.fill()}}
}
function plane(c,x,y,style='falcao',size=1){
 const colors={falcao:['#c7e2ec','#df4a42','#263e59'],vespa:['#e8be57','#f79430','#453b49'],cometa:['#7bdcf7','#3782df','#25386e'],fenix:['#f9a8d4','#db2777','#701a75'],titan:['#d9f99d','#65a30d','#365314'],helicoptero:['#93c5fd','#2563eb','#183153'],disco:['#d8b4fe','#8b5cf6','#312e81']};
 const [body,trim,dark]=colors[style]||colors.falcao;
 c.save();c.translate(x,y);c.scale(size,size);
 c.fillStyle='rgba(1,14,28,.35)';c.beginPath();c.ellipse(5,13,22,11,0,0,Math.PI*2);c.fill();
 if(style==='disco'){c.fillStyle=dark;c.beginPath();c.ellipse(0,0,29,16,0,0,7);c.fill();c.fillStyle=body;c.beginPath();c.ellipse(0,-4,19,13,0,0,7);c.fill();c.fillStyle='#a5f3fc';c.beginPath();c.ellipse(0,-6,10,7,0,0,7);c.fill();c.strokeStyle='#ddd6fe';c.lineWidth=2;c.beginPath();c.ellipse(0,0,32,19,0,0,7);c.stroke()}
 else if(style==='helicoptero'){poly(c,[-10,-14,10,-14,11,12,-11,12],dark);c.fillStyle=body;c.fillRect(-7,-12,14,22);c.strokeStyle='#dbeafe';c.lineWidth=3;c.beginPath();c.moveTo(-26,-10);c.lineTo(26,-10);c.stroke();c.fillStyle='#7dd3fc';c.fillRect(-4,-8,8,10)}
 else if(style==='titan'){poly(c,[-29,12,-18,-5,-12,-9,0,-24,12,-9,18,-5,29,12,15,7,7,16,-7,16,-15,7],dark);poly(c,[-24,9,-9,-4,0,-22,9,-4,24,9,0,9],body)}
 else if(style==='fenix'){poly(c,[-27,7,-14,-7,-8,-6,0,-27,8,-6,14,-7,27,7,13,11,0,4,-13,11],dark);poly(c,[-23,5,0,-25,23,5,0,0],body)}
 else if(style==='cometa'){poly(c,[-21,11,-7,-12,0,-25,7,-12,21,11,7,7,0,14,-7,7],dark);poly(c,[-16,8,0,-23,16,8,0,3],body)}
 else if(style==='vespa'){poly(c,[-19,3,-7,-4,0,-23,7,-4,19,3,10,12,-10,12],dark);poly(c,[-17,3,0,-23,17,3,0,9],body)}
 else{poly(c,[-23,8,-7,-5,0,-23,7,-5,23,8,9,11,-9,11],dark);poly(c,[-19,5,0,-22,19,5,0,9],body)}
 // Luzes de asa, painéis e fuselagem de leitura clara em telas pequenas.
 c.strokeStyle='#d9f6ff';c.lineWidth=1;c.globalAlpha=.65;
 c.beginPath();c.moveTo(-15,5);c.lineTo(-5,-4);c.moveTo(15,5);c.lineTo(5,-4);c.stroke();c.globalAlpha=1;
 poly(c,[-3,10,-3,-16,0,-25,3,-16,3,10],trim);
 poly(c,[-4,-4,0,-14,4,-4,2,1,-2,1],'#8ae6ff');
 c.fillStyle=trim;c.fillRect(-19,6,6,3);c.fillRect(13,6,6,3);
 // Diferencia os motores e superfícies das aeronaves premium.
 if(style==='fenix'){
   c.strokeStyle='#ffd1ee';c.lineWidth=2;c.beginPath();c.moveTo(-22,4);c.lineTo(-8,-13);c.moveTo(22,4);c.lineTo(8,-13);c.stroke();
   c.fillStyle='#67e8f9';c.fillRect(-16,6,5,3);c.fillRect(11,6,5,3);
 }else if(style==='titan'){
   c.fillStyle='#1f2937';c.fillRect(-27,3,9,12);c.fillRect(18,3,9,12);
   c.fillStyle='#bef264';c.fillRect(-24,-1,5,13);c.fillRect(19,-1,5,13);
   c.fillStyle='#fbbf24';c.fillRect(-4,9,8,8);
 }
 c.fillStyle='#fbba5a';poly(c,[-5,13,0,23,5,13],'#ff984f');
 c.restore();
}
function enemy(c,e,time){
 c.save();c.translate(e.x,e.y);let type=e.type||'JET';
 c.fillStyle='rgba(0,8,20,.36)';c.beginPath();c.ellipse(3,8,Math.max(13,(e.width||22)*.5),8,0,0,Math.PI*2);c.fill();
 if(type==='MECHA_SWORD'||type==='MECHA_GUN'){
   const sword=type==='MECHA_SWORD',primary=sword?'#a855f7':'#d97731',light=sword?'#f0abfc':'#fbbf24';
   // Robô humanoide articulado, armadura e equipamentos legíveis.
   c.fillStyle='#1e293b';c.fillRect(-10,9,8,18);c.fillRect(2,9,8,18);
   c.fillStyle=primary;c.fillRect(-11,-17,22,30);c.fillRect(-16,-12,5,22);c.fillRect(11,-12,5,22);
   c.fillStyle='#334155';c.fillRect(-9,-27,18,14);
   c.fillStyle=light;c.fillRect(-7,-22,14,4);c.fillRect(-6,-7,12,5);
   if(sword){c.strokeStyle='#cffafe';c.lineWidth=5;c.beginPath();c.moveTo(17,5);c.lineTo(30,-27);c.stroke();c.strokeStyle='#7dd3fc';c.lineWidth=2;c.beginPath();c.moveTo(17,5);c.lineTo(30,-27);c.stroke()}
   else{c.fillStyle='#111827';c.fillRect(10,-14,18,10);c.fillStyle=light;c.fillRect(27,-12,6,5)}
 }
 else if(type==='TANK'){
   c.fillStyle='#243c30';c.fillRect(-13,-17,26,34);
   c.fillStyle='#64866c';c.fillRect(-9,-14,18,28);
   c.fillStyle='#263b30';c.fillRect(-15,-15,5,30);c.fillRect(10,-15,5,30);
   c.fillStyle='#91a77e';c.beginPath();c.arc(0,0,8,0,Math.PI*2);c.fill();
   c.fillStyle='#172d27';c.fillRect(-3,-22,6,22);
   c.fillStyle='#ffe08c';c.fillRect(-2,-22,4,5);
 }
 else if(type==='SUB'){poly(c,[-12,-17,0,-22,12,-17,11,17,0,22,-11,17],'#486b77');c.fillStyle='#93c5d0';c.fillRect(-4,-11,8,10);c.fillStyle='#d7f8ff';c.fillRect(-2,-17,4,5)}
 else if(type==='HELI'){poly(c,[-9,-13,9,-13,11,7,5,15,-5,15,-11,7],'#8d966c');poly(c,[-6,-9,0,-13,6,-9,4,1,-4,1],'#7dd3fc');c.strokeStyle='#e5f6ed';c.lineWidth=2;c.beginPath();const a=Date.now()/65;c.moveTo(-19*Math.cos(a),-8-19*Math.sin(a)*.2);c.lineTo(19*Math.cos(a),-8+19*Math.sin(a)*.2);c.stroke();c.fillStyle='#314453';c.fillRect(-2,11,4,14)}
 else if(type==='SHIP'){poly(c,[-12,-17,0,-22,12,-17,13,12,5,20,-5,20,-13,12],'#3b556d');poly(c,[-8,-13,0,-17,8,-13,8,13,-8,13],'#849cac');c.fillStyle='#d8e9ee';c.fillRect(-5,-8,10,14);c.fillStyle='#293d50';c.fillRect(-2,-16,4,9);c.fillRect(-3,9,6,5);c.fillStyle='#fbbf24';c.fillRect(-1,-18,2,2)}
 else if(type==='TURRET'){c.fillStyle='#6a778b';c.beginPath();c.arc(0,0,11,0,Math.PI*2);c.fill();c.fillStyle='#efbe7b';c.fillRect(-3,-16,6,16)}
 else if(type==='BOSS'){
  const id=((e.bossId||1)-1)%20,mode=({ship:0,heli:1,sub:2,mech:3,insect:4,jet:4}[e.bossVisual]??id%5),variant=Math.floor(id/5),w=Math.min(175,e.width||110),h=Math.min(85,e.height||60);
  const biomePalettes={jungle:['#47785d','#b1e49a','#facc15'],industrial:['#536878','#bfdbfe','#fbbf24'],desert:['#a87948','#f9de97','#ef4444'],arctic:['#799db8','#e0f7ff','#38bdf8'],volcanic:['#713c44','#f87171','#fbbf24'],city:['#485b89','#c4b5fd','#67e8f9'],neon:['#5943a4','#f5a9fd','#22d3ee'],glacial:['#7e9db9','#e5f8ff','#7dd3fc']};const palette=biomePalettes[e.biome]||[['#667f98','#cbd5e1','#38bdf8'],['#7c516c','#f9a8d4','#f59e0b'],['#516e55','#bef264','#f87171'],['#625781','#c4b5fd','#67e8f9']][variant];
  c.fillStyle='rgba(1,9,22,.5)';c.beginPath();c.ellipse(5,12,w*.52,h*.42,0,0,7);c.fill();
  if(mode===0){ // cruzador / fortaleza aérea
    poly(c,[-w*.42,10,-w*.34,-h*.3,0,-h*.45,w*.34,-h*.3,w*.42,10,w*.2,h*.37,-w*.2,h*.37],palette[0]);
    c.fillStyle=palette[1];c.fillRect(-w*.13,-h*.15,w*.26,h*.48);c.fillStyle=palette[2];c.fillRect(-w*.28,1,14,7);c.fillRect(w*.28-14,1,14,7);
  }else if(mode===1){ // helicóptero gigante
    poly(c,[-w*.22,-h*.35,w*.22,-h*.35,w*.33,h*.1,0,h*.4,-w*.33,h*.1],palette[0]);
    c.strokeStyle=palette[1];c.lineWidth=5;c.beginPath();c.moveTo(-w*.5,-h*.27);c.lineTo(w*.5,-h*.27);c.stroke();
    c.fillStyle=palette[2];c.fillRect(-w*.35,0,12,20);c.fillRect(w*.35-12,0,12,20);
  }else if(mode===2){ // submarino blindado
    c.fillStyle=palette[0];c.beginPath();c.ellipse(0,0,w*.3,h*.49,0,0,7);c.fill();
    c.fillStyle=palette[1];c.fillRect(-w*.12,-h*.12,w*.24,h*.27);c.fillRect(-5,-h*.4,10,18);
    c.strokeStyle=palette[2];c.lineWidth=4;c.beginPath();c.moveTo(-w*.34,0);c.lineTo(w*.34,0);c.stroke();
  }else if(mode===3){ // aranha/robô com patas articuladas
    c.strokeStyle=palette[0];c.lineWidth=8;
    for(let side of [-1,1])for(let k=0;k<4;k++){let yy=-h*.28+k*h*.19;c.beginPath();c.moveTo(side*w*.14,yy);c.lineTo(side*w*.35,yy-12);c.lineTo(side*w*.49,yy+9);c.stroke()}
    c.fillStyle=palette[1];c.beginPath();c.ellipse(0,0,w*.2,h*.31,0,0,7);c.fill();
    c.fillStyle=palette[2];c.fillRect(-13,-10,10,7);c.fillRect(3,-10,10,7);
  }else{ // drone inseto mecânico / borboleta / abelha
    poly(c,[-w*.47,-h*.35,-w*.1,-h*.19,0,0,-w*.15,h*.28,-w*.42,h*.2],palette[0]);
    poly(c,[w*.47,-h*.35,w*.1,-h*.19,0,0,w*.15,h*.28,w*.42,h*.2],palette[1]);
    poly(c,[-w*.12,h*.22,0,-h*.43,w*.12,h*.22,0,h*.43],palette[2]);
  }
  // Variações estruturais adicionais por missão individual.
  const nodes=2+(id%4);
  for(let n=0;n<nodes;n++){const x=(n-(nodes-1)/2)*(w*.55/nodes),y=(id%2?12:-9);c.fillStyle=palette[2];c.beginPath();c.arc(x,y,3+(id%3),0,7);c.fill()}
}
 else{poly(c,[-15,-9,-5,-6,0,-20,5,-6,15,-9,13,8,5,6,0,16,-5,6,-13,8],'#9b4d6e');poly(c,[-3,-15,0,-23,3,-15,3,10,-3,10],'#d1a5b5');poly(c,[-3,-8,0,-14,3,-8,0,-2],'#7dd3fc')}
 if(time==='night'){c.fillStyle='#ffd581';c.beginPath();c.arc(-5,7,2,0,7);c.arc(5,7,2,0,7);c.fill()}
 c.restore();
 if(e.maxHp>1){c.fillStyle='#122535';c.fillRect(e.x-e.width/2,e.y-e.height/2-9,e.width,5);c.fillStyle='#7cf0ca';c.fillRect(e.x-e.width/2,e.y-e.height/2-9,e.width*Math.max(0,e.hp/e.maxHp),5)}
}
function islands(c,items,t){
 for(let p of items){
  c.save();c.translate(p.x,p.y);
  const n=p.shape||0,rx=p.width*.5,ry=p.height*.45;
  c.fillStyle='rgba(2,12,20,.4)';c.beginPath();c.ellipse(5,8,rx*1.2,ry*1.2,0,0,Math.PI*2);c.fill();
  c.fillStyle=t.ground[1];c.strokeStyle=t.accent;c.lineWidth=2;c.beginPath();
  const count=[9,5,7,12,6][n%5];
  for(let i=0;i<count;i++){
    const angle=i/count*Math.PI*2,irreg=1+(Math.sin(i*21.7+n*3)*.12);
    const x=Math.cos(angle)*rx*irreg,y=Math.sin(angle)*ry*irreg;
    if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
  }
  c.closePath();c.fill();c.stroke();
  if(p.width>42)tree(c,-p.width*.13,-3,.6,t,t.time==='night');
  c.restore();
 }
}
function draw(c,d){const t=THEMES[((d.sector-1)%THEMES.length+THEMES.length)%THEMES.length];landscape(c,d,t);islands(c,d.islands,t);for(let e of d.enemies)enemy(c,e,t.time);if(!d.invulnerable||Math.floor(Date.now()/110)%2)plane(c,d.player.x,d.player.y,d.aircraft,1);}
root.RiverVisuals={draw,plane,enemy,THEMES};
})(window);
