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
   if(motion==='attack'){
    ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(91,229,255,.8)';
    const pulse=1-Math.abs(i-(framesPerState-1)/2)/Math.max(1,framesPerState/2);
    ctx.beginPath();ctx.arc(x+size*.5,y+size*.22,size*(.02+.09*pulse),0,Math.PI*2);ctx.fill();ctx.restore();
   }
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
