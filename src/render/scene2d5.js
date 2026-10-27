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
function clipShoreLand(c,points,w,h){
 if(!points||points.length<2)return false;
 c.beginPath();
 c.moveTo(0,0);c.lineTo(0,h);
 for(let y=h;y>=0;y-=6){const banks=bankAt(points,y,w);c.lineTo(Math.max(0,banks[0]-4),y);}
 c.lineTo(0,0);c.closePath();
 c.moveTo(w,0);c.lineTo(w,h);
 for(let y=h;y>=0;y-=6){const banks=bankAt(points,y,w);c.lineTo(Math.min(w,banks[1]+4),y);}
 c.lineTo(w,0);c.closePath();
 c.clip();return true;
}
function riverPath(c,points){if(points.length<2)return false;c.beginPath();c.moveTo(points[0].center-points[0].width/2,points[0].y);for(let p of points)c.lineTo(p.center-p.width/2,p.y);for(let i=points.length-1;i>=0;i--){let p=points[i];c.lineTo(p.center+p.width/2,p.y)}c.closePath();return true}
function tree(c,x,y,s,t,night){
 c.save();c.translate(x,y);c.scale(s,s);
 c.fillStyle='rgba(0,12,15,.30)';c.beginPath();c.ellipse(6,9,15,7,-.2,0,Math.PI*2);c.fill();
 // Tronco irregular em tres tons e ramos organicos.
 c.strokeStyle='#211e1a';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(0,10);c.quadraticCurveTo(-2,0,0,-13);c.stroke();
 c.strokeStyle='#876543';c.lineWidth=3;c.beginPath();c.moveTo(-1,9);c.quadraticCurveTo(-3,0,0,-13);c.stroke();
 c.strokeStyle='#644d35';c.lineWidth=2;c.beginPath();c.moveTo(0,-7);c.lineTo(-9,-15);c.moveTo(0,-10);c.lineTo(9,-18);c.stroke();
 const colors=night?['#103f3e','#216352','#408574','#75aa81']:['#184b38','#2e7148','#52955d','#91bd6d'];
 for(let i=0;i<11;i++){
  const a=i*2.399,rad=4+Math.sqrt(i)*3.2;
  const px=Math.cos(a)*rad,py=-18+Math.sin(a)*rad*.67;
  const r=5+(i%4)*1.7;
  c.fillStyle='#102c26';c.beginPath();c.ellipse(px+2,py+3,r+1,r*.83,-.3,0,7);c.fill();
  c.fillStyle=colors[(i+Math.floor(px))&3];c.beginPath();c.ellipse(px,py,r,r*.85,-.3,0,7);c.fill();
  c.fillStyle='rgba(219,255,177,.18)';c.beginPath();c.ellipse(px-r*.25,py-r*.3,r*.42,r*.2,-.5,0,7);c.fill();
 }
 c.restore();
}
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
const CLIMATE=[
  ['aurora','mist','dawn'],['harbor','drizzle','night'],['dunes','sand','noon'],['mangrove','mist','dusk'],
  ['atolls','breeze','sunset'],['fjord','snow','twilight'],['rainforest','storm','afternoon'],['megacity','neon','night'],
  ['volcano','ash','dusk'],['alpine','snow','morning'],['golden','breeze','golden'],['neon','rain','night'],
  ['delta','storm','dawn'],['blizzard','blizzard','twilight'],['oasis','sand','sunset'],['biolume','mist','midnight'],
  ['shipyard','drizzle','morning'],['icebergs','snow','noon'],['ruins','lightning','night'],['confluence','storm','sunset']
 ];
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
 c.save();clipShoreLand(c,points,w,h);
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
 c.restore(); // final do recorte das construcoes terrestres
 c.save();if(riverPath(c,points)){c.clip();c.strokeStyle='rgba(205,249,244,.12)';c.lineWidth=1;for(let y=(distance*.26)%35;y<h;y+=35){let b=bankAt(points,y,w);let x=lerp(b[0],b[1],.17+hash(y|0)*.66);c.beginPath();c.ellipse(x,y,12,2,-.2,0,Math.PI);c.stroke()}}c.restore();
 waterMotion(c,points,w,h,distance,quality,t);
 bankDetails(c,points,w,h,distance,quality,t);
 // Clima por missão: neblina, chuva, inverno e tempo aberto, legível em telas pequenas.
 const mission=Math.max(1,Math.min(20,data.sector||1));
 // Direção de arte individual das vinte operações, com ciclo de iluminação por distância.

 const climate=CLIMATE[mission-1],weather=climate[1];
 const weatherNames={mist:'NEBLINA',drizzle:'GAROA',sand:'TEMPESTADE DE AREIA',breeze:'BRISA',snow:'NEVE',storm:'TEMPESTADE',neon:'LUZES NEON',ash:'CINZAS VULCÂNICAS',rain:'CHUVA',blizzard:'NEVASCA',lightning:'TEMPESTADE ELÉTRICA'};
 const periodNames={dawn:'AMANHECER',night:'NOITE',noon:'MEIO-DIA',dusk:'ANOITECER',sunset:'PÔR DO SOL',twilight:'CREPÚSCULO',afternoon:'TARDE',morning:'MANHÃ',golden:'HORA DOURADA',midnight:'MADRUGADA'};
 // Estado para o HUD inferior. O renderer não deve desenhar texto no topo da arena.
 root.RiverStormEnvironment={period:periodNames[climate[2]]||'DIA',weather:weatherNames[weather]||'CÉU LIMPO',sector:mission};
 const cycle=((distance*.00012+mission*.071)%1+1)%1;
 // Transição suave entre duas iluminações por operação; o céu nunca obstrui tiros e HUD.
 const dayGlow=(Math.sin(cycle*Math.PI*2-Math.PI*.5)+1)*.5;
 const darkness=climate[2]==='night'||climate[2]==='midnight'?.16:climate[2]==='twilight'?.11:.045;
 c.fillStyle='rgba(4,12,30,'+(darkness+(.10*(1-dayGlow))).toFixed(3)+')';c.fillRect(0,0,w,h);
 if(quality!=='eco'){
   const light=c.createLinearGradient(0,0,w,h);
   light.addColorStop(0,climate[2]==='sunset'||climate[2]==='golden'?'rgba(255,143,62,.14)':climate[2]==='dawn'?'rgba(255,192,128,.12)':'rgba(118,188,255,.04)');
   light.addColorStop(1,'rgba(12,36,73,0)');c.fillStyle=light;c.fillRect(0,0,w,h);
 }

 if(['mist','sand','ash'].includes(weather)){
   const tint=weather==='sand'?'rgba(237,181,99,':'rgba(202,218,230,';
   const opacity=weather==='sand'?.09:weather==='ash'?.11:.13;
   c.fillStyle=tint+opacity+')';c.fillRect(0,0,w,h);
   if(quality!=='eco'){
     const n=weather==='sand'?23:weather==='ash'?18:13;
     for(let k=0;k<n;k++){const x=(hash(k*41+mission)*w+distance*(weather==='sand'?.4:.1))%w,y=(hash(k*73+mission)*h+distance*.12)%h;
       c.fillStyle=tint+(.10+hash(k+mission)*.11)+')';c.fillRect(x,y,weather==='sand'?9:3,1);}
   }
 }else if(['rain','drizzle','storm','snow','blizzard','lightning','breeze'].includes(weather)){
   const wet=['rain','drizzle','storm','lightning'].includes(weather);
   const flakes=['snow','blizzard'].includes(weather);
   const amount=quality==='eco'?12:quality==='enhanced'?55:32;
   const count=weather==='drizzle'?Math.floor(amount*.5):weather==='blizzard'?Math.floor(amount*1.3):amount;
   c.strokeStyle=wet?'rgba(177,221,255,.32)':flakes?'rgba(248,255,255,.62)':'rgba(255,229,173,.18)';
   c.lineWidth=flakes?1.8:1;
   const t=Date.now(),wind=weather==='storm'||weather==='blizzard'?13:weather==='breeze'?7:4;
   for(let k=0;k<count;k++){
     const x=(hash(k*33+mission)*w+t*(weather==='breeze'?.008:.003)+k*wind)%w;
     const y=(hash(k*13+mission)*h+t*(flakes?.025:wet?.08:.015)*(0.3+hash(k*9)))%h;
     c.beginPath();c.moveTo(x,y);c.lineTo(x+wind,y+(flakes?4:wet?13:2));c.stroke();
   }
   if(weather==='lightning'&&quality!=='eco'&&Math.floor((distance+mission*19)/460)%7===0){
     c.fillStyle='rgba(183,218,255,.07)';c.fillRect(0,0,w,h);
   }
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

/* Parte 05: peças vetoriais leves, identificação de cada nave e inimigo.
 * Desenho apenas: colisões, armas, velocidades e desbloqueios são intocados. */
const AIRCRAFT_MARKS={falcao:['F','#f87171'],vespa:['V','#fbbf24'],cometa:['C','#38bdf8'],fenix:['X','#f472b6'],helicoptero:['A','#60a5fa'],disco:['D','#c4b5fd'],titan:['T','#bef264']};
function aircraftDetails(c,style,trim){
 const mark=AIRCRAFT_MARKS[style]||AIRCRAFT_MARKS.falcao;
 c.save();
 c.lineWidth=1.4;c.strokeStyle='rgba(205,238,255,.9)';
 // Microplacas simétricas; nacelas e motores identificáveis à distância.
 for(const side of [-1,1]){
   const span=style==='disco'?23:style==='titan'?24:style==='fenix'?19:style==='cometa'?15:17;
   c.strokeRect(side*span-3,4,6,5);
   c.fillStyle=trim;c.fillRect(side*span-2,7,4,4);
   c.beginPath();c.moveTo(side*5,0);c.lineTo(side*(span-5),5);c.stroke();
 }
 c.fillStyle='#071726';c.beginPath();c.arc(0,1,5,0,Math.PI*2);c.fill();
 c.fillStyle=mark[1];c.font='bold 7px monospace';c.textAlign='center';c.textBaseline='middle';c.fillText(mark[0],0,1);
 if(style==='helicoptero'){
   c.strokeStyle='#bdeafa';c.lineWidth=2;c.beginPath();c.moveTo(-20,-10);c.lineTo(20,-10);c.stroke();
   c.fillStyle='#94a3b8';c.fillRect(-21,-7,5,3);c.fillRect(16,-7,5,3);
 }else if(style==='disco'){
   for(let k=0;k<6;k++){const a=k*Math.PI/3+Date.now()/850;c.fillStyle=k%2?'#67e8f9':'#f0abfc';c.beginPath();c.arc(Math.cos(a)*25,Math.sin(a)*12,2,0,Math.PI*2);c.fill()}
 }else if(style==='fenix'){
   c.strokeStyle='#f9a8d4';c.beginPath();c.moveTo(-15,8);c.lineTo(-26,1);c.moveTo(15,8);c.lineTo(26,1);c.stroke();
 }else if(style==='titan'){
   c.fillStyle='#1f2937';c.fillRect(-25,12,10,5);c.fillRect(15,12,10,5);
 }
 c.restore();
}
function enemyDetails(c,e){
 const type=e.type||'JET',phase=Date.now()/170;
 c.save();c.lineWidth=1.4;
 if(type==='MECHA_SWORD'||type==='MECHA_GUN'||type==='MEGAZORD'){
   const sword=type==='MECHA_SWORD'||type==='MEGAZORD';
   c.fillStyle='#182334';c.fillRect(-9,-15,18,15);
   c.fillStyle=sword?'#e879f9':'#fbbf24';c.fillRect(-6,-11,4,3);c.fillRect(2,-11,4,3);
   c.strokeStyle='#93c5fd';c.strokeRect(-11,-17,22,30);
   c.strokeStyle='#475569';c.beginPath();c.moveTo(-9,8);c.lineTo(-15,16);c.moveTo(9,8);c.lineTo(15,16);c.stroke();
   if(sword){
     const sway=Math.sin(phase)*3;
     c.strokeStyle='#67e8f9';c.lineWidth=3;c.beginPath();c.moveTo(20,7);c.lineTo(29+sway,-29);c.stroke();
   }else{
     c.fillStyle='#111827';c.fillRect(12,-10,17,9);
     for(let i=0;i<3;i++){c.fillStyle='#fbbf24';c.fillRect(27,-9+i*3,4,2)}
   }
 }else if(type==='TANK'||type==='TURRET'){
   c.strokeStyle='#a3a3a3';c.beginPath();c.arc(0,0,type==='TANK'?7:9,0,Math.PI*2);c.stroke();
   c.fillStyle='#ffdd86';c.fillRect(-2,-12,4,3);
 }else if(type==='SHIP'||type==='SUB'){
   c.strokeStyle='#a9d3e5';c.beginPath();c.moveTo(-7,-12);c.lineTo(0,-16);c.lineTo(7,-12);c.stroke();
   c.fillStyle='#38bdf8';c.fillRect(-3,-4,6,3);
 }else if(type==='HELI'){
   c.fillStyle='#fde68a';c.fillRect(-2,-14,4,3);
 }else if(type==='JET'||type==='ZIGZAG'){
   c.strokeStyle='#fecdd3';c.beginPath();c.moveTo(-11,6);c.lineTo(-4,-2);c.moveTo(11,6);c.lineTo(4,-2);c.stroke();
 }else if(type==='BOSS'){
   c.fillStyle='rgba(255,244,184,.65)';
   for(let k=-1;k<=1;k++)c.fillRect(k*12-2,4,4,3);
 }
 c.restore();
}

function distinctAircraft(c,style){
 // Detalhes superficiais proporcionais sobre a silhueta original, sem placa extra de cor sólida.
 const tones={falcao:'#ef4444',vespa:'#f59e0b',cometa:'#38bdf8',fenix:'#f472b6',helicoptero:'#60a5fa',disco:'#a78bfa',titan:'#a3e635'};
 c.save();c.strokeStyle=tones[style]||'#f8fafc';c.lineWidth=1.2;c.globalAlpha=.88;
 const wing=style==='titan'?25:style==='disco'?23:style==='fenix'?24:style==='cometa'?15:18;
 if(style!=='disco'){c.beginPath();c.moveTo(-wing,6);c.lineTo(-8,-2);c.moveTo(wing,6);c.lineTo(8,-2);c.moveTo(0,-17);c.lineTo(0,9);c.stroke();}
 else{c.beginPath();c.ellipse(0,0,25,12,0,0,Math.PI*2);c.stroke();}
 c.fillStyle='#fde68a';c.fillRect(-wing+2,6,3,3);c.fillRect(wing-5,6,3,3);
 c.restore();
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
 // Silhuetas independentes: asas e blindagem próprias, não apenas troca de cores.
 if(style==='vespa'){
   poly(c,[-29,-5,-13,-15,-9,9,-29,17], '#d97706');
   poly(c,[29,-5,13,-15,9,9,29,17], '#d97706');
   c.fillStyle='#fef08a';c.fillRect(-24,8,9,4);c.fillRect(15,8,9,4);
 }else if(style==='cometa'){
   poly(c,[-9,-10,-30,23,-6,8], '#2563eb');
   poly(c,[9,-10,30,23,6,8], '#2563eb');
   poly(c,[-5,-20,0,-38,5,-20], '#93c5fd');
 }else if(style==='fenix'){
   poly(c,[-14,-7,-36,-18,-23,1,-30,13,-11,9], '#be185d');
   poly(c,[14,-7,36,-18,23,1,30,13,11,9], '#be185d');
 }else if(style==='helicoptero'){
   c.strokeStyle='#dbeafe';c.lineWidth=4;c.beginPath();c.moveTo(-34,-15);c.lineTo(34,-15);c.stroke();
   c.fillStyle='#1e40af';c.fillRect(-9,15,18,15);
   c.fillStyle='#60a5fa';c.fillRect(-25,-6,8,13);c.fillRect(17,-6,8,13);
 }else if(style==='titan'){
   c.fillStyle='#365314';c.fillRect(-31,-12,13,38);c.fillRect(18,-12,13,38);
   c.fillStyle='#a3e635';c.fillRect(-27,-8,5,30);c.fillRect(22,-8,5,30);
 }else if(style==='falcao'){
   poly(c,[-30,13,-10,-8,-13,13], '#ef4444');
   poly(c,[30,13,10,-8,13,13], '#ef4444');
 }
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
 aircraftDetails(c,style,trim);
 distinctAircraft(c,style);
 c.restore();
}
function drawBiomeEnemy(c,e){
 const id=e.biomeId||'',age=e.biomeAge||0,k=e.biomeSector||1;
 const colors={TUCANO:['#0e7490','#67e8f9'],CRANE:['#475569','#fbbf24'],SCORPION:['#92400e','#fcd34d'],ALLIGATOR:['#14532d','#86efac'],CORSAIR:['#991b1b','#fca5a5'],WALRUS:['#64748b','#e0f2fe'],MANTIS:['#3f6212','#a3e635'],MOTOJET:['#831843','#f9a8d4'],SALAMANDER:['#9a3412','#fdba74'],EAGLE:['#a16207','#fef08a'],DREDGER:['#78716c','#facc15'],HOVERCAR:['#581c87','#e879f9'],PIRANHA:['#166534','#4ade80'],ICE_RAY:['#475569','#bfdbfe'],BEETLE:['#92400e','#fed7aa'],PRISM_WASP:['#6b21a8','#ddd6fe'],WELDER:['#7c2d12','#fb923c'],NARWHAL:['#0369a1','#bae6fd'],EEL:['#1d4ed8','#93c5fd'],HYBRID_HUNTER:['#7f1d1d','#fda4af']};
 const [body,light]=colors[id]||['#334155','#e2e8f0'];
 c.save();c.translate(e.x,e.y);c.fillStyle=body;c.strokeStyle=light;c.lineWidth=2;
 const long=['ALLIGATOR','NARWHAL','EEL','SALAMANDER','PIRANHA','WALRUS'].includes(id);
 const insect=['MANTIS','PRISM_WASP','SCORPION','BEETLE'].includes(id);
 const flyer=['TUCANO','EAGLE','ICE_RAY','MOTOJET','HOVERCAR'].includes(id);
 if(long){
   c.beginPath();c.ellipse(0,3,11,21,Math.sin(age*.03)*.12,0,Math.PI*2);c.fill();c.stroke();
   c.beginPath();c.moveTo(-8,12);c.lineTo(-4,25);c.lineTo(0,30);c.lineTo(5,24);c.lineTo(8,13);c.stroke();
   if(id==='ALLIGATOR'){for(let i=-2;i<=2;i++){c.fillStyle=light;c.fillRect(-9,8+i*5,3,2);c.fillRect(6,8+i*5,3,2)}}
   if(id==='NARWHAL'){c.beginPath();c.moveTo(0,-16);c.lineTo(0,-35);c.stroke()}
   if(id==='EEL'){c.beginPath();for(let i=0;i<=28;i+=4)c.lineTo(Math.sin(age*.12+i*.3)*9,-18+i);c.stroke()}
 }else if(insect){
   c.beginPath();c.ellipse(0,0,11,17,0,0,Math.PI*2);c.fill();c.stroke();
   for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(-8,i*7);c.lineTo(-25,i*10+Math.sin(age*.12)*3);c.moveTo(8,i*7);c.lineTo(25,i*10-Math.sin(age*.12)*3);c.stroke()}
   if(id==='PRISM_WASP'){c.fillStyle='#c4b5fd';c.beginPath();c.ellipse(-13,-9,12,6,-.4,0,Math.PI*2);c.ellipse(13,-9,12,6,.4,0,Math.PI*2);c.fill()}
 }else if(flyer){
   c.beginPath();c.moveTo(0,-22);c.lineTo(9,-7);c.lineTo(25,3);c.lineTo(26,12);c.lineTo(5,8);c.lineTo(0,18);c.lineTo(-5,8);c.lineTo(-26,12);c.lineTo(-25,3);c.lineTo(-9,-7);c.closePath();c.fill();c.stroke();
   if(id==='HOVERCAR'){c.fillStyle='#1e1b4b';c.fillRect(-13,-8,26,17);c.fillStyle='#a5f3fc';c.fillRect(-8,-6,16,6)}
 }else{
   c.fillRect(-13,-16,26,34);c.strokeRect(-13,-16,26,34);
   c.fillStyle=light;c.fillRect(-6,-12,12,12);
   if(id==='CRANE'){c.beginPath();c.moveTo(8,-10);c.lineTo(29,-29);c.lineTo(29,2);c.stroke()}
   if(id==='WELDER'){c.fillStyle='#fb923c';c.fillRect(12,0,17,5)}
 }
 // Assinaturas visuais de cada bioma: cabeças, armas, fuselagens e efeitos distintos.
 if(id==='ALLIGATOR'){c.fillStyle='#166534';c.fillRect(-13,-20,26,14);c.fillStyle='#e2e8f0';for(let i=-2;i<=2;i++)c.fillRect(i*5,-6,2,5);}
 else if(id==='HOVERCAR'){c.fillStyle='#0f172a';c.fillRect(-20,4,40,14);c.fillStyle='#22d3ee';c.fillRect(-21,13,8,5);c.fillRect(13,13,8,5);c.fillStyle='#f472b6';c.fillRect(-7,-12,14,4);}
 else if(id==='TUCANO'){c.fillStyle='#f97316';c.beginPath();c.moveTo(0,-27);c.lineTo(12,-23);c.lineTo(0,-17);c.closePath();c.fill();c.fillStyle='#22d3ee';c.fillRect(-22,5,9,3);c.fillRect(13,5,9,3);}
 else if(id==='SCORPION'){c.strokeStyle='#fbbf24';c.lineWidth=5;c.beginPath();c.moveTo(0,14);c.bezierCurveTo(23,27,27,-10,5,-29);c.stroke();c.fillStyle='#fde68a';c.fillRect(-18,9,10,7);c.fillRect(8,9,10,7);}
 else if(id==='WALRUS'){c.strokeStyle='#e0f2fe';c.lineWidth=3;c.beginPath();c.moveTo(-5,-20);c.lineTo(-7,-33);c.moveTo(5,-20);c.lineTo(7,-33);c.stroke();}
 else if(id==='MANTIS'){c.strokeStyle='#a3e635';c.lineWidth=5;c.beginPath();c.moveTo(-10,-6);c.lineTo(-26,-20);c.lineTo(-17,-30);c.moveTo(10,-6);c.lineTo(26,-20);c.lineTo(17,-30);c.stroke();}
 else if(id==='CORSAIR'||id==='DREDGER'){c.fillStyle='#475569';c.fillRect(-13,-20,26,13);c.fillStyle='#fbbf24';c.fillRect(-4,-23,8,10);c.strokeStyle='#f8fafc';c.beginPath();c.moveTo(-18,15);c.lineTo(0,26);c.lineTo(18,15);c.stroke();}
 else if(id==='MOTOJET'){c.fillStyle='#f472b6';c.fillRect(-26,12,12,4);c.fillRect(14,12,12,4);c.fillStyle='#67e8f9';c.fillRect(-4,-25,8,16);}
 else if(id==='SALAMANDER'){c.fillStyle='#f97316';for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*6,12);c.lineTo(i*6+3,26+Math.sin(age*.2+i)*4);c.lineTo(i*6+6,12);c.fill();}}
 else if(id==='EAGLE'){c.fillStyle='#facc15';c.beginPath();c.moveTo(-30,1);c.lineTo(-9,-18);c.lineTo(-13,15);c.closePath();c.fill();c.beginPath();c.moveTo(30,1);c.lineTo(9,-18);c.lineTo(13,15);c.closePath();c.fill();}
 else if(id==='PIRANHA'){c.fillStyle='#e2e8f0';c.beginPath();c.moveTo(-9,-18);c.lineTo(0,-26);c.lineTo(9,-18);c.fill();for(let i=0;i<4;i++)c.fillRect(-7+i*5,10,3,5);}
 else if(id==='ICE_RAY'){c.fillStyle='#bfdbfe';c.beginPath();c.moveTo(-30,0);c.quadraticCurveTo(0,-34,30,0);c.lineTo(0,18);c.closePath();c.fill();}
 else if(id==='BEETLE'){c.strokeStyle='#fed7aa';c.beginPath();c.moveTo(0,-19);c.lineTo(0,18);c.moveTo(-10,-10);c.lineTo(-21,-22);c.moveTo(10,-10);c.lineTo(21,-22);c.stroke();}
 else if(id==='WELDER'){c.fillStyle='#f97316';for(let i=0;i<4;i++){const x=13+i*6,y=7+Math.sin(age*.27+i)*7;c.fillRect(x,y,3,3);}}
 else if(id==='NARWHAL'){c.strokeStyle='#e0f2fe';c.lineWidth=5;c.beginPath();c.moveTo(0,-25);c.lineTo(0,-45);c.stroke();}
 else if(id==='EEL'){c.strokeStyle='#67e8f9';c.lineWidth=2;c.beginPath();c.moveTo(-9,-12);c.lineTo(-18,-23);c.lineTo(-9,-26);c.moveTo(9,8);c.lineTo(18,20);c.stroke();}
 else if(id==='PRISM_WASP'){c.strokeStyle='#f0abfc';c.beginPath();c.moveTo(-24,-10);c.lineTo(-33,-22);c.moveTo(24,-10);c.lineTo(33,-22);c.stroke();}
 else if(id==='CRANE'){c.strokeStyle='#fde68a';c.lineWidth=3;c.beginPath();c.moveTo(-17,13);c.lineTo(-28,26);c.moveTo(17,13);c.lineTo(28,26);c.stroke();}
 else if(id==='HYBRID_HUNTER'){c.fillStyle='#fda4af';c.fillRect(-24,-4,8,23);c.fillRect(16,-4,8,23);c.fillStyle='#67e8f9';c.fillRect(-9,-12,18,7);}
 c.fillStyle=light;c.beginPath();c.arc(-4,-8,2.3,0,Math.PI*2);c.arc(4,-8,2.3,0,Math.PI*2);c.fill();
 c.globalAlpha=.3+Math.sin(age*.12)*.14;c.strokeStyle=light;c.beginPath();c.ellipse(0,0,23,27,0,0,Math.PI*2);c.stroke();
 c.restore();
}
function enemy(c,e,time){
 if(e.type==='BIOME_ENEMY'){drawBiomeEnemy(c,e);return;}
 c.save();c.translate(e.x,e.y);let type=e.type||'JET';
 // Silhuetas volumetricas das unidades terrestres e navais.
 if(type==='MECHA_SWORD'||type==='MECHA_GUN'){
  const sword=type==='MECHA_SWORD',accent=sword?'#cb75ff':'#ffb25a';
  c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=8;
  c.fillStyle='#0a1822';c.beginPath();c.ellipse(4,16,25,12,0,0,7);c.fill();c.shadowBlur=0;
  for(const sign of [-1,1]){
   c.save();c.scale(sign,1);
   c.fillStyle='#1a2935';c.strokeStyle='#8491a0';c.lineWidth=1.5;
   c.beginPath();c.moveTo(4,6);c.lineTo(13,9);c.lineTo(17,28);c.lineTo(7,28);c.lineTo(2,16);c.closePath();c.fill();c.stroke();
   c.fillStyle='#3b4b5f';c.beginPath();c.moveTo(11,-15);c.lineTo(22,-9);c.lineTo(25,7);c.lineTo(16,11);c.lineTo(13,-2);c.closePath();c.fill();c.stroke();
   c.fillStyle='#6d8495';c.fillRect(13,-11,5,13);
   c.restore();
  }
  const plate=c.createLinearGradient(-18,-20,18,17);plate.addColorStop(0,'#9cabb5');plate.addColorStop(.32,'#40596b');plate.addColorStop(1,'#172536');
  c.fillStyle=plate;c.strokeStyle='#9cb3bf';c.lineWidth=2;
  c.beginPath();c.moveTo(-12,-18);c.lineTo(12,-18);c.lineTo(17,5);c.lineTo(8,17);c.lineTo(-8,17);c.lineTo(-17,5);c.closePath();c.fill();c.stroke();
  c.fillStyle='#243747';c.beginPath();c.moveTo(-9,-26);c.lineTo(8,-26);c.lineTo(12,-16);c.lineTo(-10,-16);c.closePath();c.fill();
  c.fillStyle=accent;c.shadowColor=accent;c.shadowBlur=9;c.fillRect(-8,-21,16,4);c.fillRect(-5,1,10,6);c.shadowBlur=0;
  if(sword){
   c.strokeStyle='#364b63';c.lineWidth=5;c.beginPath();c.moveTo(22,0);c.lineTo(30,-26);c.stroke();
   c.strokeStyle='#bbf6ff';c.lineWidth=2;c.shadowColor='#70e4ff';c.shadowBlur=12;c.beginPath();c.moveTo(22,0);c.lineTo(30,-33);c.stroke();
  }else{
   c.fillStyle='#1c2838';c.fillRect(17,-9,19,10);
   for(let i=0;i<3;i++){c.fillStyle='#9ca6b3';c.fillRect(34,-8+i*3,5,2)}
   c.fillStyle='#ffac4b';c.shadowColor='#ffac4b';c.shadowBlur=8;c.fillRect(39,-5,2,4);
  }
  c.restore();c.restore();return; // restaura tambem a translacao do inimigo
 }
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
 else if(type==='SUB'||type==='SHIP'||type==='HELI'){
  const heli=type==='HELI',sub=type==='SUB',ship=type==='SHIP';
  const hull=c.createLinearGradient(-14,-22,15,22);
  hull.addColorStop(0,heli?'#b6c6ab':sub?'#98bac7':'#c2d1d4');
  hull.addColorStop(.3,heli?'#5d765c':sub?'#3c6678':'#627f91');
  hull.addColorStop(1,'#152a3a');
  // Navegacao no rio: esteira e espuma; helicóptero: sombra de altitude.
  c.fillStyle='rgba(1,15,27,.34)';c.beginPath();c.ellipse(4,15,heli?21:17,heli?8:27,0,0,7);c.fill();
  if(!heli){
   c.strokeStyle='rgba(206,246,255,.5)';c.lineWidth=1.7;
   c.beginPath();c.moveTo(-12,12);c.quadraticCurveTo(-19,28,-10,31);
   c.moveTo(12,12);c.quadraticCurveTo(19,28,10,31);c.stroke();
  }
  if(heli){
   c.fillStyle=hull;c.strokeStyle='#c3d2cc';c.lineWidth=1.3;
   c.beginPath();c.moveTo(0,-18);c.bezierCurveTo(14,-16,15,4,8,13);c.lineTo(4,16);c.lineTo(4,29);c.lineTo(-4,29);c.lineTo(-4,16);c.lineTo(-8,13);c.bezierCurveTo(-15,4,-14,-16,0,-18);c.fill();c.stroke();
   c.fillStyle='#1b3546';c.beginPath();c.ellipse(0,-9,7,8,0,0,7);c.fill();
   c.fillStyle='#7fc5d6';c.beginPath();c.ellipse(-2,-12,3,4,-.4,0,7);c.fill();
   for(let side of [-1,1]){c.fillStyle='#546a5c';c.fillRect(side*12-4,0,8,13);c.fillStyle='#1a2835';c.fillRect(side*13-2,5,4,5)}
   const a=Date.now()/53;c.save();c.translate(0,-3);c.rotate(a);c.strokeStyle='rgba(229,247,255,.75)';c.lineWidth=2;c.beginPath();c.moveTo(-22,0);c.lineTo(22,0);c.moveTo(0,-8);c.lineTo(0,8);c.stroke();c.restore();
   c.fillStyle='#ffe0a0';c.fillRect(-2,25,4,2);
  }else{
   c.fillStyle=hull;c.strokeStyle='#b0c8d1';c.lineWidth=1.7;
   c.beginPath();c.moveTo(0,-25);c.bezierCurveTo(14,-24,16,-10,15,13);c.quadraticCurveTo(12,22,0,26);c.quadraticCurveTo(-12,22,-15,13);c.bezierCurveTo(-16,-10,-14,-24,0,-25);c.fill();c.stroke();
   c.strokeStyle='#0f2739';c.lineWidth=2;c.beginPath();c.moveTo(-10,-15);c.lineTo(-9,14);c.moveTo(10,-15);c.lineTo(9,14);c.stroke();
   c.fillStyle=sub?'#34495a':'#829ca9';c.beginPath();c.roundRect(-7,-10,14,22,3);c.fill();
   c.fillStyle='#b2d7de';c.fillRect(-4,-7,8,5);
   if(ship){c.fillStyle='#233748';c.fillRect(-2,-21,4,12);c.fillStyle='#d3a16a';c.fillRect(-2,15,4,4);}
   else{c.strokeStyle='#d7eef0';c.lineWidth=2;c.beginPath();c.arc(0,0,6,0,7);c.stroke();c.fillStyle='#253d51';c.fillRect(-3,-14,6,8);}
   for(const sign of [-1,1]){c.fillStyle='#ecae56';c.fillRect(sign*11-1,7,2,3);}
  }
 }
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
 enemyDetails(c,e);
 c.restore();
 // HP e recarga dos bosses são desenhados uma única vez em drawEnemies().
}
function islands(c,items,t){
 // Materiais de relevo: renderizacao deterministica em camadas, sem sprites vetoriais lisos.
 const icy=/ÁRTICO|GLACIAL|FIORDE|NEVE|ICE/.test(t.name);
 const desert=/DESERTO|OÁSIS|DUNAS/.test(t.name);
 const industrial=/CIDADE|INDUSTRIAL|ESTALEIRO|RUÍNAS|PORTO/.test(t.name);
 const volcanic=/LAVA|VULC|MAGMA/.test(t.name);
 for(const p of items){
  const n=p.shape||0,rx=p.width*.48,ry=p.height*.43,seed=(n+1)*31+p.width*3;
  const contour=(scale=1,ox=0,oy=0)=>{
   c.beginPath();
   for(let i=0;i<=24;i++){
    const a=i/24*Math.PI*2;
    const h=1+.075*Math.sin(a*5+seed)+.055*Math.cos(a*9-seed);
    const x=ox+Math.cos(a)*rx*scale*h,y=oy+Math.sin(a)*ry*scale*h;
    if(!i)c.moveTo(x,y);else c.lineTo(x,y);
   }
   c.closePath();
  };
  c.save();c.translate(p.x,p.y);
  // Agua espumando ao redor, com sombras de contato e espuma descontinua.
  c.fillStyle='rgba(1,9,19,.46)';c.beginPath();c.ellipse(4,9,rx*1.23,ry*1.21,-.06,0,Math.PI*2);c.fill();
  for(let j=0;j<24;j++){
   const a=j/24*Math.PI*2,rad=1.13+.045*Math.sin(seed+j*2.4);
   const x=Math.cos(a)*rx*rad,y=Math.sin(a)*ry*rad;
   c.strokeStyle=j%3===0?'rgba(244,252,255,.75)':'rgba(109,204,230,.52)';
   c.lineWidth=j%4===0?2:1;
   c.beginPath();c.arc(x,y,2.7+(j%3)*1.1,a-.5,a+.7);c.stroke();
  }
  c.fillStyle=icy?'#aacfdc':desert?'#ab8554':volcanic?'#30242b':'#5f655c';contour(1);c.fill();
  c.strokeStyle='rgba(251,245,217,.60)';c.lineWidth=2;contour(1.02);c.stroke();
  // Face escura da ilha: sobreposicao de rocha recortada sob o topo iluminado.
  c.fillStyle=volcanic?'#201d27':icy?'#547686':'#252f36';contour(.93,1.5,5.5);c.fill();
  const grad=c.createLinearGradient(-rx,-ry,rx,ry);
  if(icy){grad.addColorStop(0,'#e8faff');grad.addColorStop(.55,'#a5d7e8');grad.addColorStop(1,'#678eaf')}
  else if(desert){grad.addColorStop(0,'#ead19b');grad.addColorStop(.55,'#be9b64');grad.addColorStop(1,'#66513d')}
  else if(volcanic){grad.addColorStop(0,'#8d5d4b');grad.addColorStop(.55,'#46333b');grad.addColorStop(1,'#211d29')}
  else{grad.addColorStop(0,'#a0a396');grad.addColorStop(.45,'#777e73');grad.addColorStop(1,'#39434a')}
  c.fillStyle=grad;contour(.83,-2,-4);c.fill();
  // Facetas e fendas de pedra com variacoes do material por bioma.
  for(let j=0;j<18;j++){
   const a=hash(seed+j*17.1)*Math.PI*2,r=Math.sqrt(hash(seed+91+j*7.4))*.74;
   const x=Math.cos(a)*rx*r,y=Math.sin(a)*ry*r-3;
   const size=2+hash(seed+j*19.3)*Math.min(8,rx*.17);
   c.fillStyle=icy?(j%2?'#ecfaff':'#779cab'):desert?(j%2?'#edcb87':'#806344'):volcanic?(j%2?'#7a5144':'#251d25'):(j%2?'#b3ae90':'#455353');
   c.beginPath();c.moveTo(x-size,y+size*.3);c.lineTo(x-size*.1,y-size*.85);c.lineTo(x+size,y-size*.2);c.lineTo(x+size*.4,y+size*.5);c.closePath();c.fill();
   c.strokeStyle='rgba(10,22,30,.28)';c.lineWidth=.7;c.beginPath();c.moveTo(x-size*.1,y-size*.85);c.lineTo(x+size*.4,y+size*.5);c.stroke();
  }
  if(volcanic){
   c.strokeStyle='#f97316';c.lineWidth=1.8;c.shadowColor='#fb4c18';c.shadowBlur=5;
   c.beginPath();c.moveTo(-rx*.25,-ry*.4);c.lineTo(rx*.06,-ry*.16);c.lineTo(rx*.32,ry*.17);c.stroke();c.shadowBlur=0;
  }else if(industrial){
   // Sucata e chapas enferrujadas, coerentes com os portos industriais.
   for(let i=0;i<3;i++){const x=(i-1)*rx*.43,y=ry*(i%2?-.14:.26);c.fillStyle=i%2?'#738b91':'#82674d';c.fillRect(x-5,y-3,11,7);c.strokeStyle='#28353a';c.lineWidth=1;c.strokeRect(x-5,y-3,11,7)}
  }else if(!icy&&!desert&&p.width>42){
   // Vegetacao como agrupamentos sombreados em vez de circulos vetoriais chapados.
   for(let i=0;i<9;i++){const x=(hash(seed+i*11)-.5)*rx*1.15,y=(hash(seed+i*23)-.5)*ry*.9;
    const canopy=2.5+(i%3)*1.9;
    c.fillStyle='#183d2e';c.beginPath();c.arc(x+1,y+2,canopy+1,0,7);c.fill();
    c.fillStyle=i%3===0?'#6ca85b':i%3===1?'#356a43':'#4e8545';
    c.beginPath();c.arc(x,y,canopy,0,7);c.fill();
    c.fillStyle='#a7ba73';c.fillRect(x-canopy*.3,y-canopy*.6,1.4,1.4);
   }
   if(p.width>72)tree(c,-rx*.17,-ry*.08,.48,t,t.time==='night');
  }
  if(icy){c.strokeStyle='#f3ffff';c.lineWidth=1.2;c.beginPath();c.moveTo(-rx*.3,-ry*.3);c.lineTo(0,-ry*.47);c.lineTo(rx*.26,-ry*.22);c.stroke()}
  c.restore();
 }
}

