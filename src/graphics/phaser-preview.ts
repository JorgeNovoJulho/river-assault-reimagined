import Phaser from 'phaser';
import { renderSprite, type SpriteKind } from './spriteforge';

const sprites:SpriteKind[]=['interceptor','mecha-sword','mecha-gun','patrol-boat','helicopter','shield','island','boss'];

class SpriteLab extends Phaser.Scene {
 constructor(){super('SpriteLab');}
 create(){
  this.cameras.main.setBackgroundColor('#061529');
  const title=this.add.text(24,16,'SPRITEFORGE · PROTÓTIPO VISUAL', {fontFamily:'monospace',fontSize:'18px',color:'#7ce6ff'});
  for(let i=0;i<sprites.length;i++){
   const kind=sprites[i],canvas=renderSprite({kind,palette:i%3===0?'industrial':i%3===1?'neon':'jungle',seed:i+17,size:128});
   const texture=this.textures.addCanvas('lab-'+kind,canvas);texture?.refresh();
   const x=100+(i%4)*170,y=140+Math.floor(i/4)*195;
   this.add.image(x,y,'lab-'+kind).setScale(.85);
   this.add.text(x,y+79,kind.toUpperCase(),{fontFamily:'monospace',fontSize:'12px',color:'#e0edf6'}).setOrigin(.5);
  }
  this.tweens.add({targets:title,alpha:.6,yoyo:true,repeat:-1,duration:1000});
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'lab',width:760,height:465,backgroundColor:'#061529',scene:[SpriteLab],scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY}});
