import { renderSprite, type SpriteKind, type SpriteSpec } from './spriteforge';

/** Atlas de estados animados — renderização inicial offline, animação barata na GPU. */
export type Motion = 'idle'|'move'|'attack'|'damage'|'destroy';
export interface AnimationFrame { x:number; y:number; width:number; height:number; }
export interface AnimatedAtlas { canvas:HTMLCanvasElement; frames:Record<string,AnimationFrame>; sequences:Record<string,string[]>; }
export function buildAnimatedAtlas(kinds:SpriteKind[],framesPerState=6,quality:128):AnimatedAtlas {
 const motions:Motion[]=['idle','move','attack','damage','destroy'];
 const size=Math.max(64,Math.min(256,quality)),columns=framesPerState,rows=kinds.length*motions.length;
 const canvas=document.createElement('canvas');canvas.width=size*columns;canvas.height=size*rows;
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas 2D indisponível');
 const frames:Record<string,AnimationFrame>={},sequences:Record<string,string[]>={};
 for(let k=0;k<kinds.length;k++)for(let m=0;m<motions.length;m++){
  const motion=motions[m],kind=kinds[k],sequence=`${kind}:${motion}`;
  sequences[sequence]=[];
  for(let i=0;i<framesPerState;i++){
   const name=`${kind}-${motion}-${i}`,x=i*size,y=(k*motions.length+m)*size;
   const sprite=renderSprite({kind,size,seed:k+17,palette:k%3===0?'industrial':k%3===1?'neon':'jungle'} satisfies SpriteSpec);
   ctx.save();ctx.translate(x+size/2,y+size/2);
   if(motion==='move')ctx.translate(Math.sin(i/framesPerState*Math.PI*2)*size*.025,Math.cos(i/framesPerState*Math.PI*2)*size*.012);
   if(motion==='idle')ctx.scale(1+Math.sin(i/framesPerState*Math.PI*2)*.016,1);
   if(motion==='attack')ctx.rotate(Math.sin(i/framesPerState*Math.PI*2)*.045);
   if(motion==='damage')ctx.globalAlpha=i%2?.45:1;
   if(motion==='destroy'){ctx.globalAlpha=Math.max(.08,1-i/framesPerState);ctx.rotate(i*.18);ctx.scale(1+i*.11,1+i*.11)}
   ctx.drawImage(sprite,-size/2,-size/2);ctx.restore();
   // Elementos articulados e efeitos específicos de cada classe, sem transformar todo o sprite.
   const phase=i/framesPerState*Math.PI*2;
   ctx.save();ctx.translate(x+size*.5,y+size*.5);ctx.scale(size/128,size/128);
   const mech=kind==='mecha-sword'||kind==='mecha-gun'||kind==='boss';
   if(mech&&motion==='move'){
    for(const side of [-1,1]){
     const stride=Math.sin(phase+(side===1?0:Math.PI))*6;
     ctx.strokeStyle='#1b2e40';ctx.lineWidth=10;ctx.beginPath();
     ctx.moveTo(side*16,27);ctx.lineTo(side*(19+stride*.3),39);ctx.lineTo(side*(20+stride),52);ctx.stroke();
     ctx.strokeStyle='#a6bdd1';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(side*(19+stride*.3),39);ctx.lineTo(side*(20+stride),52);ctx.stroke();
    }
   }
   if(kind==='helicopter'||kind==='patrol-boat'){
    if(kind==='helicopter'){
     ctx.save();ctx.translate(0,-9);ctx.rotate(phase*2);
     ctx.strokeStyle='rgba(189,235,255,.8)';ctx.lineWidth=3;
     ctx.beginPath();ctx.moveTo(-53,0);ctx.lineTo(53,0);ctx.moveTo(0,-14);ctx.lineTo(0,14);ctx.stroke();ctx.restore();
    }else if(motion==='move'){
     ctx.strokeStyle='rgba(225,249,255,.8)';ctx.lineWidth=2;
     for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*15,31);ctx.quadraticCurveTo(side*(22+i*1.4),48,side*13,60);ctx.stroke();}
    }
   }
   if(motion==='attack'){
    const intensity=Math.max(0,Math.sin(Math.PI*i/(framesPerState-1)));
    ctx.globalCompositeOperation='screen';ctx.shadowColor='#68eaff';ctx.shadowBlur=12;
    if(kind==='mecha-sword'){
     ctx.strokeStyle='#c8faff';ctx.lineWidth=2+intensity*5;ctx.beginPath();
     ctx.arc(14,-5,38,-1.8+phase*.18,.7+phase*.18);ctx.stroke();
    }else if(kind==='mecha-gun'||kind==='boss'){
     ctx.fillStyle='#ffcc82';ctx.beginPath();ctx.moveTo(55,-8);ctx.lineTo(55+24*intensity,0);ctx.lineTo(55,8);ctx.fill();
    }else{
     ctx.strokeStyle='#a5f5ff';ctx.lineWidth=2+intensity*4;ctx.beginPath();ctx.moveTo(0,-46);ctx.lineTo(0,-63);ctx.stroke();
    }
    ctx.shadowBlur=0;
   }
   if(motion==='damage'){
    ctx.globalAlpha=i%2?.45:.78;ctx.fillStyle='#ff5945';ctx.beginPath();ctx.ellipse(0,0,25+i*2,26+i*2,0,0,Math.PI*2);ctx.fill();
   }
   if(motion==='destroy'){
    const progress=i/(framesPerState-1);
    ctx.fillStyle='rgba(255,157,60,.8)';
    for(let j=0;j<9;j++){const angle=j*2.399,dist=progress*56;
     ctx.beginPath();ctx.arc(Math.cos(angle)*dist,Math.sin(angle)*dist,Math.max(1,5-progress*3),0,Math.PI*2);ctx.fill();}
   }
   ctx.restore();
   frames[name]={x,y,width:size,height:size};sequences[sequence].push(name);
  }
 }
 return {canvas,frames,sequences};
}
export function downloadAtlas(atlas:AnimatedAtlas,baseName='riverstorm-sprites'):void {
 const link=document.createElement('a');link.href=atlas.canvas.toDataURL('image/png');link.download=baseName+'.png';link.click();
 const metadata=new Blob([JSON.stringify({frames:atlas.frames,sequences:atlas.sequences},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(metadata),jsonLink=document.createElement('a');jsonLink.href=url;jsonLink.download=baseName+'.json';jsonLink.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