/* Fase visual 04: ambientação exclusiva e determinística por setor.
 * Apenas decoração, sem alterar colisões, caminhos ou probabilidades. */
const BIOME_DETAILS=[
 ['JUNGLE','#5ee4a0','🌿'],['PORT','#e5ac64','⚙'],['DUNES','#fbd38a','◇'],['SWAMP','#9ec46a','◌'],
 ['ARCHIPELAGO','#4ce0d2','≈'],['GLACIER','#e9faff','✧'],['RAINFOREST','#8df5b0','✳'],
 ['NEON_CITY','#ff69d1','▥'],['VOLCANO','#ff714e','▲'],['ALPINE','#e0fcff','△'],
 ['GOLD_RIVER','#ffe69c','✦'],['NIGHT_CITY','#f28de9','▦'],['DELTA','#69dda9','≈'],
 ['SNOWSTORM','#d9edff','❄'],['OASIS','#f8da79','☼'],['LUMINOUS_FOREST','#7effd5','✴'],
 ['SHIPYARD','#f0bd79','⚓'],['ICE_ISLANDS','#d5f8ff','◇'],['ELECTRIC_RUINS','#8ed7ff','ϟ'],
 ['FINAL_CONFLUENCE','#fbe1a1','✷']
];
// Marcos de terreno decorativos, estáveis por missão, sem criar entidades ou colisões.
function landmark(c,d,t){
 const sector=Math.max(1,Math.min(20,Number(d.sector)||1));
 const w=d.w,h=d.h,spacing=sector%4===0?270:360;
 const shift=(d.distance||0)*.38;
 const count=d.quality==='eco'?2:d.quality==='enhanced'?5:3;
 c.save();c.lineWidth=2;
 for(let i=0;i<count;i++){
   const slot=Math.floor(shift/spacing)+i;
   const seed=sector*2003+slot*71;
   const y=h-((shift+slot*spacing)%(h+spacing))+i*spacing*.6;
   if(y<20||y>h-18)continue;
   const [left,right]=bankAt(d.riverPoints,y,w);
   const x=slot%2===0?left*.48:right+(w-right)*.52;
   if(x<14||x>w-14)continue;
   const size=9+hash(seed)*12;
   c.save();c.translate(x,y);
   c.globalAlpha=d.quality==='eco'?.36:.61;
   c.fillStyle=t.accent;c.strokeStyle=t.accent;
   switch((sector-1)%5){
    case 0: // Selvas: árvores monumentais e raízes
     c.beginPath();c.moveTo(-size*.65,0);c.lineTo(0,-size*1.5);c.lineTo(size*.65,0);c.closePath();c.fill();c.fillRect(-2,0,4,size*.65);break;
    case 1: // Complexos militares e cidades: silhuetas industriais
     c.strokeRect(-size*.6,-size,size*1.2,size);c.fillRect(-size*.8,-size*.85,size*.3,3);
     c.beginPath();c.moveTo(size*.3,-size);c.lineTo(size*.3,-size*1.5);c.stroke();break;
    case 2: // Desertos e cânions: obeliscos de pedra
     c.beginPath();c.moveTo(-size*.45,3);c.lineTo(-size*.2,-size*1.25);c.lineTo(size*.25,-size*1.4);c.lineTo(size*.5,3);c.closePath();c.fill();break;
    case 3: // Geleiras: cristais fraturados
     c.beginPath();c.moveTo(0,-size*1.4);c.lineTo(size*.65,-size*.4);c.lineTo(0,size*.3);c.lineTo(-size*.6,-size*.2);c.closePath();c.stroke();break;
    default: // Ilhas e deltas: plataformas e faróis
     c.fillRect(-size*.55,0,size*1.1,3);c.fillRect(-size*.2,-size*.9,size*.4,size*.9);
     c.beginPath();c.arc(0,-size,3,0,Math.PI*2);c.fill();break;
   }
   c.restore();
 }
 c.restore();
}
// Assinaturas visuais próprias de cada operação: estruturas costeiras e margens dinâmicas.
const MAP_FEATURES=[
 'canopy','cranes','canyon','reeds','lighthouse','icewall','giantroots','skyline','lava','pines',
 'ruins','billboards','tributaries','icecracks','palms','spores','gantries','icebergs','tesla','citadel'
];

