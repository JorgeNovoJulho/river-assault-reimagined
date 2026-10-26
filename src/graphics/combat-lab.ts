import Phaser from 'phaser';
import {buildAnimatedAtlas, type Motion} from './animated-atlas';
import type {SpriteKind} from './spriteforge';

// Laboratorio de combate isolado: nenhuma mudanca na logica ou hitboxes do jogo oficial.
type FighterKind='mecha-sword'|'mecha-gun'|'interceptor'|'patrol-boat';
interface Fighter {kind:FighterKind;image:Phaser.GameObjects.Image;hp:number;cooldown:number;motion:Motion;motionUntil:number;vx:number;vy:number}
const kinds:FighterKind[]=['interceptor','mecha-sword','mecha-gun','patrol-boat'];
const states:Motion[]=['idle','move','attack','damage','destroy'];
const frameCount=6;
const atlas=buildAnimatedAtlas(kinds,frameCount,128);
const host=document.getElementById('lab');
if(!host)throw Error('Laboratorio sem conteiner');
const info=document.createElement('p');
info.textContent='WASD / setas: mover · ESPAÇO: disparar · R: reiniciar. Demonstração experimental, sem progressão.';
host.before(info);
class CombatLab extends Phaser.Scene{
 private fighters:Fighter[]=[];
 private shots:{x:number;y:number;vy:number;circle:Phaser.GameObjects.Arc}[]=[];
 private keys!:Phaser.Types.Input.Keyboard.CursorKeys;
 private wasd!:Record<string,Phaser.Input.Keyboard.Key>;
 private player!:Fighter;
 private lastShot=0;
 constructor(){super('CombatLab')}
 create(){
  this.cameras.main.setBackgroundColor('#08253d');
  this.textures.addSpriteSheet('combat-atlas',atlas.canvas,{frameWidth:128,frameHeight:128});
  const positions:[FighterKind,number,number,number][]=[
   ['interceptor',380,405,0],['mecha-sword',205,125,0.45],['mecha-gun',540,125,0.45],['patrol-boat',380,135,0.45]
  ];
  this.fighters=positions.map(([kind,x,y,scale],i)=>{
   const image=this.add.image(x,y,'combat-atlas',i*states.length*frameCount).setScale(scale||.48);
   return {kind,image,hp:i?4:10,cooldown:0,motion:'idle' as Motion,motionUntil:0,vx:i%2?1:-1,vy:0};
  });
  this.player=this.fighters[0];
  this.keys=this.input.keyboard!.createCursorKeys();
  this.wasd=this.input.keyboard!.addKeys('W,A,S,D,SPACE,R') as Record<string,Phaser.Input.Keyboard.Key>;
  this.add.text(10,10,'RIVERSTORM · COMBAT SPRITE LAB',{fontSize:'15px',fontFamily:'monospace',color:'#b6f7ff'});
 }
 private setMotion(f:Fighter,m:Motion,time:number,duration:number){f.motion=m;f.motionUntil=time+duration;}
 update(time:number,dt:number){
  const step=Math.min(dt,33)/16.667;
  if(Phaser.Input.Keyboard.JustDown(this.wasd.R))this.scene.restart();
  const dx=Number(this.keys.right.isDown||this.wasd.D.isDown)-Number(this.keys.left.isDown||this.wasd.A.isDown);
  const dy=Number(this.keys.down.isDown||this.wasd.S.isDown)-Number(this.keys.up.isDown||this.wasd.W.isDown);
  this.player.image.x=Phaser.Math.Clamp(this.player.image.x+dx*4*step,35,725);
  this.player.image.y=Phaser.Math.Clamp(this.player.image.y+dy*4*step,260,430);
  if((this.keys.space.isDown||this.wasd.SPACE.isDown)&&time-this.lastShot>140){
   this.lastShot=time;const circle=this.add.circle(this.player.image.x,this.player.image.y-29,3,0x9cedff);
   this.shots.push({x:circle.x,y:circle.y,vy:-9,circle});
   this.setMotion(this.player,'attack',time,160);
  }
  for(const shot of this.shots){shot.y+=shot.vy*step;shot.circle.y=shot.y;
   for(const f of this.fighters.slice(1)){
    if(f.hp<=0||Math.abs(f.image.x-shot.x)>23||Math.abs(f.image.y-shot.y)>25)continue;
    f.hp--;shot.y=-200;this.setMotion(f,f.hp?'damage':'destroy',time,f.hp?300:650);break;
   }
  }
  this.shots=this.shots.filter(s=>{if(s.y>-20)return true;s.circle.destroy();return false});
  this.fighters.forEach((f,i)=>{
   if(i&&f.hp>0){f.image.x+=f.vx*.7*step;if(f.image.x<75||f.image.x>680)f.vx*=-1;
    if(time>f.motionUntil)this.setMotion(f,'move',time,350);
    if(f.kind==='mecha-gun'&&time-f.cooldown>1550){f.cooldown=time;this.setMotion(f,'attack',time,300);}
   }
   if(time>f.motionUntil&&f.motion!=='destroy')f.motion='idle';
   if(f.hp<=0&&time>f.motionUntil){f.image.setVisible(false);return;}
   const frame=Math.floor(time/95)%frameCount;
   const offset=kinds.indexOf(f.kind)*states.length*frameCount+states.indexOf(f.motion)*frameCount+frame;
   f.image.setFrame(offset);
  });
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:'lab',width:760,height:465,scene:[CombatLab],scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_HORIZONTALLY}});
