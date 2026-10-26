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
 // Direção de arte individual das vinte operações, com ciclo de iluminação por distância.

 const climate=CLIMATE[mission-1],weather=climate[1];
 const weatherNames={mist:'NEBLINA',drizzle:'GAROA',sand:'TEMPESTADE DE AREIA',breeze:'BRISA',snow:'NEVE',storm:'TEMPESTADE',neon:'LUZES NEON',ash:'CINZAS VULCÂNICAS',rain:'CHUVA',blizzard:'NEVASCA',lightning:'TEMPESTADE ELÉTRICA'};
 const periodNames={dawn:'AMANHECER',night:'NOITE',noon:'MEIO-DIA',dusk:'ANOITECER',sunset:'PÔR DO SOL',twilight:'CREPÚSCULO',afternoon:'TARDE',morning:'MANHÃ',golden:'HORA DOURADA',midnight:'MADRUGADA'};
 if(quality!=='eco'){
   c.save();c.font='bold 8px monospace';c.textAlign='right';
   c.fillStyle='rgba(4,14,31,.65)';c.fillRect(Math.max(0,w-185),15,177,17);
   c.fillStyle='rgba(232,247,255,.88)';c.fillText(periodNames[climate[2]]+' · '+(weatherNames[weather]||'CÉU LIMPO'),w-13,26);
   c.restore();
 }
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

function draw(c,d){
 const t=THEMES[((d.sector-1)%THEMES.length+THEMES.length)%THEMES.length];
 landscape(c,d,t);terrainSignature(c,d,t);landmark(c,d,t);mapSetPieces(c,d,t);biomeAtmosphere(c,d,t);
 // Culling explícito: evitar traçar sprites fora da tela e preservar FPS em ondas intensas.
 islands(c,(d.islands||[]).filter(p=>p.y+(p.height||0)>-32&&p.y-(p.height||0)<d.h+32&&p.x+(p.width||0)>-32&&p.x-(p.width||0)<d.w+32),t);
 for(const e of d.enemies||[]){
   if(e.hp<=0||e.y+(e.height||40)<-45||e.y-(e.height||40)>d.h+45||e.x+(e.width||40)<-45||e.x-(e.width||40)>d.w+45)continue;
   enemy(c,e,t.time);
 }
 if(!d.invulnerable||Math.floor(Date.now()/110)%2)plane(c,d.player.x,d.player.y,d.player.aircraftType||d.aircraft,0.85);
}
root.RiverVisuals={draw,plane,enemy,THEMES,BIOME_DETAILS,drawIslands(c,items,sector){const t=THEMES[((sector-1)%THEMES.length+THEMES.length)%THEMES.length];islands(c,items,t)}};
})(window);