/* Nova Geração: objetos industriais identificáveis, sem alterar colisões.
   Desenho determinístico sem alocar sprites a cada frame. */
function detailedSetPiece(c,kind,size,time){
 const a=size,steel=c.createLinearGradient(-a,-a,a,a);
 steel.addColorStop(0,'#b7cdd8');steel.addColorStop(.45,'#587487');steel.addColorStop(1,'#243b4b');
 const poly=(pts,fill)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle='#203444';c.lineWidth=1.25;c.stroke()};
 if(kind==='cranes'||kind==='gantries'){
  // Guindaste: torre treliçada, lança, contrapeso, cabos e gancho suspenso.
  c.strokeStyle='#f3bd58';c.lineWidth=3;
  c.beginPath();c.moveTo(-a*.24,a*.8);c.lineTo(-a*.24,-a*.95);c.moveTo(a*.24,a*.8);c.lineTo(a*.24,-a*.95);c.stroke();
  for(let y=-a*.8;y<a*.76;y+=a*.32){c.beginPath();c.moveTo(-a*.24,y);c.lineTo(a*.24,y+a*.3);c.moveTo(a*.24,y);c.lineTo(-a*.24,y+a*.3);c.stroke()}
  poly([[-a*.7,-a],[a*1.25,-a],[a*1.25,-a*.75],[-a*.7,-a*.75]],steel);
  c.fillStyle='#ebaa43';c.fillRect(-a*.72,-a*.95,a*.5,a*.2);
  const hookX=a*.86,cable=a*.2+Math.sin(time*.8)*a*.08;
  c.strokeStyle='#dce9f1';c.lineWidth=1.5;c.beginPath();c.moveTo(hookX,-a*.75);c.lineTo(hookX,-a*.75+cable);c.stroke();
  c.strokeStyle='#f7cf67';c.lineWidth=3;c.beginPath();c.arc(hookX,-a*.75+cable+3,4,0,Math.PI);c.stroke();
 }else if(kind==='skyline'||kind==='billboards'||kind==='ruins'){
  for(let i=-1;i<=1;i++){const x=i*a*.46,height=a*(.95+(i===0?.65:0));poly([[x-a*.2,a],[x-a*.2,-height],[x+a*.2,-height],[x+a*.2,a]],steel);for(let j=0;j<3;j++){c.fillStyle='#ffd891';c.fillRect(x-3,-height+5+j*7,5,3)}}
 }else if(kind==='pipes'||kind==='refinery'){
  for(const x of [-a*.45,0,a*.45]){poly([[x-5,a],[x-5,-a*.9],[x+5,-a*.9],[x+5,a]],steel);c.fillStyle='#d0e1e6';c.fillRect(x-7,-a*.65,14,4)}
  c.strokeStyle='#e8aa5d';c.lineWidth=4;c.beginPath();c.moveTo(-a,a*.3);c.lineTo(a,a*.3);c.stroke();
 }
}

