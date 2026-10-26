/** RiverStorm SpriteForge — geração determinística de sprites rasterizados.
 * Sem serviços externos; produz texturas Canvas (PNG via browser se desejado).
 * Não altera as hitboxes ou a lógica do jogo legado.
 */
export type SpriteKind = 'mecha-sword'|'mecha-gun'|'interceptor'|'patrol-boat'|'helicopter'|'shield'|'island'|'boss';
export interface SpriteSpec { kind: SpriteKind; seed?: number; size?: number; palette?: 'neon'|'jungle'|'arctic'|'industrial'; }
const palettes={
 neon:['#25304b','#7895ad','#f451d5','#a6faff'],
 jungle:['#263f37','#7c9b75','#ffab50','#d4ffc2'],
 arctic:['#28455a','#94c5d7','#73edff','#f5ffff'],
 industrial:['#302e3b','#9c9c9c','#ff9546','#ffe5a6']
} as const;
export function renderSprite(spec:SpriteSpec):HTMLCanvasElement{
 const n=spec.size??128,c=document.createElement('canvas');c.width=n;c.height=n;
 const g=c.getContext('2d');if(!g)throw new Error('Canvas 2D indisponível');
 const [dark,metal,glow,light]=palettes[spec.palette??'neon'];
 const rng=(()=>{let s=(spec.seed??17)>>>0;return ()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296}})();
 g.translate(n/2,n/2);g.scale(n/128,n/128);g.lineJoin='round';g.lineCap='round';
 const path=(points:number[],fill:string,stroke=light)=>{g.beginPath();for(let i=0;i<points.length;i+=2)i?g.lineTo(points[i],points[i+1]):g.moveTo(points[i],points[i+1]);g.closePath();g.fillStyle=fill;g.fill();g.strokeStyle=stroke;g.lineWidth=1.7;g.stroke()};
 const orb=(x:number,y:number,r:number,color=glow)=>{g.save();g.shadowBlur=12;g.shadowColor=color;g.fillStyle=color;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();g.restore()};
 const body=g.createLinearGradient(-45,-50,48,54);body.addColorStop(0,light);body.addColorStop(.22,metal);body.addColorStop(.72,dark);body.addColorStop(1,'#0c1725');
 const plating=()=>{for(let i=0;i<18;i++){const x=(rng()-.5)*54,y=(rng()-.5)*68;g.globalAlpha=.16;g.fillStyle=i%2?light:'#070d18';g.fillRect(x,y,2+rng()*10,1+rng()*4)}g.globalAlpha=1};
 if(spec.kind==='mecha-sword'||spec.kind==='mecha-gun'||spec.kind==='boss'){
  const boss=spec.kind==='boss',s=boss?1.3:1;
  g.save();g.scale(s,s);
  for(const side of [-1,1]){g.save();g.scale(side,1);
   path([12,-26,27,-28,37,-13,34,18,23,23,13,5],body);
   path([10,16,25,23,29,51,14,53,5,29],dark);
   orb(27,-7,4);
   g.restore();}
  path([-27,-37,0,-48,27,-37,32,21,15,38,-15,38,-32,21],body);
  path([-18,-43,0,-54,18,-43,15,-26,-15,-26],dark);
  g.fillStyle='#081e2d';g.fillRect(-16,-34,32,9);orb(0,-29,5);
  path([-15,-15,15,-15,21,11,0,29,-21,11],metal,dark);orb(0,5,9);
  if(spec.kind==='mecha-sword'){g.strokeStyle='#dffaff';g.shadowColor=glow;g.shadowBlur=16;g.lineWidth=5;g.beginPath();g.moveTo(32,15);g.lineTo(53,-48);g.stroke();g.shadowBlur=0;}
  else {for(const y of [-9,0,9]){g.fillStyle=dark;g.fillRect(25,y,33,7);orb(55,y+3,2,glow)}}
  plating();g.restore();
 }else if(spec.kind==='interceptor'){
  path([0,-59,14,-16,59,28,22,20,12,46,0,31,-12,46,-22,20,-59,28,-14,-16],body);
  path([-10,-27,0,-44,10,-27,8,9,-8,9],dark);orb(0,-14,6);
  for(const x of [-20,20])orb(x,23,5,'#6ac9ff');
 }else if(spec.kind==='patrol-boat'){
  path([0,-61,20,-42,24,31,12,57,-12,57,-24,31,-20,-42],body);
  path([-14,-33,14,-33,16,32,-16,32],metal);path([-9,-17,9,-17,12,16,-12,16],dark);
  orb(0,-35,4);orb(-15,31,3,'#ffaa4e');orb(15,31,3,'#ffaa4e');plating();
 }else if(spec.kind==='helicopter'){
  path([0,-41,17,-17,19,20,5,34,5,58,-5,58,-5,34,-19,20,-17,-17],body);
  path([-11,-33,0,-40,11,-33,12,-14,-12,-14],dark);orb(0,-26,5);
  g.strokeStyle=light;g.lineWidth=4;g.beginPath();g.moveTo(-54,-9);g.lineTo(54,-9);g.moveTo(0,-49);g.lineTo(0,28);g.stroke();
  for(const x of [-21,21])orb(x,13,3);
 }else if(spec.kind==='shield'){
  g.save();g.shadowColor=glow;g.shadowBlur=22;path([0,-50,40,-34,36,12,0,47,-36,12,-40,-34],dark,glow);g.restore();
  path([0,-40,30,-28,28,8,0,34,-28,8,-30,-28],metal,light);
  path([0,-33,24,-23,22,5,0,27,-22,5,-24,-23],glow,light);orb(0,0,8,light);
 }else{
  g.fillStyle='#174352';g.beginPath();g.ellipse(0,4,57,42,-.2,0,Math.PI*2);g.fill();
  path([-51,9,-40,-25,-20,-36,3,-27,32,-34,50,-8,43,30,15,40,-27,30],body,'#9bbdbe');
  for(let i=0;i<23;i++){const x=(rng()-.5)*77,y=(rng()-.5)*45,r=2+rng()*6;
    g.fillStyle=i%3?'#385a4a':'#6c916b';g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}
 }
 return c;
}
export function makeAtlas(specs:SpriteSpec[]):{canvas:HTMLCanvasElement;frames:Record<string,{x:number;y:number;width:number;height:number}>}{
 const tile=128,columns=4,rows=Math.ceil(specs.length/columns),canvas=document.createElement('canvas');
 canvas.width=tile*columns;canvas.height=tile*Math.max(1,rows);
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas indisponível');
 const frames:Record<string,{x:number;y:number;width:number;height:number}>={};
 specs.forEach((spec,i)=>{const x=i%columns*tile,y=Math.floor(i/columns)*tile;ctx.drawImage(renderSprite({...spec,size:tile}),x,y);frames[spec.kind+'-'+i]={x,y,width:tile,height:tile}});
 return {canvas,frames};
}
