import Phaser from 'phaser';

const WIDTH=540,HEIGHT=960;
const assets=[
 ['boss-1','assets/sprites/bosses/iron-wasp.svg'],
 ['boss-2','assets/sprites/bosses/abyss-manta.svg'],
 ['boss-3','assets/sprites/bosses/crimson-rotor.svg'],
 ['enemy-gun','assets/sprites/enemies/mecha-gun.svg'],
 ['enemy-heli','assets/sprites/enemies/helicopter.svg'],
 ['enemy-sub','assets/sprites/enemies/submarine.svg'],
 ['island','assets/sprites/terrain/island-tropical.svg'],
 ['beam','assets/sprites/projectiles/plasma-blue.svg'],
 ['fighter','assets/sprites/player/riverstorm-fighter.svg'],
 ['bank-left','assets/sprites/terrain/river-bank-left.svg'],
 ['bank-right','assets/sprites/terrain/river-bank-right.svg'],
 ['water-detail','assets/sprites/terrain/water-detail.svg'],
 ['island-detail','assets/sprites/terrain/river-island-detail.svg']
] as const;
type Enemy={sprite:Phaser.GameObjects.Image;hp:number;speed:number;fireAt:number};
type Bullet={sprite:Phaser.GameObjects.Image;vy:number;damage:number;hostile:boolean};
class PhaserArena extends Phaser.Scene {
 private ship!:Phaser.GameObjects.Triangle;
 private shipVisual!:Phaser.GameObjects.Image;
 private banks:Phaser.GameObjects.Image[]=[];
 private waterTiles:Phaser.GameObjects.Image[]=[];
 private islandDetails:Phaser.GameObjects.Image[]=[];
 private boss!:Phaser.GameObjects.Image;
 private hud!:Phaser.GameObjects.Text;
 private keys!:Phaser.Types.Input.Keyboard.CursorKeys;
 private wasd!:Record<'W'|'A'|'S'|'D'|'SPACE',Phaser.Input.Keyboard.Key>;
 private islands:Phaser.GameObjects.Image[]=[];
 private enemies:Enemy[]=[];
 private shots:Bullet[]=[];
 private bossHp=180;
 private lives=3;
 private points=0;
 private elapsed=0;
 private nextWave=0;
 private nextShot=0;
 private bossAttackAt=0;
 private invulnerableUntil=0;
 private ended=false;
 private pointerActive=false;
 private pointerX=WIDTH/2;
 private pointerY=HEIGHT-135;
 constructor(){super('PhaserArena')}
 preload(){
  const rasterSizes:Record<string,{width:number;height:number}>={
   'boss-1':{width:180,height:180},'boss-2':{width:180,height:180},'boss-3':{width:180,height:180},
   'enemy-gun':{width:80,height:92},'enemy-heli':{width:96,height:96},'enemy-sub':{width:100,height:90},
   'island':{width:180,height:110},'beam':{width:20,height:46},
   'fighter':{width:96,height:112},'bank-left':{width:130,height:480},
   'bank-right':{width:130,height:480},'water-detail':{width:260,height:480},
   'island-detail':{width:180,height:110}
  };
  for(const [key,file] of assets)this.load.svg(key,'./'+file,rasterSizes[key]);
  // Sprite premium aprovado no laboratório Boss 01. Mantém SVG original como fallback.
  this.load.image('fighter-premium','./assets/sprites/premium/runtime/player/fighter_candidate.png');
  this.load.on('loaderror',(file:Phaser.Loader.File)=>console.warn('Phaser sprite:',file.key));
 }
 create(){
  this.cameras.main.setBackgroundColor('#0c233c');
  this.add.rectangle(WIDTH/2,HEIGHT/2,270,HEIGHT,0x12546a);
  for(let i=0;i<3;i++)this.waterTiles.push(this.add.image(WIDTH/2,i*480-240,'water-detail').setDisplaySize(280,480).setDepth(-1));
  this.islandDetails.push(this.add.image(157,-90,'island-detail').setDisplaySize(102,63).setDepth(0));
  this.islandDetails.push(this.add.image(378,-560,'island-detail').setDisplaySize(110,66).setDepth(0));
  for(let i=0;i<3;i++){
   this.banks.push(this.add.image(65,i*480-240,'bank-left').setDisplaySize(130,480));
   this.banks.push(this.add.image(WIDTH-65,i*480-240,'bank-right').setDisplaySize(130,480));
  }
  for(let i=0;i<9;i++)this.islands.push(this.add.image(i%2?388:149,120+i*120,'island').setDisplaySize(125,85).setAlpha(.9));
  this.boss=this.add.image(WIDTH/2,145,'boss-1').setDisplaySize(160,160);
  this.boss.setInteractive();
  this.ship=this.add.triangle(WIDTH/2,HEIGHT-130,0,42,28,0,56,42,0x96e7f2);
  this.ship.setStrokeStyle(3,0xfed084);
  this.ship.setAlpha(0); // Hitbox original intacta; a nave SVG e somente visual.
  const fighterTexture=this.textures.exists('fighter-premium')?'fighter-premium':'fighter';
  this.shipVisual=this.add.image(this.ship.x,this.ship.y,fighterTexture).setDisplaySize(52,61).setDepth(5);
  this.hud=this.add.text(12,14,'',{fontFamily:'monospace',fontSize:'17px',color:'#f2f9ff'}).setDepth(10);
  this.add.text(12,61,'SETAS/WASD mover · ESPAÇO atirar · toque arrastar e atirar · R reiniciar',{fontFamily:'monospace',fontSize:'12px',color:'#c6eaff',wordWrap:{width:WIDTH-24}}).setDepth(10);
  this.keys=this.input.keyboard!.createCursorKeys();
  this.wasd=this.input.keyboard!.addKeys('W,A,S,D,SPACE') as typeof this.wasd;
  this.input.keyboard!.on('keydown-R',()=>this.scene.restart());
  this.input.keyboard!.on('keydown-ONE',()=>this.boss.setTexture('boss-1'));
  this.input.keyboard!.on('keydown-TWO',()=>this.boss.setTexture('boss-2'));
  this.input.keyboard!.on('keydown-THREE',()=>this.boss.setTexture('boss-3'));
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.pointerActive=true;this.pointerX=p.x;this.pointerY=p.y;});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(this.pointerActive){this.pointerX=p.x;this.pointerY=p.y;}});
  this.input.on('pointerup',()=>{this.pointerActive=false});
  const status=document.getElementById('phaser-status');
  if(status)status.textContent='Arena Phaser jogável experimental: movimento, tiros, danos e colisões. Campanha Original permanece intacta.';
 }
 private shoot(x:number,y:number,hostile:boolean,damage:number){
  if(this.shots.length>=90)return;
  const sprite=this.add.image(x,y,'beam').setDisplaySize(hostile?12:9,hostile?22:29).setTint(hostile?0xff6f68:0x80eaff);
  this.shots.push({sprite,vy:hostile?5:-12,damage,hostile});
 }
 private spawnWave(time:number){
  const types=['enemy-gun','enemy-heli','enemy-sub'];
  const key=types[Math.floor(time/7000)%3];
  const sprite=this.add.image(55+Math.random()*(WIDTH-110),-45,key).setDisplaySize(key==='enemy-sub'?76:58,66);
  this.enemies.push({sprite,hp:3,speed:1.35+Math.min(2,time/30000),fireAt:time+550});
 }
 private damage(amount:number,time:number){
  if(this.ended||time<this.invulnerableUntil)return;
  this.lives-=amount;this.invulnerableUntil=time+900;
  this.ship.setFillStyle(0xff4b65);
  this.cameras.main.shake(100,.002);
  if(this.lives<=0){this.ended=true;this.add.text(WIDTH/2,HEIGHT/2,'NAVE DESTRUÍDA\nPRESSIONE R PARA RECOMEÇAR',{fontSize:'22px',align:'center',color:'#ffe2aa'}).setOrigin(.5).setDepth(20);}
 }
 update(time:number,delta:number){
  if(this.ended)return;
  const dt=Math.min(2,delta/16.667);this.elapsed+=delta;
  const speed=5.1*dt;
  if(this.keys.left.isDown||this.wasd.A.isDown)this.ship.x-=speed;
  if(this.keys.right.isDown||this.wasd.D.isDown)this.ship.x+=speed;
  if(this.keys.up.isDown||this.wasd.W.isDown)this.ship.y-=speed;
  if(this.keys.down.isDown||this.wasd.S.isDown)this.ship.y+=speed;
  if(this.pointerActive){this.ship.x+=(this.pointerX-this.ship.x)*Math.min(.25*dt,1);this.ship.y+=(this.pointerY-this.ship.y)*Math.min(.25*dt,1);}
  this.ship.x=Phaser.Math.Clamp(this.ship.x,26,WIDTH-26);this.ship.y=Phaser.Math.Clamp(this.ship.y,100,HEIGHT-30);
  this.ship.setFillStyle(time<this.invulnerableUntil?0xff6b71:0x96e7f2);
  this.shipVisual.setPosition(this.ship.x,this.ship.y).setTint(time<this.invulnerableUntil?0xff899a:0xffffff);
  for(const bank of this.banks){bank.y+=1.25*dt;if(bank.y>HEIGHT+240)bank.y-=1440;}
  for(const tile of this.waterTiles){tile.y+=1.25*dt;if(tile.y>HEIGHT+240)tile.y-=1440;}
  for(const island of this.islandDetails){island.y+=1.25*dt;if(island.y>HEIGHT+75)island.y-=1250;}
  for(const island of this.islands){island.y+=1.25*dt;if(island.y>HEIGHT+70)island.y=-85;}
  if(time>this.nextShot&&(this.keys.space.isDown||this.wasd.SPACE.isDown||this.pointerActive)){
   this.shoot(this.ship.x,this.ship.y-22,false,1);this.nextShot=time+135;
  }
  if(time>this.nextWave&&this.enemies.length<10){this.spawnWave(time);this.nextWave=time+1200;}
  if(time>this.bossAttackAt){this.shoot(this.boss.x+Math.sin(time*.001)*45,this.boss.y+55,true,1);this.bossAttackAt=time+900;}
  for(let i=this.enemies.length-1;i>=0;i--){
   const e=this.enemies[i];e.sprite.y+=e.speed*dt;
   if(time>e.fireAt&&e.sprite.y>50&&e.sprite.y<HEIGHT-140){this.shoot(e.sprite.x,e.sprite.y+22,true,1);e.fireAt=time+1600;}
   if(e.sprite.y>HEIGHT+50){e.sprite.destroy();this.enemies.splice(i,1);continue;}
   if(Phaser.Math.Distance.Between(e.sprite.x,e.sprite.y,this.ship.x,this.ship.y)<36){this.damage(1,time);e.sprite.destroy();this.enemies.splice(i,1);}
  }
  for(let i=this.shots.length-1;i>=0;i--){
   const b=this.shots[i];b.sprite.y+=b.vy*dt;
   if(b.sprite.y<-60||b.sprite.y>HEIGHT+50){b.sprite.destroy();this.shots.splice(i,1);continue;}
   if(b.hostile){
    if(Phaser.Math.Distance.Between(b.sprite.x,b.sprite.y,this.ship.x,this.ship.y)<28){this.damage(1,time);b.sprite.destroy();this.shots.splice(i,1);}
   }else{
    let hit=false;
    for(let j=this.enemies.length-1;j>=0;j--){const e=this.enemies[j];if(Phaser.Math.Distance.Between(b.sprite.x,b.sprite.y,e.sprite.x,e.sprite.y)<35){e.hp-=b.damage;hit=true;if(e.hp<=0){e.sprite.destroy();this.enemies.splice(j,1);this.points+=100;}break;}}
    if(!hit&&Math.abs(b.sprite.x-this.boss.x)<65&&Math.abs(b.sprite.y-this.boss.y)<63){this.bossHp-=b.damage;hit=true;this.points+=5;}
    if(hit){b.sprite.destroy();this.shots.splice(i,1);}
   }
  }
  if(this.bossHp<=0){this.bossHp=180;this.points+=2000;this.boss.setTexture(['boss-1','boss-2','boss-3'][Math.floor(this.points/2000)%3]);}
  this.hud.setText('PHASER 4 + TS | '+Math.round(this.game.loop.actualFps)+' FPS  HP '+this.lives+'  BOSS '+this.bossHp+'/180  PTS '+this.points);
 }
}
new Phaser.Game({
 type:Phaser.AUTO,parent:'phaser-stage',width:WIDTH,height:HEIGHT,
 backgroundColor:'#06101f',
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
 scene:[PhaserArena],
 render:{pixelArt:false,antialias:true}
});