function mapSetPieces(c,d,t){
 const sector=Math.max(1,Math.min(20,Number(d.sector)||1)),kind=MAP_FEATURES[sector-1];
 const w=d.w,h=d.h,spacing=250+sector%4*32,offset=(d.distance||0)*.38;
 const count=d.quality==='eco'?2:d.quality==='enhanced'?6:4;
 c.save();
 for(let i=0;i<count;i++){
   const cell=Math.floor(offset/spacing)+i;
   const y=h-((offset+cell*spacing)%(h+spacing))+i*spacing*.38;
   if(y<-45||y>h+40)continue;
   const bounds=bankAt(d.riverPoints,y,w),side=(cell+sector)%2===0?-1:1;
   const x=side<0?bounds[0]*.52:bounds[1]+(w-bounds[1])*.48;
   if(x<12||x>w-12)continue;
   const size=12+hash(cell*19+sector)*12;
   c.save();c.translate(x,y);c.lineWidth=2;c.strokeStyle=t.accent;c.fillStyle=t.ground[1];c.globalAlpha=.66;
   if(detailEnabled&&['cranes','gantries','skyline','billboards','ruins','pipes','refinery'].includes(kind)){c.globalAlpha=.97;detailedSetPiece(c,kind,size,Date.now()*.001);c.restore();continue;}
   switch(kind){
    case 'canopy':case 'giantroots':case 'pines':case 'palms':case 'reeds':case 'spores':
     c.fillRect(-2,-size*.8,4,size);
     for(let a=-1;a<=1;a++){c.beginPath();c.ellipse(a*size*.42,-size,Math.max(3,size*.36),Math.max(3,size*.42),a*.28,0,Math.PI*2);c.fill();}break;
    case 'cranes':case 'gantries':case 'skyline':case 'billboards':case 'tesla':case 'citadel':
     c.strokeRect(-size*.6,-size,size*1.2,size);c.beginPath();c.moveTo(-size*.8,-size);c.lineTo(size*.9,-size*1.2);c.lineTo(size*.9,-size*.7);c.stroke();
     if(kind==='tesla'){c.beginPath();c.moveTo(0,-size*1.7);c.lineTo(4,-size*1.45);c.lineTo(-3,-size*1.25);c.stroke();}break;
    case 'icewall':case 'icecracks':case 'icebergs':case 'canyon':case 'lava':case 'ruins':
     c.beginPath();c.moveTo(-size*.8,3);c.lineTo(-size*.35,-size*.85);c.lineTo(0,-size*1.4);c.lineTo(size*.7,-size*.45);c.lineTo(size*.8,3);c.closePath();c.fill();c.stroke();
     c.beginPath();c.moveTo(0,-size*1.4);c.lineTo(-size*.13,-size*.4);c.lineTo(size*.25,2);c.stroke();break;
    case 'lighthouse':case 'tributaries':
     c.fillRect(-size*.22,-size*1.2,size*.44,size*1.2);c.fillRect(-size*.45,-size*1.35,size*.9,4);
     c.fillStyle=t.accent;c.fillRect(-3,-size*1.25,6,4);break;
    default:c.beginPath();c.arc(0,0,size*.42,0,Math.PI*2);c.stroke();
   }
   c.restore();
 }
 c.restore();
}
// Variações de relevo e margem por operação, sem alterar a faixa de colisão navegável.
const TERRAIN_SIGNATURES=[
 'roots','docks','strata','lilies','reefs','floes','vines','highway','vents','ridges',
 'sandbars','cables','branches','crevasses','dunes','glow','containers','bergs','coils','fortress'
];
function terrainSignature(c,d,t){
 const sector=Math.max(1,Math.min(20,Number(d.sector)||1)),kind=TERRAIN_SIGNATURES[sector-1];
 const w=d.w,h=d.h,step=d.quality==='eco'?170:d.quality==='enhanced'?96:128,shift=(d.distance||0)*.34;
 c.save();c.lineWidth=1.8;c.strokeStyle=t.accent;c.globalAlpha=d.quality==='eco'?.24:.39;
 for(let y=-step+(shift%step);y<h+step;y+=step){
   const [left,right]=bankAt(d.riverPoints,y,w);
   for(const side of [-1,1]){
     const edge=side<0?left:right,x=edge+side*15;
     if(x<6||x>w-6)continue;
     c.beginPath();
     if(['roots','vines','branches','cables','coils','crevasses'].includes(kind)){
       c.moveTo(x,y-18);c.lineTo(x+side*7,y);c.lineTo(x+side*2,y+14);
       c.moveTo(x+side*7,y);c.lineTo(x+side*15,y-5);
     }else if(['docks','highway','containers','fortress'].includes(kind)){
       c.rect(x+(side<0?-14:0),y-13,14,26);
       c.moveTo(x,y);c.lineTo(x+side*18,y);
     }else if(['reefs','floes','sandbars','bergs','dunes','strata','ridges'].includes(kind)){
       c.moveTo(x-side*4,y+10);c.lineTo(x+side*8,y-13);c.lineTo(x+side*18,y+10);
     }else{
       c.arc(x,y,7,0,Math.PI*2);c.moveTo(x-4,y);c.lineTo(x+4,y);
     }
     c.stroke();
   }
 }
 c.restore();
}
function biomeAtmosphere(c,data,t){
 const sector=Math.max(1,Math.min(20,Number(data.sector)||1)),detail=BIOME_DETAILS[sector-1];
 const {w,h,distance=0,quality='balanced',riverPoints:points}=data;
 const count=quality==='eco'?5:quality==='enhanced'?16:10;
 const shift=distance*.27;
 c.save();
 for(let i=0;i<count;i++){
   const seed=sector*113+i*41;
   const y=((i*97+hash(seed)*h+shift)%(h+80))-40;
   const bank=bankAt(points,y,w);
   const side=i%2===0?-1:1;
   const margin=side<0?bank[0]:w-bank[1];
   if(margin<14)continue;
   const x=side<0?Math.max(8,bank[0]*(.15+.55*hash(seed+4))):w-Math.max(8,(w-bank[1])*(.15+.55*hash(seed+4)));
   const scale=.62+hash(seed+8)*.9;
   c.globalAlpha=quality==='eco'?.4:.55+hash(seed+11)*.22;
   c.save();c.translate(x,y);c.scale(scale,scale);
   c.strokeStyle=detail[1];c.fillStyle=detail[1];c.lineWidth=1.6;
   if([1,7,11,16,18].includes(sector-1)){
     c.strokeRect(-7,-6,14,12);c.beginPath();c.moveTo(-11,8);c.lineTo(11,8);c.stroke();
     if(sector===8||sector===12)c.fillRect(-3,-4,6,3);
   }else if([2,4,9,14].includes(sector-1)){
     c.beginPath();c.moveTo(-12,7);c.lineTo(0,-10);c.lineTo(12,7);c.closePath();c.stroke();
     if(sector===15){c.beginPath();c.arc(0,-3,3,0,Math.PI*2);c.fill()}
   }else if([5,13,17].includes(sector-1)){
     for(let j=-1;j<=1;j++){c.beginPath();c.moveTo(j*6,-8);c.lineTo(j*6+3,6);c.stroke();}
     c.beginPath();c.arc(0,0,8,0,Math.PI*2);c.stroke();
   }else if([8,18].includes(sector-1)){
     c.beginPath();c.moveTo(-8,7);c.lineTo(-2,-3);c.lineTo(2,3);c.lineTo(8,-8);c.stroke();
   }else{
     c.beginPath();c.moveTo(-8,7);c.lineTo(0,-10);c.lineTo(8,7);c.stroke();
     c.beginPath();c.moveTo(0,-8);c.lineTo(0,8);c.stroke();
   }
   c.restore();
 }
 c.restore();
 // Emblema de ambientação discreto que confirma visualmente o cenário carregado.
 if(quality!=='eco'){
   c.save();c.globalAlpha=.67;c.fillStyle='rgba(3,16,28,.5)';c.fillRect(8,h-87,84,13);
   c.fillStyle=detail[1];c.font='bold 8px monospace';c.textAlign='left';
   c.fillText('BIOMA '+String(sector).padStart(2,'0')+' · '+detail[2],13,h-78);c.restore();
 }
}


/* Integração visual não invasiva: usa a simulação, os 20 setores,
   as hitboxes, inimigos, armas, itens e chefes do motor oficial. */
const DETAIL_CACHE=new Map();
let detailEnabled=true;
try{
 const params=new URLSearchParams(root.location.search);
 const saved=root.localStorage?.getItem('riverstorm_visual_preview');
 detailEnabled=params.get('graphics')==='classic'?false:params.get('graphics')==='enhanced'?true:saved!=='classic';
}catch(_){}
root.RiverGraphicsPreview={
 setMode(mode){detailEnabled=mode!=='classic';try{root.localStorage?.setItem('riverstorm_visual_preview',detailEnabled?'enhanced':'classic')}catch(_){}return this.mode()},
 mode(){return detailEnabled?'enhanced':'classic'},
 cacheSize(){return DETAIL_CACHE.size}
};
function detailStamp(type,variant=0){
 const key=type+':'+variant;
 if(DETAIL_CACHE.has(key))return DETAIL_CACHE.get(key);
 const el=document.createElement('canvas');el.width=128;el.height=128;
 const g=el.getContext('2d');g.translate(64,64);
 const big=type==='BOSS',mech=type==='MECHA_SWORD'||type==='MECHA_GUN';
 const ship=type==='SHIP'||type==='SUB'||type==='PATROL';
 const accent=type==='MECHA_SWORD'?'#b67dff':type==='MECHA_GUN'?'#ffc376':big?'#ffbc7b':ship?'#89e3ff':'#8feaff';
 const path=(pts,fill,stroke)=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();g.strokeStyle=stroke||'#b9cfdf';g.lineWidth=1.5;g.stroke()};
 const metal=g.createLinearGradient(-28,-35,30,36);metal.addColorStop(0,'#d2e5ef');metal.addColorStop(.38,'#748a9b');metal.addColorStop(1,'#23384b');
 if(mech){
  for(const d of [-1,1]){g.save();g.scale(d,1);path([[7,7],[17,11],[21,31],[10,32],[5,16]],metal);path([[14,-17],[29,-14],[31,5],[18,9],[10,-1]],metal);g.restore()}
  path([[-20,-24],[0,-35],[20,-24],[25,15],[8,27],[-8,27],[-25,15]],metal);
  path([[-9,-32],[9,-32],[12,-22],[-12,-22]],'#2d4b63');
 }else if(big){
  path([[-49,-28],[0,-46],[49,-28],[55,17],[25,40],[-25,40],[-55,17]],metal);
  path([[-35,-22],[35,-22],[28,18],[0,32],[-28,18]],'#30475b');
  for(const d of [-1,1]){g.save();g.scale(d,1);path([[36,-15],[58,-10],[59,4],[38,9]],'#354e64');g.fillStyle='#dbeaf2';g.fillRect(53,-6,11,3);g.fillRect(53,0,11,3);g.restore()}
 }else if(ship){
  path([[0,-36],[19,-20],[26,22],[15,38],[-15,38],[-26,22],[-19,-20]],metal);
  path([[-11,-18],[11,-18],[12,15],[-12,15]],'#2f5c74');
 }else{
  path([[0,-36],[12,-23],[32,20],[11,12],[0,30],[-11,12],[-32,20],[-12,-23]],metal);
  path([[-8,-27],[8,-27],[9,-7],[-9,-7]],'#295b77');
 }
 g.save();g.shadowColor=accent;g.shadowBlur=12;g.fillStyle=accent;g.beginPath();g.arc(0,big?0:-14,big?7:4,0,Math.PI*2);g.fill();g.restore();
 g.strokeStyle='rgba(235,248,255,.42)';g.lineWidth=1;
 for(let i=0;i<6;i++){const y=-14+i*5;g.beginPath();g.moveTo(-10,y);g.lineTo(10,y);g.stroke()}
 DETAIL_CACHE.set(key,el);return el;
}


/* Nova Geração: sprites de detalhes cacheados por categoria para evitar
   reconstrução das formas de veículos a cada frame. Hitboxes permanecem oficiais. */
