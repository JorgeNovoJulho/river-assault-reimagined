import Phaser from 'phaser';
import { renderSprite, type SpriteKind } from './spriteforge';
import { buildAnimatedAtlas, downloadAtlas, type Motion } from './animated-atlas';

const kinds:SpriteKind[]=['interceptor','mecha-sword','mecha-gun','patrol-boat'];
const additional:SpriteKind[]=['helicopter','shield','island','boss'];
const states:Motion[]=['idle','move','attack','damage','destroy'];
const frames=6;
const atlas=buildAnimatedAtlas(kinds,frames,128);
let selected:Motion='idle';
const parent=document.getElementById('lab');
if(!parent)throw Error('Contêiner Sprite Lab ausente');
const controls=document.createElement('div');controls.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 16px';
for(const motion of states){
 const btn=document.createElement('button');btn.textContent=motion.toUpperCase();btn.type='button';
 btn.style.cssText='background:#173a55;color:#eafaff;border:1px solid #60c5ef;border-radius:6px;padding:9px;cursor:pointer';
 btn.onclick=()=>{selected=motion};controls.appendChild(btn);
}
const download=document.createElement('button');download.type='button';download.textContent='EXPORTAR PNG + JSON';
download.style.cssText='background:#225c44;color:#fff;border:1px solid #68d4b3;border-radius:6px;padding:9px;cursor:pointer';
download.onclick=()=>downloadAtlas(atlas,'riverstorm-atlas-v1');controls.appendChild(download);
parent.before(controls);

class SpriteLab extends Phaser.Scene{
 private animated:Phaser.GameObjects.Image[]=[];
 constructor(){super('SpriteLab')}
 create(){
  this.cameras.main.setBackgroundColor('#061529');
  this.add.text(20,12,'SPRITEFORGE · ANIMAÇÃO + ATLAS',{fontFamily:'monospace',fontSize:'18px',color:'#7ce6ff'});
  this.textures.addSpriteSheet('rs-animated',atlas.canvas,{frameWidth:128,frameHeight:128});
  kinds.forEach((kind,i)=>{
   const x=100+i*182,y=142;
   this.animated.push(this.add.image(x,y,'rs-animated',i*states.length*frames).setScale(.82));
   this.add.text(x,y+76,kind.toUpperCase(),{fontFamily:'monospace',fontSize:'11px',color:'#e5f6ff'}).setOrigin(.5);
  });
  additional.forEach((kind,i)=>{
   const canvas=renderSprite({kind,seed:i+41,size:128});
   this.textures.addCanvas('rs-'+kind,canvas);
   const x=100+i*182,y=340;
   this.add.image(x,y,'rs-'+kind).setScale(.82);
   this.add.text(x,y+76,kind.toUpperCase(),{fontFamily:'monospace',fontSize:'11px',color:'#e5f6ff'}).setOrigin(.5);
  });
 }
 update(time:number){
  const state=states.indexOf(selected);
  const frame=Math.floor(time/115)%frames;
  this.animated.forEach((sprite,i)=>sprite.setFrame(i*states.length*frames+state*frames+frame));
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'lab',width:760,height:465,backgroundColor:'#061529',scene:[SpriteLab],scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY}});