const VEHICLE_ATLAS=new Map();
function vehicleAtlas(type){
 if(VEHICLE_ATLAS.has(type))return VEHICLE_ATLAS.get(type);
 const size=128,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
 const c=canvas.getContext('2d');c.translate(64,64);
 const grad=c.createLinearGradient(-40,-45,38,46);
 grad.addColorStop(0,'#f1f8fb');grad.addColorStop(.2,'#a3bfcb');grad.addColorStop(.56,'#516b7e');grad.addColorStop(1,'#132c3e');
 function panel(pts,fill=grad){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle='#c2d4dc';c.lineWidth=1.7;c.stroke()}
 if(type==='TANK'){
  for(const sign of [-1,1]){c.fillStyle='#17232d';c.fillRect(sign*29-8,-34,14,69);for(let y=-30;y<33;y+=9){c.fillStyle='#889eaa';c.fillRect(sign*29-7,y,12,3)}}
  panel([[-30,-37],[30,-37],[32,35],[-32,35]]);
  panel([[-21,-21],[21,-21],[22,23],[-22,23]],'#415969');
  c.fillStyle='#bed6df';c.fillRect(-5,-55,10,46);panel([[-17,-15],[17,-15],[20,11],[0,24],[-20,11]],'#506b7e');
  c.fillStyle='#172d3a';c.beginPath();c.arc(0,0,8,0,7);c.fill();
 }else if(type==='SUB'){
  panel([[0,-53],[22,-34],[28,23],[15,49],[-15,49],[-28,23],[-22,-34]]);
  panel([[-14,-18],[14,-18],[14,20],[-14,20]],'#2b556c');
  c.fillStyle='#d1edf1';c.fillRect(-5,-30,10,25);
  c.strokeStyle='#baf3ff';c.lineWidth=4;c.beginPath();c.moveTo(0,-27);c.lineTo(0,-44);c.lineTo(10,-44);c.stroke();
  panel([[-43,27],[-24,19],[-18,34],[-43,42]],'#416a77');panel([[43,27],[24,19],[18,34],[43,42]],'#416a77');
 }else if(type==='HELI'){
  panel([[0,-46],[18,-29],[22,19],[9,37],[4,38],[4,53],[-4,53],[-4,38],[-9,37],[-22,19],[-18,-29]]);
  panel([[-14,-33],[14,-33],[12,8],[-12,8]],'#224862');c.fillStyle='#a6e5f4';c.beginPath();c.ellipse(-3,-18,7,12,-.3,0,7);c.fill();
  for(const side of [-1,1])panel([[side*19,-2],[side*32,0],[side*29,31],[side*18,24]],'#496979');
 }else if(type==='SHIP'){
  panel([[0,-55],[24,-34],[31,25],[16,48],[-16,48],[-31,25],[-24,-34]]);
  panel([[-20,-32],[20,-32],[18,29],[-18,29]],'#4b7184');
  panel([[-12,-20],[12,-20],[13,12],[-13,12]],'#1b4961');
  c.fillStyle='#bce9f5';c.fillRect(-9,-16,18,7);
  c.fillStyle='#203849';c.fillRect(-6,-47,12,20);
 }else if(type==='JET'||type==='ZIGZAG'){
  panel([[0,-54],[15,-26],[49,23],[23,18],[13,38],[0,25],[-13,38],[-23,18],[-49,23],[-15,-26]]);
  panel([[-11,-31],[0,-43],[11,-31],[9,4],[-9,4]],'#245578');
  c.fillStyle='#a4ebff';c.beginPath();c.ellipse(0,-20,6,11,0,0,7);c.fill();
 }else if(type==='TURRET'){
  // Base hexagonal estacionária, anel de rotação, arma dupla, ótica e rebites.
  panel([[0,-39],[32,-21],[37,16],[19,36],[-19,36],[-37,16],[-32,-21]],'#273b47');
  panel([[0,-32],[27,-17],[31,16],[15,28],[-15,28],[-31,16],[-27,-17]],grad);
  c.strokeStyle='#152a35';c.lineWidth=6;c.beginPath();c.arc(0,0,22,0,Math.PI*2);c.stroke();
  c.strokeStyle='#b8d1d8';c.lineWidth=2;c.beginPath();c.arc(0,0,18,0,Math.PI*2);c.stroke();
  // Canhões gémeos sobre a base circular; não são uma ponta triangular.
  for(const d of [-1,1]){
   panel([[d*6,-12],[d*14,-12],[d*14,-54],[d*6,-54]],'#647e8d');
   c.fillStyle='#13242f';c.fillRect(d*8-2,-55,6,5);
   c.fillStyle='#b7d1d8';c.beginPath();c.arc(d*22,21,2.5,0,Math.PI*2);c.fill();
  }
  panel([[-17,-16],[17,-16],[21,10],[12,20],[-12,20],[-21,10]],'#435d6e');
  c.fillStyle='#83ddec';c.fillRect(-9,-8,18,6);
  c.fillStyle='#203a49';c.beginPath();c.arc(0,8,7,0,Math.PI*2);c.fill();
 }
 VEHICLE_ATLAS.set(type,canvas);return canvas;
}
function drawAtlasVehicle(c,e){
 if(!detailEnabled)return;
 const type=e.type;
 if(!['TANK','TURRET','SUB','HELI','JET','ZIGZAG','SHIP'].includes(type))return;
 const w=type==='SUB'?47:type==='TANK'?39:type==='HELI'?39:type==='SHIP'?43:type==='TURRET'?46:38;
 const h=type==='SUB'?59:type==='TANK'?42:type==='HELI'?43:type==='SHIP'?54:type==='TURRET'?47:42;
 const time=Date.now()*.001;
 const moving=['JET','HELI','ZIGZAG','SHIP','SUB'].includes(type);
 const bank=Math.max(-.14,Math.min(.14,(Number(e.vx)||0)*.035));
 const hover=moving?Math.sin(time*(type==='HELI'?6:3)+e.x*.03)*(type==='HELI'?1.5:.65):0;
 c.save();c.translate(e.x,e.y+hover);c.rotate(bank);
 // Silhueta e sombra acompanham a unidade, sem modificar colisões ou posições de jogo.
 c.fillStyle='rgba(0,12,25,.30)';
 c.beginPath();c.ellipse(3,5,w*.45,h*.38,0,0,Math.PI*2);c.fill();
 c.globalAlpha=.96;c.drawImage(vehicleAtlas(type),-w/2,-h/2,w,h);
 if(type==='HELI'){
   const a=time*25,spread=20+Math.sin(time*34)*2;
   c.strokeStyle='rgba(210,245,255,.72)';c.lineWidth=2;
   c.beginPath();c.moveTo(-spread*Math.cos(a),-8-spread*.28*Math.sin(a));c.lineTo(spread*Math.cos(a),-8+spread*.28*Math.sin(a));c.stroke();
   c.strokeStyle='rgba(179,232,255,.22)';c.beginPath();c.ellipse(0,-8,spread,8,0,0,Math.PI*2);c.stroke();
 }
 if(type==='SUB'||type==='SHIP'){
   c.strokeStyle='rgba(173,240,255,.50)';c.lineWidth=1.5;
   const wake=3+2*Math.sin(time*4+e.x);
   for(const dir of [-1,1]){
     c.beginPath();c.moveTo(dir*(w*.39),h*.18);c.quadraticCurveTo(dir*(w*.56+wake),h*.35,dir*(w*.65),h*.57);c.stroke();
   }
 }
 if(type==='TURRET'){
   // Luz de carregamento no canhão (efeito visual apenas, sem alterar cadência dos disparos).
   const intensity=.22+.45*(.5+.5*Math.sin(time*5+e.x));
   c.fillStyle='rgba(255,195,100,'+intensity.toFixed(3)+')';
   c.beginPath();c.arc(0,-h*.40,2.3,0,Math.PI*2);c.fill();
 }
 if(type==='JET'||type==='ZIGZAG'){
   const flicker=4+3*(.5+.5*Math.sin(time*21+e.x));
   c.fillStyle='rgba(112,225,255,.75)';
   c.beginPath();c.moveTo(-3,h*.35);c.lineTo(0,h*.35+flicker);c.lineTo(3,h*.35);c.fill();
 }
 c.restore();
}

function distinctiveUnit(c,e){
 if(!detailEnabled)return;
 const type=e.type;
 if(!['TANK','TURRET','SUB','HELI','JET','ZIGZAG','SHIP'].includes(type))return;
 c.save();c.translate(e.x,e.y);
 const plate=(pts,col,outline='#a2c2cc')=>{c.fillStyle=col;c.strokeStyle=outline;c.lineWidth=1.4;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fill();c.stroke()};
 const armor=c.createLinearGradient(-17,-20,20,24);armor.addColorStop(0,'#bdd4dd');armor.addColorStop(.35,'#647f90');armor.addColorStop(1,'#1c3448');
 if(type==='TANK'){
  // Lagartas, torre giratória, canhão e escotilhas; topo visto de cima.
  for(const d of [-1,1]){c.fillStyle='#182431';c.fillRect(d*13-4,-16,8,35);c.fillStyle='#7c8c8f';for(let y=-13;y<19;y+=6)c.fillRect(d*13-3,y,6,2)}
  plate([[-13,-19],[13,-19],[16,17],[-16,17]],armor);
  plate([[-10,-10],[10,-10],[12,8],[-12,8]],'#465e6a');
  c.save();c.rotate(Math.atan2((e.vy||0),(e.vx||0))*.12);
  c.fillStyle='#b1c3c9';c.fillRect(-3,-29,6,24);
  plate([[-10,-12],[10,-12],[12,4],[0,11],[-12,4]],'#506c76');
  c.restore();
  c.fillStyle='#172b36';c.beginPath();c.arc(0,-3,4,0,7);c.fill();
 }else if(type==='TURRET'){
  plate([[-13,-12],[13,-12],[16,12],[-16,12]],'#53697a');
  c.fillStyle='#172d3d';c.beginPath();c.arc(0,0,10,0,7);c.fill();
  c.fillStyle='#bad3da';c.fillRect(-3,-22,6,24);
  c.fillStyle='#7897a6';c.beginPath();c.arc(0,0,6,0,7);c.fill();
 }else if(type==='SUB'){
  // Submarino com casco fusiforme, torre de comando, periscópio e esteira.
  c.strokeStyle='rgba(165,234,243,.48)';c.lineWidth=2;c.beginPath();c.ellipse(2,9,21,31,0,0,7);c.stroke();
  plate([[0,-27],[13,-12],[16,15],[8,27],[-8,27],[-16,15],[-13,-12]],armor);
  plate([[-8,-10],[8,-10],[10,10],[-10,10]],'#3b6476');
  c.fillStyle='#c4edf2';c.fillRect(-3,-17,6,18);
  c.strokeStyle='#c4edf2';c.beginPath();c.moveTo(0,-20);c.lineTo(0,-29);c.lineTo(6,-29);c.stroke();
  plate([[-25,13],[-12,8],[-10,16],[-25,21]],'#3e6574');
  plate([[25,13],[12,8],[10,16],[25,21]],'#3e6574');
 }else if(type==='SHIP'){
  c.strokeStyle='rgba(175,232,245,.55)';c.beginPath();c.moveTo(-19,26);c.lineTo(-12,37);c.moveTo(19,26);c.lineTo(12,37);c.stroke();
  plate([[0,-30],[15,-18],[20,18],[10,29],[-10,29],[-20,18],[-15,-18]],armor);
  plate([[-11,-13],[11,-13],[12,12],[-12,12]],'#2d536a');
  c.fillStyle='#a9d9e5';c.fillRect(-8,-10,16,6);
  c.fillStyle='#152b3d';c.fillRect(-4,-27,8,13);
 }else if(type==='HELI'){
  plate([[0,-28],[11,-17],[14,11],[6,24],[3,24],[3,35],[-3,35],[-3,24],[-6,24],[-14,11],[-11,-17]],armor);
  plate([[-8,-16],[8,-16],[7,3],[-7,3]],'#234c66');
  c.fillStyle='#a8edfa';c.beginPath();c.ellipse(-2,-9,5,8,0,0,7);c.fill();
  const a=(Date.now()/58)%Math.PI,cx=Math.cos(a)*21,cy=Math.sin(a)*9;
  c.strokeStyle='rgba(206,247,255,.85)';c.lineWidth=2;c.beginPath();c.moveTo(-cx,-cy);c.lineTo(cx,cy);c.stroke();
 }else{
  plate([[0,-31],[12,-13],[28,20],[9,11],[0,27],[-9,11],[-28,20],[-12,-13]],armor);
  plate([[-8,-15],[8,-15],[8,5],[-8,5]],'#27587a');
  c.fillStyle='#c2e9fa';c.beginPath();c.ellipse(0,-9,5,7,0,0,7);c.fill();
 }
 c.restore();
}

function highDetailEnemy(c,e,time){
 const type=e.type||'JET';
 if(!detailEnabled||type==='BIOME_ENEMY'||type==='TANK'||type==='TURRET')return;
 if(!['MECHA_SWORD','MECHA_GUN','HELI','JET','SHIP','SUB','ZIGZAG','BOSS'].includes(type))return;
 const w=type==='BOSS'?Math.max(110,Math.min(185,(e.width||140))):type.startsWith('MECHA')?37:type==='SUB'?31:type==='SHIP'?34:29;
 const h=type==='BOSS'?Math.max(75,Math.min(112,(e.height||70)*1.25)):type.startsWith('MECHA')?46:type==='SUB'?40:type==='SHIP'?42:33;
 c.save();c.globalAlpha=type==='BOSS'?.88:.76;
 c.drawImage(detailStamp(type),e.x-w/2,e.y-h/2,w,h);
 if(type==='HELI'){const a=(Date.now()/36)%(Math.PI*2);c.strokeStyle='rgba(204,248,255,.75)';c.lineWidth=2;c.beginPath();c.moveTo(e.x-Math.cos(a)*20,e.y-Math.sin(a)*9);c.lineTo(e.x+Math.cos(a)*20,e.y+Math.sin(a)*9);c.stroke()}
 if(type==='MECHA_SWORD'&&(e.slashWarn>0||e.slashArc>0)){c.strokeStyle='#defaff';c.lineWidth=3;c.shadowColor='#93eaff';c.shadowBlur=12;c.beginPath();c.arc(e.x+15,e.y-2,24,-1.2,.6);c.stroke()}
 c.restore();
}
function highDetailPlane(c,x,y,style){
 if(!detailEnabled)return;const scale=style==='titan'?1.08:.9,w=48*scale,h=59*scale;
 c.save();c.globalAlpha=.8;c.drawImage(detailStamp('PLAYER'),x-w/2,y-h/2,w,h);
 c.strokeStyle='rgba(170,242,255,.68)';c.lineWidth=1;
 c.beginPath();c.moveTo(x,y-h*.44);c.lineTo(x,y+h*.28);c.stroke();c.restore();
}


/* RiverStorm Graphic Pass 2: água volumétrica, luz reativa, clima e jatos.
   A simulação original permanece como fonte única de colisões e estados. */
function enhancedWorld(c,d,t){
 if(!detailEnabled)return;
 const {w,h,riverPoints:points,distance=0}=d,now=Date.now()*.001,sector=Number(d.sector)||1;
 c.save();
 // Reflexos adicionais seguem a geometria real do rio (não desenham sobre terra).
 if(riverPath(c,points)){
  c.clip();c.globalCompositeOperation='screen';
  const rays=sector%4===2?24:17;
  for(let i=0;i<rays;i++){
   const y=((i*79+distance*.48)%(h+100))-50;
   const banks=bankAt(points,y,w),span=banks[1]-banks[0];
   if(span<35)continue;
   const x=banks[0]+span*(.12+.76*hash(i*27+sector*31));
   const length=8+23*hash(i*53+sector),alpha=.11+.16*(.5+.5*Math.sin(now*2+i));
   c.strokeStyle='rgba(185,246,255,'+alpha.toFixed(3)+')';
   c.lineWidth=i%3===0?2.5:1;c.beginPath();c.moveTo(x-length*.5,y);c.quadraticCurveTo(x,y-2,x+length*.5,y);c.stroke();
  }
  c.globalCompositeOperation='source-over';
  // Espuma das margens, seguindo as margens reais, animação sem novos objetos.
  for(let y=8;y<h;y+=32){
    const banks=bankAt(points,y,w);
    for(let side=0;side<2;side++){
      const x=banks[side]+(side===0?5:-5),pulse=.23+.12*Math.sin(now*2+y*.025);
      c.strokeStyle='rgba(215,252,249,'+pulse.toFixed(3)+')';
      c.lineWidth=2;c.beginPath();c.moveTo(x-3,y-8);c.quadraticCurveTo(x+4,y,x-2,y+8);c.stroke();
    }
  }
 }
 c.restore();
 // Clima por setor: névoa úmida, chuva, poeira e neve com intensidade conservadora.
 const climate=(sector-1)%5;
 c.save();
 if(climate===1||climate===3){
  c.strokeStyle=climate===1?'rgba(156,211,244,.27)':'rgba(251,194,131,.16)';
  c.lineWidth=1;
  for(let i=0;i<46;i++){
    const x=(hash(i*57+sector*13)*w+now*(climate===1?-75:35))%w;
    const y=(hash(i*91+sector*23)*h+now*(climate===1?420:100))%h;
    c.beginPath();c.moveTo(x,y);c.lineTo(x+(climate===1?-8:4),y+(climate===1?18:6));c.stroke();
  }
 }else if(climate===4){
  c.fillStyle='rgba(223,245,255,.44)';
  for(let i=0;i<31;i++){const x=(hash(i*83+sector)*w+now*19)%w,y=(hash(i*19+sector)*h+now*43)%h;c.beginPath();c.arc(x,y,1.1+i%3*.35,0,7);c.fill()}
 }
 const fog=c.createLinearGradient(0,0,0,h);fog.addColorStop(0,'rgba(103,167,197,.10)');fog.addColorStop(.42,'rgba(103,167,197,0)');fog.addColorStop(1,'rgba(9,29,50,.13)');
 c.fillStyle=fog;c.fillRect(0,0,w,h);c.restore();
}
function enhancedBattleLight(c,d){
 if(!detailEnabled)return;
 const enemies=d.enemies||[],time=Date.now()*.001;
 c.save();c.globalCompositeOperation='screen';
 for(const e of enemies){
   if(e.hp<=0||e.y<0||e.y>d.h)continue;
   const boss=e.type==='BOSS',mech=e.type==='MECHA_SWORD'||e.type==='MECHA_GUN';
   if(!boss&&!mech&&e.type!=='HELI')continue;
   const radius=boss?76:mech?36:29,glow=c.createRadialGradient(e.x,e.y,1,e.x,e.y,radius);
   const tint=boss?'255,117,71':e.type==='MECHA_SWORD'?'184,91,255':'70,208,255';
   glow.addColorStop(0,'rgba('+tint+','+(boss?.20:.13)+')');glow.addColorStop(1,'rgba('+tint+',0)');
   c.fillStyle=glow;c.beginPath();c.arc(e.x,e.y,radius,0,7);c.fill();
 }
 const p=d.player;if(p){
   const thruster=24+7*Math.sin(time*22),v=c.createRadialGradient(p.x,p.y+25,2,p.x,p.y+27,thruster);
   v.addColorStop(0,'rgba(125,233,255,.40)');v.addColorStop(1,'rgba(125,233,255,0)');
   c.fillStyle=v;c.beginPath();c.arc(p.x,p.y+27,thruster,0,7);c.fill();
   c.strokeStyle='rgba(100,231,255,.68)';c.lineWidth=3;c.beginPath();c.moveTo(p.x-11,p.y+22);c.lineTo(p.x-11,p.y+34+Math.sin(time*25)*5);c.moveTo(p.x+11,p.y+22);c.lineTo(p.x+11,p.y+34+Math.cos(time*23)*5);c.stroke();
 }
 c.restore();
}


function enhancedWeaponGlints(c,d){
 if(!detailEnabled)return;
 const time=Date.now()*.001,units=d.enemies||[];
 c.save();
 // Micro-animações de energia por tipo, ancoradas nos inimigos da simulação.
 for(const e of units){
  if(e.hp<=0||e.y<-25||e.y>d.h+25)continue;
  const mech=e.type==='MECHA_SWORD',gun=e.type==='MECHA_GUN',boss=e.type==='BOSS';
  if(!mech&&!gun&&!boss)continue;
  const x=e.x+(mech?15:boss?30:12),y=e.y-7;
  c.save();c.translate(x,y);
  const pulse=.50+.50*Math.sin(time*(boss?5:9)+e.x*.06);
  c.globalAlpha=.28+pulse*.53;
  c.strokeStyle=mech?'#b9c0ff':gun?'#ffc58b':'#ff8b6b';
  c.shadowColor=c.strokeStyle;c.shadowBlur=boss?16:9;c.lineWidth=boss?3:2;
  c.beginPath();c.moveTo(-3,-8);c.lineTo(2+pulse*4,0);c.lineTo(-2,8);c.stroke();
  c.restore();
 }
 c.restore();
}


/* Atlases de identidades por bioma: aparência e animação independentes das regras de IA. */
const BIOME_ATLAS=new Map();
function biomeSprite(id){
 if(BIOME_ATLAS.has(id))return BIOME_ATLAS.get(id);
 const cv=document.createElement('canvas');cv.width=120;cv.height=120;
 const p=cv.getContext('2d');p.translate(60,60);
 const palette={TUCANO:['#13c7d6','#173e59'],CRANE:['#e5ac47','#536a70'],SCORPION:['#e9a25f','#54341f'],ALLIGATOR:['#63a776','#244f37'],CORSAIR:['#ff6e69','#552733'],WALRUS:['#d7efff','#668ba1'],MANTIS:['#a1e45b','#435d37'],MOTOJET:['#ff74da','#572b66'],SALAMANDER:['#ff995b','#753c28'],EAGLE:['#f7d765','#525d66'],DREDGER:['#edc069','#52565b'],HOVERCAR:['#c58cff','#483f7d'],PIRANHA:['#7dde89','#2d655d'],ICE_RAY:['#dcf5ff','#608dab'],BEETLE:['#edb05e','#765036'],PRISM_WASP:['#df9aff','#6a4291'],WELDER:['#ffc06c','#7c4d3c'],NARWHAL:['#8de6ff','#2b6479'],EEL:['#79c5ff','#285a91'],HYBRID_HUNTER:['#ff9299','#69364b']};
 const [light,dark]=palette[id]||['#bcd9e5','#4d6676'],insect=/MANTIS|WASP|BEETLE|SCORPION/.test(id),aquatic=/WALRUS|PIRANHA|ICE_RAY|NARWHAL|EEL|ALLIGATOR/.test(id),machine=/CRANE|DREDGER|WELDER|HOVERCAR/.test(id);
 const fill=p.createLinearGradient(-25,-38,27,41);fill.addColorStop(0,light);fill.addColorStop(.4,'#8c9ca7');fill.addColorStop(1,dark);
 const poly=(points,color=fill)=>{p.beginPath();points.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();p.fillStyle=color;p.fill();p.lineWidth=2;p.strokeStyle='#d1e2e9';p.stroke()};
 p.fillStyle='rgba(4,16,30,.35)';p.beginPath();p.ellipse(4,13,34,17,0,0,7);p.fill();
 if(insect){
  for(const side of [-1,1]){p.save();p.scale(side,1);poly([[8,-20],[25,-27],[37,-8],[14,-4]],dark);poly([[10,10],[28,12],[36,31],[24,21],[6,16]],dark);
   p.strokeStyle=light;p.lineWidth=3;p.beginPath();p.moveTo(17,7);p.lineTo(43,21);p.moveTo(18,-3);p.lineTo(43,-16);p.stroke();p.restore()}
  poly([[0,-41],[20,-26],[24,20],[0,39],[-24,20],[-20,-26]]);
  p.fillStyle=dark;p.beginPath();p.ellipse(0,-13,11,14,0,0,7);p.fill();
 }else if(aquatic){
  poly([[0,-45],[18,-26],[29,7],[15,31],[0,47],[-15,31],[-29,7],[-18,-26]]);
  for(const side of [-1,1]){p.save();p.scale(side,1);poly([[14,2],[43,18],[23,27],[11,18]],dark);p.restore()}
  p.strokeStyle=light;p.lineWidth=2;p.beginPath();p.moveTo(0,-32);p.lineTo(0,30);p.stroke();
 }else if(machine){
  poly([[-27,-29],[27,-29],[33,24],[19,35],[-19,35],[-33,24]]);
  poly([[-16,-19],[16,-19],[20,17],[-20,17]],dark);
  for(const side of [-1,1]){p.save();p.scale(side,1);poly([[19,-19],[35,-17],[37,17],[22,19]],dark);p.restore()}
  p.fillStyle=light;p.fillRect(-5,-29,10,9);
 }else{
  poly([[0,-42],[13,-25],[46,21],[18,14],[8,35],[0,21],[-8,35],[-18,14],[-46,21],[-13,-25]]);
  poly([[-10,-22],[10,-22],[12,11],[-12,11]],dark);
 }
 p.save();p.shadowColor=light;p.shadowBlur=14;p.fillStyle=light;p.beginPath();p.arc(0,-13,5,0,7);p.fill();p.restore();
 BIOME_ATLAS.set(id,cv);return cv;
}
// Assinaturas específicas: cada bioma utiliza uma silhueta identificável sobre seu atlas.
function biomeIdentity(c,id){
 c.save();c.lineWidth=3;c.lineCap='round';c.lineJoin='round';
 const oval=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
 const path=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
 const limb=(pts,col='#263e43',w=4)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()};
 const water='#8acbde',leaf='#426f48',metal='#516b80';
 switch(id){
 case 'ALLIGATOR':
  path([[-8,26],[-5,11],[-15,0],[-16,-25],[-9,-39],[9,-39],[16,-25],[15,0],[5,11],[8,26],[0,43]],'#3d774d');
  oval(0,-19,17,21,'#60965b');oval(0,-32,15,14,'#87a86c');
  for(const side of [-1,1]){limb([[side*11,-11],[side*25,-6],[side*29,3]],leaf,6);limb([[side*12,14],[side*26,19],[side*28,26]],leaf,6);oval(side*9,-36,3,3,'#f9dd83')}
  path([[-12,-41],[12,-41],[9,-24],[-9,-24]],'#4d8a62');limb([[-9,-29],[9,-29]],'#203d33',2);break;
 case 'SCORPION':
  for(const side of [-1,1]){for(let k=0;k<3;k++)limb([[side*10,k*10],[side*26,k*11-9],[side*33,k*11]],'#b87948',4);limb([[side*12,-22],[side*31,-31],[side*37,-21]],'#bf8852',5);oval(side*38,-20,8,7,'#d7a160')}
  oval(0,0,14,25,'#a56839');for(let k=0;k<5;k++)oval(0,-18+k*9,11,3,'#edb878');limb([[0,23],[4,36],[0,46],[-6,39]],'#a15c35',7);break;
 case 'PIRANHA':
  path([[0,-39],[21,-18],[24,11],[0,35],[-22,11],[-19,-19]],'#4c936d');path([[0,-39],[13,-20],[0,-12]],'#a2db9a');path([[-23,1],[-37,13],[-16,20]],'#356d73');path([[20,6],[33,19],[12,20]],'#356d73');
  oval(-10,-21,4,4,'#ffec9d');path([[0,-34],[13,-25],[0,-19],[12,-13],[0,-9]],'#effaff');break;
 case 'EEL':
  limb([[0,-46],[15,-30],[-14,-12],[15,9],[-14,27],[0,44]],'#2c75b8',17);limb([[0,-46],[15,-30],[-14,-12],[15,9],[-14,27],[0,44]],'#8ce5fe',6);oval(0,-43,11,9,'#27739f');break;
 case 'NARWHAL':
  oval(0,5,22,39,'#6dc6e5');path([[-8,-27],[0,-57],[8,-27]],'#fff9dc');for(const side of [-1,1])path([[side*17,-2],[side*37,10],[side*14,20]],'#4f9bb9');oval(-8,-18,3,3,'#183348');oval(8,-18,3,3,'#183348');break;
 case 'ICE_RAY':
  path([[0,-27],[-43,4],[-29,24],[0,12],[29,24],[43,4]],'#ade5f5');limb([[0,12],[0,45]],'#bfefff',7);oval(0,-16,10,10,'#e6ffff');break;
 case 'TUCANO':case 'EAGLE':
  path([[-7,-15],[-43,6],[-30,22],[-6,10],[6,10],[30,22],[43,6],[7,-15]],id==='TUCANO'?'#05b7bd':'#c6a154');oval(0,-10,12,22,id==='TUCANO'?'#103958':'#f1ce78');path([[-6,-28],[4,-38],[17,-27],[5,-20]],id==='TUCANO'?'#ffd14d':'#eef4f6');break;
 case 'MANTIS':case 'PRISM_WASP':case 'BEETLE':
  for(const side of [-1,1]){for(let k=0;k<3;k++)limb([[side*12,k*13-12],[side*25,k*16-15],[side*36,k*14-10]],metal,3)}
  oval(0,4,16,28,id==='PRISM_WASP'?'#ac78d7':id==='MANTIS'?'#83b448':'#ba823e');oval(0,-25,13,12,'#d3ebc0');
  if(id==='PRISM_WASP'){for(const side of [-1,1])oval(side*19,-5,13,22,'#a2e7fc88')}break;
 case 'SALAMANDER':
  limb([[0,-43],[7,-24],[-6,0],[8,24],[0,43]],'#bc502b',16);for(const side of [-1,1]){limb([[side*8,-19],[side*23,-12]],'#ea9b48',5);limb([[side*8,17],[side*23,24]],'#ea9b48',5)}oval(0,-38,13,10,'#ffbd69');break;
 case 'WALRUS':
  oval(0,4,30,35,'#899eae');oval(0,-20,23,22,'#c6d7dc');for(const side of [-1,1]){path([[side*13,-16],[side*24,-4],[side*18,25]],'#fff1d1');oval(side*16,-27,3,3,'#223949')}break;
 case 'CRANE':case 'DREDGER':case 'WELDER':
  path([[-27,-28],[27,-28],[30,24],[-30,24]],'#566575');path([[-19,-15],[19,-15],[16,12],[-16,12]],'#c69a52');
  limb([[0,-15],[27,-42],[38,-36]],'#e6b954',6);oval(0,1,10,10,'#a7e6ed');break;
 case 'HOVERCAR':case 'MOTOJET':case 'CORSAIR':
  path([[-25,-27],[25,-27],[33,22],[0,34],[-33,22]],id==='CORSAIR'?'#ac4850':'#6864a9');oval(0,-10,13,17,'#b9edff');
  for(const side of [-1,1])oval(side*25,17,6,12,'#4ff0e0');break;
 default:
  path([[-35,-9],[-12,-21],[0,-38],[12,-21],[35,-9],[15,24],[-15,24]],'#9b6474');oval(0,-14,13,14,'#76dded');break;
 }
 c.restore();
}
// Acabamento específico de unidades: texturas e marcações variam por identidade.
function biomeMicroDetail(c,id,age){
 c.save();c.strokeStyle='#e9f9ff';c.lineWidth=1.8;c.lineCap='round';
 const dot=(x,y,color,r=2)=>{c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
 const stripe=(a,b)=>{c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke()};
 switch(id){
 case 'ALLIGATOR':for(let i=0;i<7;i++){dot(-8+(i%2)*16,-23+i*7,'#bed38e',2.4)}stripe([-11,-35],[11,-35]);break;
 case 'SCORPION':for(let i=0;i<5;i++)stripe([-9,-18+i*9],[9,-18+i*9]);dot(11,-35,'#ffda87',4);break;
 case 'PIRANHA':for(let i=0;i<5;i++)dot(-12+i*5,-32+i*2,'#f6ffff',2);stripe([-16,7],[13,7]);break;
 case 'EEL':for(let i=0;i<6;i++)dot(Math.sin(i*1.7+age*.02)*8,-32+i*13,'#c3f9ff',3);break;
 case 'NARWHAL':for(let i=0;i<5;i++)stripe([-4+i*2,-52+i*5],[5+i*2,-52+i*5]);break;
 case 'ICE_RAY':for(let i=0;i<4;i++){stripe([-32+i*9,6],[-9+i*5,17]);stripe([32-i*9,6],[9-i*5,17])}break;
 case 'TUCANO':stripe([-6,-32],[20,-28]);dot(3,-31,'#fff3a0',3);break;
 case 'EAGLE':for(let i=0;i<4;i++){stripe([-32+i*4,9],[-22+i*4,19]);stripe([32-i*4,9],[22-i*4,19])}break;
 case 'MANTIS':stripe([-11,-28],[-20,-39]);stripe([11,-28],[20,-39]);break;
 case 'PRISM_WASP':for(let i=0;i<4;i++)stripe([-9,-12+i*10],[9,-12+i*10]);dot(0,-37,'#f5beff',5);break;
 case 'BEETLE':stripe([0,-28],[0,28]);for(let i=0;i<4;i++)dot(i%2?-10:10,-17+i*11,'#ffe7a1');break;
 case 'SALAMANDER':for(let i=0;i<8;i++)dot(i%2?-7:7,-30+i*9,'#ffda81',2.6);break;
 case 'WALRUS':stripe([-8,-11],[-14,18]);stripe([8,-11],[14,18]);break;
 case 'CRANE':for(let i=0;i<4;i++)stripe([-19+i*9,-17],[-11+i*9,-7]);break;
 case 'DREDGER':for(let i=0;i<5;i++)dot(-17+i*8,20,'#e6b954');break;
 case 'WELDER':dot(25,-24,'#ffea87',4);for(let i=0;i<4;i++)dot(25+Math.sin(age*.1+i)*7,-27+i*6,'#ffb852',1.8);break;
 case 'HOVERCAR':stripe([-12,-22],[12,-22]);dot(-21,19,'#71f3ff',4);dot(21,19,'#71f3ff',4);break;
 case 'MOTOJET':stripe([0,-36],[0,17]);dot(0,24,'#ff89ee',5);break;
 case 'CORSAIR':for(let i=0;i<3;i++)stripe([-20+i*20,-16],[-18+i*18,10]);break;
 case 'HYBRID_HUNTER':for(let i=0;i<4;i++)dot(i%2?-13:13,-22+i*14,i%2?'#fca3c4':'#7ff9fe',3);break;
 }
 c.restore();
}
// Atlas individual por identidade: cache offscreen e nenhum custo de reconstrução por frame.
const BIOME_FINAL_ATLAS=new Map();
function finalBiomeStamp(id){
 if(BIOME_FINAL_ATLAS.has(id))return BIOME_FINAL_ATLAS.get(id);
 const cv=document.createElement('canvas');cv.width=160;cv.height=160;
 const g=cv.getContext('2d');g.translate(80,80);g.scale(1.28,1.28);
 biomeIdentity(g,id);biomeMicroDetail(g,id,0);
 BIOME_FINAL_ATLAS.set(id,cv);return cv;
}
function drawBiomeOverlay(c,e){
 if(!detailEnabled||e.type!=='BIOME_ENEMY')return;
 const sprite=biomeSprite(e.biomeId||'HYBRID_HUNTER'),bob=Math.sin(Date.now()*.005+(e.biomeAge||0)*.02)*1.5;
 c.save();c.globalAlpha=.98;c.drawImage(finalBiomeStamp(e.biomeId||'HYBRID_HUNTER'),e.x-27,e.y-27+bob,54,54);c.translate(e.x,e.y+bob);c.scale(.48,.48);
 const tick=Date.now()*.005,flap=Math.sin(tick*2+(e.biomeAge||0)*.035),id=e.biomeId||'HYBRID_HUNTER';
 c.lineCap='round';c.lineJoin='round';c.lineWidth=3;
 if(id==='ALLIGATOR'){c.fillStyle='#b4cc78';for(let k=0;k<7;k++){c.beginPath();c.ellipse(0,-21+k*8,6,2,0,0,7);c.fill()}c.strokeStyle='#b1dca1';c.beginPath();c.moveTo(-12,-36);c.lineTo(-10,-40);c.moveTo(12,-36);c.lineTo(10,-40);c.stroke()}
 else if(id==='SCORPION'){c.strokeStyle='#f5c177';c.lineWidth=5;c.beginPath();c.moveTo(1,29);c.quadraticCurveTo(22+flap*4,44,12,-36);c.stroke();c.fillStyle='#321d1a';c.beginPath();c.arc(12,-36,5,0,7);c.fill()}
 else if(id==='PIRANHA'||id==='EEL'){c.strokeStyle='#cffdff';c.beginPath();c.moveTo(-14,21);c.quadraticCurveTo(12*flap,32,16,42);c.stroke();c.fillStyle='#f8f9dd';c.beginPath();c.arc(-8,-26,3,0,7);c.fill()}
 else if(id==='TUCANO'||id==='EAGLE'){c.save();c.rotate(flap*.09);c.strokeStyle=id==='TUCANO'?'#48e6cc':'#ffe8a6';for(const side of [-1,1]){c.beginPath();c.moveTo(side*13,-8);c.quadraticCurveTo(side*35,flap*9,side*46,12);c.stroke()}c.restore()}
 else if(id==='ICE_RAY'||id==='NARWHAL'||id==='WALRUS'){c.fillStyle='rgba(220,252,255,.8)';for(let k=0;k<4;k++){c.beginPath();c.arc(Math.sin(tick+k)*32,Math.cos(tick+k*2)*25,2+k%2,0,7);c.fill()}}
 else if(id==='MANTIS'||id==='BEETLE'||id==='PRISM_WASP'){c.strokeStyle='#daffbd';for(const side of [-1,1]){c.beginPath();c.moveTo(side*16,-9);c.lineTo(side*(27+flap*4),-28);c.lineTo(side*37,-14);c.stroke()}}
 else if(id==='SALAMANDER'){c.fillStyle='#ffdf7e';for(let k=0;k<5;k++){c.beginPath();c.arc(Math.sin(tick+k)*15,29+k*4,2.5,0,7);c.fill()}}
 else if(['HOVERCAR','MOTOJET','CORSAIR','CRANE','DREDGER','WELDER','HYBRID_HUNTER'].includes(id)){c.fillStyle='#72f6ff';for(const side of [-1,1]){c.beginPath();c.arc(side*24,20,3+Math.abs(flap)*2,0,7);c.fill()}c.strokeStyle='#e6f7ff';c.beginPath();c.moveTo(-9,-17);c.lineTo(9,-17);c.stroke()}
 c.restore();
}
function mechArticulation(c,e){
 if(!detailEnabled||!['MECHA_SWORD','MECHA_GUN'].includes(e.type))return;
 const pulse=Math.sin(Date.now()*.009+(e.motion||0)),sword=e.type==='MECHA_SWORD';
 c.save();c.translate(e.x,e.y);c.strokeStyle=sword?'#b3eeff':'#ffd78c';c.shadowColor=c.strokeStyle;c.shadowBlur=10;c.lineWidth=3;
 for(const d of [-1,1]){c.beginPath();c.moveTo(d*9,12);c.lineTo(d*(13+pulse*3),24);c.lineTo(d*15,31+pulse*3*d);c.stroke()}
 if(sword){c.beginPath();c.moveTo(21,6);c.lineTo(30+3*pulse,-25);c.stroke()}
 else{c.fillStyle='#536d80';c.fillRect(14,-12,26,9);c.fillStyle='#ffca7d';c.fillRect(37,-10,5,4)}
 c.restore();
}

function cinematicBossSkill(c,f){
 if(!f)return;
 const age=f.max-f.life, life=Math.max(0,Math.min(1,f.life/75)), pulse=.5+.5*Math.sin(age*.19);
 const rgb={EMP:'#70e8ff',LIGHTNING:'#aff9ff',ICE:'#b5edff',FIRE:'#ff9a4d',BLEED:'#ff5278',POISON:'#92f770',PRISM:'#e8acff',SHADOW:'#ac8cff',GRAVITY:'#86a4ff'};
 const color=rgb[f.kind]||f.color||'#8feeff',radius=26+Math.min(74,age*.62),t=age*.036;
 c.save();c.translate(f.x,f.y);c.globalAlpha=life;
 const halo=c.createRadialGradient(0,0,3,0,0,radius*1.24);
 halo.addColorStop(0,'rgba(255,255,255,.80)');halo.addColorStop(.18,color);halo.addColorStop(.45,color+'55');halo.addColorStop(1,'rgba(0,0,0,0)');
 c.globalCompositeOperation='lighter';c.fillStyle=halo;c.beginPath();c.arc(0,0,radius*1.55,0,Math.PI*2);c.fill();
 c.shadowColor=color;c.shadowBlur=detailEnabled?5:0;c.strokeStyle=color;
 if(f.kind==='GRAVITY'){
  c.globalCompositeOperation='source-over';
  const well=c.createRadialGradient(0,0,2,0,0,radius);
  well.addColorStop(0,'rgba(3,4,17,.94)');well.addColorStop(.46,'rgba(33,28,83,.65)');well.addColorStop(1,'rgba(130,158,255,0)');
  c.fillStyle=well;c.beginPath();c.arc(0,0,radius,0,7);c.fill();
  for(let i=0;i<4;i++){const a=t*(i%2?1:-1)+i*.9;c.save();c.rotate(a);c.strokeStyle=i%2?'#b9b8ff':'#6f7de0';c.lineWidth=1.7;c.beginPath();c.ellipse(0,0,radius*(.65+i*.15),radius*(.18+i*.06),0,0,7);c.stroke();c.restore()}
 }else if(f.kind==='FIRE'){
  for(let i=0;i<8;i++){const x=Math.sin(i*8.3+age*.13)*radius*.6,y=Math.cos(i*2.8)*radius*.35;const height=12+((i*13+age*2)%32);c.fillStyle=i%3===0?'#fff0a0':i%2?'#ffb13f':'#ff5b24';c.beginPath();c.ellipse(x,y-height*.5,2+i%2,height*.44,Math.sin(age*.12+i)*.24,0,Math.PI*2);c.fill()}
 }else if(f.kind==='BLEED'){
  c.globalCompositeOperation='source-over';
  for(let i=0;i<17;i++){const x=Math.sin(i*4.7+age*.045)*radius*.75,y=((age*(1+i%3)*.9+i*23)%(radius*1.8))-radius*.8;c.fillStyle=i%3===0?'#801321':'#f0334c';c.beginPath();c.ellipse(x,y,2+i%3,5+i%5,Math.sin(i+age*.02)*.6,0,Math.PI*2);c.fill()}
 }else if(f.kind==='POISON'){
  for(let i=0;i<18;i++){const x=Math.sin(i*5.7+age*.03)*radius*.65,y=Math.cos(i*3.2+age*.02)*radius*.55;const rr=3+(i*7+age)%11;c.fillStyle=i%2?'rgba(140,255,45,.38)':'rgba(80,172,73,.42)';c.beginPath();c.arc(x,y,rr,0,Math.PI*2);c.fill()}
 }else if(f.kind==='ICE'){
  for(let i=0;i<14;i++){const a=i*2.4,tall=12+i%5*5,x=Math.sin(a)*radius*.65,y=Math.cos(a)*radius*.55;c.save();c.translate(x,y);c.rotate(a+age*.001);c.fillStyle=i%2?'#e8ffff':'#8edaff';c.beginPath();c.moveTo(0,-tall);c.lineTo(5,0);c.lineTo(0,tall*.2);c.lineTo(-5,0);c.closePath();c.fill();c.restore()}
 }else if(f.kind==='SHADOW'){
  c.globalCompositeOperation='source-over';const dark=c.createRadialGradient(0,0,2,0,0,radius);dark.addColorStop(0,'rgba(12,3,33,.87)');dark.addColorStop(.55,'rgba(55,20,103,.65)');dark.addColorStop(1,'rgba(32,5,66,0)');c.fillStyle=dark;c.beginPath();c.arc(0,0,radius,0,7);c.fill();
  for(let i=0;i<9;i++){const a=i*2.4+age*.025;c.strokeStyle='rgba(95,54,168,.57)';c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(Math.cos(a+.7)*radius,Math.sin(a+.7)*radius,Math.cos(a)*radius*1.3,Math.sin(a)*radius*1.3);c.stroke()}
 }else if(f.kind==='PRISM'){
  for(let i=0;i<11;i++){const a=i*2.4+age*.015;c.strokeStyle=['#ff6488','#ffe69a','#7efff1','#ab91ff'][i%4];c.lineWidth=2.5;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*radius*1.4,Math.sin(a)*radius*1.4);c.stroke()}
 }else if(f.kind==='EMP'||f.kind==='LIGHTNING'){
  for(let k=0;k<5;k++){
   const a=k*Math.PI*2/5+t;c.lineWidth=2.3+(k%2);
   c.beginPath();c.moveTo(Math.cos(a)*9,Math.sin(a)*9);
   for(let j=1;j<=7;j++){const d=radius*j/7,twist=Math.sin(j*8.4+age*.35+k)*8;c.lineTo(Math.cos(a)*d+Math.cos(a+Math.PI/2)*twist,Math.sin(a)*d+Math.sin(a+Math.PI/2)*twist)}
   c.stroke();
  }
 }else if(f.kind==='GRAVITY'||f.kind==='SHADOW'||f.kind==='PRISM'){
  for(let k=0;k<3;k++){c.save();c.rotate(t*(k%2?1:-1)+k*1.1);c.lineWidth=1.8;c.beginPath();c.ellipse(0,0,radius*(.75+k*.12),radius*(.27+k*.07),0,0,Math.PI*2);c.stroke();c.restore()}
 }else{
  for(let k=0;k<18;k++){
   const a=k*2.39996+t*(k%2?1:-1),d=radius*(.25+.65*((k*7%19)/19));
   c.fillStyle=k%3===0?'#ffffff':color;c.beginPath();c.arc(Math.cos(a)*d,Math.sin(a)*d,1.5+(k%4)*.7+pulse,0,Math.PI*2);c.fill();
  }
  if(f.kind==='ICE'){c.lineWidth=2;c.beginPath();c.arc(0,0,radius*.72,0,Math.PI*2);c.stroke()}
 }
 c.restore();
}
function combatAtmosphere(c,d){
 if(!detailEnabled)return;
 const {w,h}=d,weather=String((CLIMATE[Math.max(0,Math.min(19,(Number(d.sector)||1)-1))]||[])[1]||d.weather||'rain').toUpperCase(),time=Date.now()*.001;
 c.save();c.globalCompositeOperation='screen';
 if(['RAIN','DRIZZLE','STORM','LIGHTNING'].includes(weather)){
   c.strokeStyle='rgba(186,231,255,.23)';c.lineWidth=1;
   for(let i=0;i<18;i++){const x=(hash(i*19+Number(d.sector))*w+time*62)%w,y=(hash(i*61)*h+time*90)%h;c.beginPath();c.ellipse(x,y,5+Math.sin(time+i)*2,2,0,Math.PI,Math.PI*2);c.stroke()}
 }else if(['SNOW','BLIZZARD'].includes(weather)){
   const fog=c.createLinearGradient(0,0,0,h);fog.addColorStop(0,'rgba(213,240,255,.12)');fog.addColorStop(1,'rgba(194,227,255,.02)');c.fillStyle=fog;c.fillRect(0,0,w,h);
 }else if(weather==='HEAT'){
   c.fillStyle='rgba(255,123,54,.035)';c.fillRect(0,0,w,h);
 }
 c.restore();
}
function atmosphereByTime(c,d){
 if(!detailEnabled)return;
 const {w,h}=d,weather=String((CLIMATE[Math.max(0,Math.min(19,(Number(d.sector)||1)-1))]||[])[1]||d.weather||'rain').toUpperCase(),day=d.dayPhase||'MORNING',time=Date.now()*.001;
 c.save();
 const cycle=((Number(d.missionTicks)||0)%1800)/1800;
 const smooth=Math.max(0,Math.min(1,(cycle-.82)/.18));
 const phases=['MORNING','AFTERNOON','NIGHT'],idx=Math.max(0,phases.indexOf(day));
 const tint=(phase,alpha)=>{
   const color=phase==='NIGHT'?'3,10,39':phase==='MORNING'?'255,192,111':'255,222,146';
   const strength=phase==='NIGHT'?.29:phase==='MORNING'?.075:.04;
   c.fillStyle='rgba('+color+','+(alpha*strength)+')';c.fillRect(0,0,w,h);
 };
 tint(day,1-smooth);tint(phases[(idx+1)%3],smooth);
 c.globalAlpha=.6+.4*Math.min(1,Math.min((Number(d.missionTicks)||0)%2700,2700-((Number(d.missionTicks)||0)%2700))/160);
 const count=d.quality==='eco'?22:56;
 if(['RAIN','DRIZZLE','STORM','LIGHTNING','SNOW','BLIZZARD'].includes(weather)){
  c.strokeStyle=!['SNOW','BLIZZARD'].includes(weather)?'rgba(178,221,255,.39)':'rgba(241,251,255,.74)';
  c.fillStyle='rgba(245,253,255,.78)';c.lineWidth=!['SNOW','BLIZZARD'].includes(weather)?1.1:1.8;
  for(let i=0;i<count;i++){
   const x=(hash(i*71+Number(d.sector)*9)*w+time*(!['SNOW','BLIZZARD'].includes(weather)?65:14))%w;
   const y=(hash(i*31+17)*h+time*(!['SNOW','BLIZZARD'].includes(weather)?235:42))%h;
   c.beginPath();if(!['SNOW','BLIZZARD'].includes(weather)){c.moveTo(x,y);c.lineTo(x-7,y+17);c.stroke()}else{c.arc(x,y,1.2+i%3*.45,0,7);c.fill()}
  }
 }else if(weather==='WIND'){
  c.strokeStyle='rgba(204,235,240,.25)';c.lineWidth=1.3;
  for(let i=0;i<count;i++){const x=(hash(i*33)*w+time*108)%w,y=hash(i*45+8)*h;c.beginPath();c.moveTo(x,y);c.lineTo(x+16,y-3);c.stroke()}
 }else if(weather==='HEAT'){
  for(let i=0;i<count/2;i++){const y=hash(i*17+14)*h,cx=hash(i*19+12)*w;c.strokeStyle='rgba(255,187,85,.075)';c.lineWidth=2;c.beginPath();c.moveTo(cx-20,y);c.quadraticCurveTo(cx+Math.sin(time*3+i)*12,y-8,cx+22,y);c.stroke()}
 }else if(weather==='FOG'){
  for(let i=0;i<5;i++){const x=((hash(i*73)*w+Math.sin(time*.17+i)*28)%w),y=h*(i+.5)/5;const g=c.createRadialGradient(x,y,10,x,y,w*.55);g.addColorStop(0,'rgba(201,220,233,.13)');g.addColorStop(1,'rgba(201,220,233,0)');c.fillStyle=g;c.fillRect(0,Math.max(0,y-w*.6),w,w*1.2)}
 }
 c.restore();
}
// Camada de sprites estáticos individuais: assets SVG embutidos, cacheados por identidade.
// Não interfere em hitbox, IA, velocidade ou regras do original.
const UNIQUE_BIOME_ICONS={
 ALLIGATOR:'🐊',SCORPION:'🦂',PIRANHA:'🐟',EEL:'〰',NARWHAL:'🐋',ICE_RAY:'◇',
 TUCANO:'🦜',EAGLE:'🦅',MANTIS:'🦗',PRISM_WASP:'🐝',BEETLE:'🪲',
 SALAMANDER:'🦎',WALRUS:'🦭',CRANE:'🏗',DREDGER:'⚓',WELDER:'⚙',
 HOVERCAR:'🚘',MOTOJET:'🏍',CORSAIR:'🚤',HYBRID_HUNTER:'☣'
};
function bossPresentation(c,d){
 if(!detailEnabled)return;
 const now=Date.now()*.001;
 for(const e of d.enemies||[]){
  if(e.type!=='BOSS'||e.hp<=0)continue;
  const radius=Math.max(32,(e.width||90)*.39),phase=(e.bossId||d.sector||1)%5;
  c.save();c.translate(e.x,e.y);
  const damaged=e.maxHp>0&&e.hp/e.maxHp<.4;
  const glow=['#6ee7ff','#ffb37b','#b2ff8c','#d1a6ff','#ffe19b'][phase];
  // Leitores de status integrados ao casco: arcos e riscas, nunca quadrados flutuantes.
  const identity=Math.max(1,Math.min(20,e.bossId||d.sector||1));
  const armorRatio=Math.max(0,Math.min(1,(e.armor||e.shield||0)/(e.maxArmor||e.maxShield||1)));
  c.save();c.strokeStyle=glow;c.lineCap='round';c.lineWidth=2;
  for(const side of [-1,1]){
    c.beginPath();c.arc(side*radius*.75,-radius*.16,radius*.26,Math.PI*.16,Math.PI*1.38,side===1);c.stroke();
    c.strokeStyle='#172d3b';c.lineWidth=4;c.beginPath();c.moveTo(side*radius*.92,radius*.45);c.lineTo(side*radius*.92,radius*.72);c.stroke();
    c.strokeStyle=damaged?'#ff6c54':glow;c.lineWidth=2;c.beginPath();c.moveTo(side*radius*.92,radius*.72);c.lineTo(side*radius*.92,radius*(.72-.27*(armorRatio||Math.max(0,e.hp/e.maxHp))));c.stroke();
  }
  c.restore();
  c.globalCompositeOperation='screen';
  const halo=c.createRadialGradient(0,0,radius*.2,0,0,radius*1.42);
  halo.addColorStop(0,'rgba(255,255,255,.12)');halo.addColorStop(.38,glow+'44');halo.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=halo;c.beginPath();c.arc(0,0,radius*1.42,0,Math.PI*2);c.fill();
  c.globalCompositeOperation='source-over';c.lineWidth=2.5;c.strokeStyle=damaged?'#ff6c54':glow;
  c.globalAlpha=.55+.2*Math.sin(now*4+phase);
  c.beginPath();c.ellipse(0,0,radius*1.14,radius*.78,Math.sin(now*.35)*.18,0,Math.PI*2);c.stroke();
  if(damaged){for(let i=0;i<7;i++){const x=Math.sin(now*1.5+i*2)*radius*.57,y=-radius*.8-((now*15+i*13)%(radius*.9));c.fillStyle=i%2?'#fe935f':'#cdd6de';c.globalAlpha=.25+.1*i;c.beginPath();c.arc(x,y,2+i%3,0,7);c.fill()}}
  c.restore();
 }
}
function livingSetDressing(c,d,t){
 const kinds=['TREES','DOCKS','DUNES','SWAMP','ISLAND','ICE','TREES','CITY','LAVA','CLIFF','FIELDS','NEON','SWAMP','ICE','DUNES','GLOW','DOCKS','ICE','FACTORY','CITADEL'];
 const kind=kinds[((d.sector-1)%20+20)%20],count=d.quality==='eco'?4:9,tick=d.missionTicks||0;
 c.save();
 for(let side of [-1,1])for(let i=0;i<count;i++){
   const y=(i*111+tick*.32+d.sector*23)%(d.h+120)-60;
   const x=side<0?15+(i*31+d.sector*17)%62:d.w-15-(i*31+d.sector*17)%62;
   c.save();c.translate(x,y);c.globalAlpha=.65;c.lineWidth=2;c.strokeStyle=t.accent;
   if(['TREES','SWAMP','GLOW','FIELDS'].includes(kind)){
     c.fillStyle='#315b48';c.fillRect(-3,-3,6,29);
     c.fillStyle=kind==='GLOW'?'#54c9af':t.foliage;
     for(let j=0;j<3;j++){c.beginPath();c.ellipse((j-1)*9,-j*8,12,8,0,0,Math.PI*2);c.fill();}
   }else if(['DOCKS','CITY','NEON','FACTORY','CITADEL'].includes(kind)){
     c.fillStyle=kind==='NEON'?'#334077':'#33485b';c.fillRect(-12,-28,24,43);c.strokeRect(-12,-28,24,43);
     c.fillStyle=kind==='NEON'?'#fa78d4':'#ffd18c';for(let j=0;j<3;j++)c.fillRect(-8+j*7,-18,3,7);
     if(kind==='DOCKS'||kind==='FACTORY'){c.beginPath();c.moveTo(0,-28);c.lineTo(0,-44);c.lineTo(18,-44);c.stroke();}
   }else if(['ICE','CLIFF'].includes(kind)){
     c.fillStyle=kind==='ICE'?'#ccebf9':'#6d808b';c.beginPath();c.moveTo(-16,15);c.lineTo(-5,-13);c.lineTo(0,-31);c.lineTo(17,15);c.closePath();c.fill();c.stroke();
   }else{
     c.fillStyle=kind==='LAVA'?'#a34f36':'#bca07a';c.beginPath();c.moveTo(-22,16);c.quadraticCurveTo(0,-26,22,16);c.closePath();c.fill();
   }
   c.restore();
 }
 c.restore();
}
// Boss silhouette accessories — recognizable functional parts over the original hull.
function bossAccessories(c,e,d){
 if(e.type!=='BOSS'||e.hp<=0)return;
 const family=((e.bossId||1)-1)%7,t=(d.missionTicks||0)*.07;
 const w=Math.max(76,e.width||110),h=Math.max(48,e.height||70);
 const accents=['#e8ad71','#83d2e7','#c6a2e9','#f5b57a','#90ddc4','#e79796','#a4d3f2'];
 c.save();c.translate(e.x,e.y);c.lineJoin='round';c.strokeStyle='#152635';c.lineWidth=2.5;c.fillStyle='#3b5366';
 const pod=(x,y)=>{c.save();c.translate(x,y);c.beginPath();c.ellipse(0,0,10,16,0,0,Math.PI*2);c.fill();c.stroke();c.fillStyle=accents[family];c.fillRect(-3,3,6,12);c.restore();};
 if(family===0||family===4){
   for(const side of [-1,1]){c.save();c.scale(side,1);c.beginPath();c.moveTo(w*.18,-h*.3);c.quadraticCurveTo(w*.6,-h*.36,w*.63,-h*.06);c.lineTo(w*.54,h*.25);c.lineTo(w*.24,h*.06);c.closePath();c.fill();c.stroke();c.restore();pod(side*w*.43,0);}
 }else if(family===1){
   for(const side of [-1,1]){const x=side*w*.33;pod(x,0);c.save();c.translate(x,-h*.23);c.rotate(t*2*side);c.strokeStyle='#dae9f4';c.lineWidth=3;c.beginPath();c.moveTo(-w*.2,0);c.lineTo(w*.2,0);c.moveTo(0,-w*.12);c.lineTo(0,w*.12);c.stroke();c.restore();}
 }else if(family===2||family===5){
   for(const side of [-1,1]){c.save();c.scale(side,1);for(let k=0;k<3;k++){const y=(k-1)*h*.24;c.beginPath();c.moveTo(w*.19,y);c.lineTo(w*.39,y+Math.sin(t+k)*4);c.lineTo(w*.53,y+h*.11);c.stroke();}c.restore();}
   c.strokeStyle=accents[family];c.lineWidth=4;c.beginPath();c.moveTo(0,-h*.2);c.quadraticCurveTo(22,-h*.64+Math.sin(t)*5,0,-h*.71);c.stroke();
 }else if(family===3){
   for(const side of [-1,1]){const x=side*w*.34;c.save();c.translate(x,0);c.fillStyle='#273340';c.beginPath();c.roundRect(-11,-h*.4,22,h*.8,8);c.fill();c.stroke();c.strokeStyle='#a5b4bf';for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(-9,k*h*.13);c.lineTo(9,k*h*.13);c.stroke();}c.restore();}pod(0,-h*.15);
 }else{
   for(const side of [-1,1]){pod(side*w*.35,0);c.save();c.translate(side*w*.35,-h*.15);c.rotate(t*1.4);c.strokeStyle=accents[family];c.beginPath();c.ellipse(0,0,17,7,0,0,Math.PI*2);c.stroke();c.restore();}
 }
 c.restore();
}
const bossSpriteFiles=['iron-wasp.svg','abyss-manta.svg','crimson-rotor.svg'];
const bossSpriteImages=bossSpriteFiles.map(name=>{const im=new Image();im.src='./assets/sprites/bosses/'+name;return im;});
function draw(c,d){
 const t=THEMES[((d.sector-1)%THEMES.length+THEMES.length)%THEMES.length];
 landscape(c,d,t);
 c.save();clipShoreLand(c,d.riverPoints,d.w,d.h);
 terrainSignature(c,d,t);landmark(c,d,t);mapSetPieces(c,d,t);enhancedWorld(c,d,t);livingSetDressing(c,d,t);
 c.restore();
 // Atmosfera sobre todo o mapa, sem recorte costeiro.
 biomeAtmosphere(c,d,t);
 // Culling explícito: evitar traçar sprites fora da tela e preservar FPS em ondas intensas.
 islands(c,(d.islands||[]).filter(p=>p.y+(p.height||0)>-32&&p.y-(p.height||0)<d.h+32&&p.x+(p.width||0)>-32&&p.x-(p.width||0)<d.w+32),t);
 for(const e of d.enemies||[]){
   if(e.hp<=0||e.y+(e.height||40)<-45||e.y-(e.height||40)>d.h+45||e.x+(e.width||40)<-45||e.x-(e.width||40)>d.w+45)continue;
   if(e.type==='BOSS'&&Number(d.sector)>=1&&Number(d.sector)<=3&&bossSpriteImages[Number(d.sector)-1].complete&&bossSpriteImages[Number(d.sector)-1].naturalWidth){const sprite=bossSpriteImages[Number(d.sector)-1];c.drawImage(sprite,e.x-(e.width||90)*.5,e.y-(e.height||90)*.5,e.width||90,e.height||90);bossAccessories(c,e,d);}
   else {enemy(c,e,t.time);highDetailEnemy(c,e,t.time);drawAtlasVehicle(c,e);drawBiomeOverlay(c,e);mechArticulation(c,e);bossAccessories(c,e,d);}
 }
 if(!d.invulnerable||Math.floor(Date.now()/110)%2){plane(c,d.player.x,d.player.y,d.player.aircraftType||d.aircraft,0.85);highDetailPlane(c,d.player.x,d.player.y,d.player.aircraftType||d.aircraft)}enhancedBattleLight(c,d);enhancedWeaponGlints(c,d);bossPresentation(c,d);atmosphereByTime(c,d);combatAtmosphere(c,d);
}
function drawPlayerForeground(c,x,y,aircraft,invulnerable){
 if(invulnerable>0&&Math.floor(Date.now()/160)%6===0)return;
 c.save();
 c.shadowColor='#69eaff';c.shadowBlur=detailEnabled?8:3;
 plane(c,x,y,aircraft,1.01);
 highDetailPlane(c,x,y,aircraft);
 c.restore();
}
root.RiverVisuals={cinematicBossSkill,draw,plane,enemy,drawPlayerForeground,THEMES,BIOME_DETAILS,drawIslands(c,items,sector){const t=THEMES[((sector-1)%THEMES.length+THEMES.length)%THEMES.length];islands(c,items,t)}};
})(window);
