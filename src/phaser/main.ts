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
type Bullet={sprite:Phaser.GameObjects.Image;glow:Phaser.GameObjects.Image;vx:number;vy:number;damage:number;hostile:boolean;trailAt:number};
type ShoreUnit={sprite:Phaser.GameObjects.Image;kind:'tower'|'tank';side:-1|1;anchorX:number;fireAt:number;phase:number};
class PhaserArena extends Phaser.Scene {
 private ship!:Phaser.GameObjects.Triangle;
 private shipVisual!:Phaser.GameObjects.Image;
 private banks:Phaser.GameObjects.Image[]=[];
 private waterTiles:Phaser.GameObjects.Image[]=[];
 private boss!:Phaser.GameObjects.Image;
 private bossModules:Phaser.GameObjects.Image[]=[];
 private hud!:Phaser.GameObjects.Text;
 private bossBar!:Phaser.GameObjects.Graphics;
 private keys!:Phaser.Types.Input.Keyboard.CursorKeys;
 private wasd!:Record<'W'|'A'|'S'|'D'|'SPACE',Phaser.Input.Keyboard.Key>;
 private islands:Phaser.GameObjects.Image[]=[];
 private shoreUnits:ShoreUnit[]=[];
 private enemies:Enemy[]=[];
 private shots:Bullet[]=[];
 private bossHp=180;
 private lives=3;
 private points=0;
 private elapsed=0;
 private nextWave=0;
 private nextShot=0;
 private bossAttackAt=0;
 private bossDamageStage=0;
 private invulnerableUntil=0;
 private ended=false;
 private pointerActive=false;
 private pointerFiring=false;
 private pointerIsMouse=false;
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
  // Rasters isolados do acervo aprovado. Os SVGs continuam somente como fallback
  // para o conteúdo que ainda não recebeu arte final.
  this.load.image('fighter-premium','./assets/sprites/premium/runtime/player/fighter_candidate.png');
  this.load.spritesheet('explosion-premium','./assets/sprites/premium/runtime/fx/explosion_atlas_4x3.png',{frameWidth:128,frameHeight:128,endFrame:11});
  this.load.image('water-premium','./assets/sprites/premium/runtime/environment/water_calm.png');
  this.load.image('bank-left-premium','./assets/sprites/premium/runtime/environment/riverbank_left.png');
  this.load.image('bank-right-premium','./assets/sprites/premium/runtime/environment/riverbank_right.png');
  this.load.image('boss-1-premium','./assets/sprites/premium/runtime/boss01/core.png');
  this.load.image('boss-tower-left','./assets/sprites/premium/runtime/boss01/tower1.png');
  this.load.image('boss-tower-right','./assets/sprites/premium/runtime/boss01/tower2.png');
  this.load.image('boss-tower-fire','./assets/sprites/premium/runtime/boss01/towerFire.png');
  this.load.image('boss-cannon','./assets/sprites/premium/runtime/boss01/cannon.png');
  this.load.image('boss-cannon-fire','./assets/sprites/premium/runtime/boss01/cannonFire.png');
  this.load.image('boss-cannon-damaged','./assets/sprites/premium/runtime/boss01/cannonDamaged.png');
  this.load.image('boss-cannon-destroyed','./assets/sprites/premium/runtime/boss01/cannonDestroyed.png');
  this.load.image('enemy-gun-premium','./assets/sprites/premium/runtime/boss01/areaMecha.png');
  this.load.image('enemy-heli-premium','./assets/sprites/premium/runtime/boss01/areaHelicopter.png');
  this.load.image('enemy-sub-premium','./assets/sprites/premium/runtime/boss01/areaSubmarine.png');
  this.load.image('island-premium','./assets/sprites/premium/runtime/terrain/island_river.png');
  this.load.image('shore-turret-premium','./assets/sprites/premium/runtime/shore/turret.png');
  this.load.image('shore-tank-premium','./assets/sprites/premium/runtime/shore/tank.png');
  this.load.image('player-bolt-premium','./assets/sprites/premium/runtime/weapons/player_bolt.png');
  this.load.image('enemy-bolt-premium','./assets/sprites/premium/runtime/weapons/enemy_bolt.png');
  this.load.on('loaderror',(file:Phaser.Loader.File)=>console.warn('Phaser sprite:',file.key));

 }
 create(){
  if(this.textures.exists('explosion-premium')&&!this.anims.exists('riverstorm-premium-explosion')){
   this.anims.create({key:'riverstorm-premium-explosion',frames:this.anims.generateFrameNumbers('explosion-premium',{start:0,end:11}),frameRate:18,repeat:0});
  }
  const premiumKeys=['fighter-premium','explosion-premium','water-premium','bank-left-premium','bank-right-premium','boss-1-premium','boss-tower-left','boss-tower-right','boss-tower-fire','boss-cannon','boss-cannon-fire','boss-cannon-damaged','boss-cannon-destroyed','enemy-gun-premium','enemy-heli-premium','enemy-sub-premium','island-premium','shore-turret-premium','shore-tank-premium','player-bolt-premium','enemy-bolt-premium'];
  const premiumCount=premiumKeys.filter(key=>this.textures.exists(key)).length;
  const status=document.getElementById('phaser-status');
  if(status)status.textContent='Sprites Arcade Premium carregados: '+premiumCount+'/'+premiumKeys.length+'. Boss 01, inimigos, água, margens, ilhas, projéteis e defesas de margem usam raster real.';
  this.cameras.main.setBackgroundColor('#0c233c');
  this.add.rectangle(WIDTH/2,HEIGHT/2,270,HEIGHT,0x12546a);
  for(let i=0;i<7;i++)this.waterTiles.push(this.add.image(WIDTH/2,i*157-157,'water-premium').setDisplaySize(280,410).setDepth(-1));
  for(let i=0;i<3;i++){
   this.banks.push(this.add.image(65,i*493-246,'bank-left-premium').setDisplaySize(130,493));
   this.banks.push(this.add.image(WIDTH-65,i*493-246,'bank-right-premium').setDisplaySize(130,493));
  }
  // Ilhas compactas e irregulares, distribuídas pelo canal com corredores livres.
  for(const [x,y,size] of [[165,-115,58],[352,88,74],[264,280,50],[190,474,82],[362,645,58],[176,830,68]] as const){
   this.islands.push(this.add.image(x,y,'island-premium').setDisplaySize(size,size).setDepth(1));
  }
  // Defesas de margem: duas torres estáveis e dois tanques que patrulham visualmente.
  for(const [x,y,kind,side,phase] of [[82,80,'tower',-1,0],[458,295,'tank',1,1.7],[80,575,'tank',-1,3.2],[458,770,'tower',1,4.5]] as const){
   const sprite=this.add.image(x,y,kind==='tower'?'shore-turret-premium':'shore-tank-premium')
    .setDisplaySize(kind==='tower'?54:70,kind==='tower'?54:47).setDepth(2);
   this.shoreUnits.push({sprite,kind,side,anchorX:x,fireAt:900+phase*190,phase});
  }
  this.boss=this.add.image(WIDTH/2,145,'boss-1-premium').setDisplaySize(360,137).setDepth(3);
  this.boss.setInteractive();
  this.bossModules=[
   this.add.image(WIDTH/2-118,137,'boss-tower-left').setDisplaySize(61,61).setDepth(4),
   this.add.image(WIDTH/2+118,137,'boss-tower-right').setDisplaySize(61,61).setDepth(4),
   this.add.image(WIDTH/2,118,'boss-cannon').setDisplaySize(72,72).setDepth(4)
  ];
  this.ship=this.add.triangle(WIDTH/2,HEIGHT-130,0,42,28,0,56,42,0x96e7f2);
  this.ship.setStrokeStyle(3,0xfed084);
  this.ship.setAlpha(0); // Hitbox original intacta; a nave SVG e somente visual.
  const fighterTexture=this.textures.exists('fighter-premium')?'fighter-premium':'fighter';
  this.shipVisual=this.add.image(this.ship.x,this.ship.y,fighterTexture).setDisplaySize(52,61).setDepth(5);
  // HUD ancorado no rodapé, evitando qualquer sobreposição com o boss.
  this.add.rectangle(WIDTH/2,HEIGHT-31,WIDTH,62,0x061221,.93).setDepth(9);
  this.hud=this.add.text(12,HEIGHT-49,'',{fontFamily:'monospace',fontSize:'15px',color:'#f2f9ff',wordWrap:{width:WIDTH-24}}).setDepth(10);
  this.bossBar=this.add.graphics().setDepth(10);
  this.add.text(WIDTH/2,14,'BOSS 01 · PONTE FORTIFICADA · RASTER PREMIUM',{fontFamily:'monospace',fontSize:'13px',color:'#c5f4ff'}).setOrigin(.5,0).setDepth(10);
  this.keys=this.input.keyboard!.createCursorKeys();
  this.wasd=this.input.keyboard!.addKeys('W,A,S,D,SPACE') as typeof this.wasd;
  this.input.keyboard!.on('keydown-R',()=>this.scene.restart());
  this.input.keyboard!.on('keydown-ONE',()=>this.boss.setTexture('boss-1-premium'));
  this.input.keyboard!.on('keydown-TWO',()=>this.boss.setTexture('boss-2'));
  this.input.keyboard!.on('keydown-THREE',()=>this.boss.setTexture('boss-3'));
  this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.pointerActive=true;this.pointerFiring=true;this.pointerIsMouse=this.isMousePointer(p);this.pointerX=p.x;this.pointerY=p.y;});
  this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(this.isMousePointer(p)||p.isDown){this.pointerActive=true;this.pointerIsMouse=this.isMousePointer(p);this.pointerX=p.x;this.pointerY=p.y;}});
  this.input.on('pointerup',()=>{this.pointerFiring=false;if(!this.pointerIsMouse)this.pointerActive=false});
  this.input.on('gameout',()=>{this.pointerActive=false;this.pointerFiring=false});
  this.game.events.once(Phaser.Core.Events.DESTROY,()=>{this.pointerActive=false;this.pointerFiring=false});
  // A arena permanece isolada: campanha, missões e controles originais não são alterados.
 }
 private burst(x:number,y:number,size=88){
  if(!this.textures.exists('explosion-premium')||!this.anims.exists('riverstorm-premium-explosion'))return;
  const fx=this.add.sprite(x,y,'explosion-premium').setDisplaySize(size,size).setDepth(8);
  fx.once(Phaser.Animations.Events.ANIMATION_COMPLETE,()=>fx.destroy());
  fx.play('riverstorm-premium-explosion');
 }
 private impact(x:number,y:number,hostile:boolean){
  // Impactos são pequenos para não mascarar tiros; destruições usam tamanhos maiores.
  this.burst(x,y,hostile?42:36);
 }
 private isMousePointer(pointer:Phaser.Input.Pointer){
  return (pointer as Phaser.Input.Pointer & {pointerType?:string}).pointerType==='mouse';
 }
 private shoot(x:number,y:number,hostile:boolean,damage:number,vx=0,vy=hostile?5:-12){
  if(this.shots.length>=90)return;
  const key=hostile?'enemy-bolt-premium':'player-bolt-premium';
  const width=hostile?11:9,height=hostile?24:29;
  const glow=this.add.image(x,y,key).setDisplaySize(width*2.15,height*1.45).setAlpha(.20).setBlendMode(Phaser.BlendModes.ADD).setDepth(5);
  const sprite=this.add.image(x,y,key).setDisplaySize(width,height).setDepth(6);
  this.shots.push({sprite,glow,vx,vy,damage,hostile,trailAt:0});
 }
 private shootAt(x:number,y:number,targetX:number,targetY:number){
  const angle=Phaser.Math.Angle.Between(x,y,targetX,targetY);
  this.shoot(x,y,true,1,Math.cos(angle)*3.4,Math.sin(angle)*3.4);
 }
 private spawnTrail(b:Bullet){
  const trail=this.add.image(b.sprite.x-b.vx*2,b.sprite.y-b.vy*2,b.hostile?'enemy-bolt-premium':'player-bolt-premium')
   .setDisplaySize(b.hostile?14:11,b.hostile?25:30).setAlpha(.23).setBlendMode(Phaser.BlendModes.ADD).setDepth(4);
  this.tweens.add({targets:trail,alpha:0,scaleX:.35,scaleY:.35,duration:120,onComplete:()=>trail.destroy()});
 }
 private spawnWave(time:number){
  const types=['enemy-gun-premium','enemy-heli-premium','enemy-sub-premium'];
  const key=types[Math.floor(time/7000)%3];
  const sprite=this.add.image(55+Math.random()*(WIDTH-110),-45,key).setDisplaySize(key==='enemy-sub-premium'?76:58,66);
  this.enemies.push({sprite,hp:3,speed:1.35+Math.min(2,time/30000),fireAt:time+550});
 }
 private damage(amount:number,time:number){
  if(this.ended||time<this.invulnerableUntil)return;
  this.lives-=amount;this.invulnerableUntil=time+900;
  this.burst(this.ship.x,this.ship.y,70);
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
  this.ship.x=Phaser.Math.Clamp(this.ship.x,26,WIDTH-26);this.ship.y=Phaser.Math.Clamp(this.ship.y,110,HEIGHT-100);
  this.ship.setFillStyle(time<this.invulnerableUntil?0xff6b71:0x96e7f2);
  this.shipVisual.setPosition(this.ship.x,this.ship.y).setTint(time<this.invulnerableUntil?0xff899a:0xffffff);
  for(const bank of this.banks){bank.y+=1.25*dt;if(bank.y>HEIGHT+246)bank.y-=1479;}
  for(const tile of this.waterTiles){tile.y+=1.25*dt;if(tile.y>HEIGHT+205)tile.y-=1099;}
  for(const [index,island] of this.islands.entries()){
   island.y+=1.25*dt;
   if(island.y>HEIGHT+75){island.y=-90-(index%3)*115;island.x=[165,352,264,190,362,176][index];}
  }
  for(const unit of this.shoreUnits){
   unit.sprite.y+=1.25*dt;
   if(unit.kind==='tank')unit.sprite.x=unit.anchorX+Math.sin(time*.0013+unit.phase)*11;
   if(unit.sprite.y>HEIGHT+50)unit.sprite.y=-70;
   if(time>unit.fireAt&&unit.sprite.y>55&&unit.sprite.y<HEIGHT-155){
    this.shootAt(unit.sprite.x,unit.sprite.y,this.ship.x,this.ship.y);
    unit.fireAt=time+(unit.kind==='tower'?2350:2850);
   }
  }
  if(time>this.nextShot&&(this.keys.space.isDown||this.wasd.SPACE.isDown||this.pointerFiring)){
   this.shoot(this.ship.x,this.ship.y-22,false,1);this.nextShot=time+135;
  }
  if(time>this.nextWave&&this.enemies.length<10){this.spawnWave(time);this.nextWave=time+1200;}
  if(time>this.bossAttackAt){
   this.shoot(this.boss.x+Math.sin(time*.001)*45,this.boss.y+55,true,1);
   this.bossModules[2]?.setTexture('boss-cannon-fire');
   this.bossModules[0]?.setTexture('boss-tower-fire');
   this.time.delayedCall(140,()=>{if(!this.ended){this.bossModules[2]?.setTexture('boss-cannon');this.bossModules[0]?.setTexture('boss-tower-left');}});
   this.bossAttackAt=time+900;
  }
  for(let i=this.enemies.length-1;i>=0;i--){
   const e=this.enemies[i];e.sprite.y+=e.speed*dt;
   if(time>e.fireAt&&e.sprite.y>50&&e.sprite.y<HEIGHT-140){this.shoot(e.sprite.x,e.sprite.y+22,true,1);e.fireAt=time+1600;}
   if(e.sprite.y>HEIGHT+50){e.sprite.destroy();this.enemies.splice(i,1);continue;}
   if(Phaser.Math.Distance.Between(e.sprite.x,e.sprite.y,this.ship.x,this.ship.y)<36){this.damage(1,time);e.sprite.destroy();this.enemies.splice(i,1);}
  }
  for(let i=this.shots.length-1;i>=0;i--){
   const b=this.shots[i];b.sprite.x+=b.vx*dt;b.sprite.y+=b.vy*dt;b.glow.setPosition(b.sprite.x,b.sprite.y);
   if(time>b.trailAt){this.spawnTrail(b);b.trailAt=time+62;}
   if(b.sprite.x<-45||b.sprite.x>WIDTH+45||b.sprite.y<-60||b.sprite.y>HEIGHT+50){b.sprite.destroy();b.glow.destroy();this.shots.splice(i,1);continue;}
   if(b.hostile){
    if(Phaser.Math.Distance.Between(b.sprite.x,b.sprite.y,this.ship.x,this.ship.y)<28){this.impact(b.sprite.x,b.sprite.y,true);this.damage(1,time);b.sprite.destroy();b.glow.destroy();this.shots.splice(i,1);}
   }else{
    let hit=false;
    for(let j=this.enemies.length-1;j>=0;j--){const e=this.enemies[j];if(Phaser.Math.Distance.Between(b.sprite.x,b.sprite.y,e.sprite.x,e.sprite.y)<35){e.hp-=b.damage;hit=true;if(e.hp<=0){this.burst(e.sprite.x,e.sprite.y,96);e.sprite.destroy();this.enemies.splice(j,1);this.points+=100;}else this.impact(b.sprite.x,b.sprite.y,false);break;}}
    if(!hit&&Math.abs(b.sprite.x-this.boss.x)<65&&Math.abs(b.sprite.y-this.boss.y)<63){this.bossHp-=b.damage;this.impact(b.sprite.x,b.sprite.y,false);hit=true;this.points+=5;}
    if(hit){b.sprite.destroy();b.glow.destroy();this.shots.splice(i,1);}
   }
  }
  if(this.bossDamageStage===0&&this.bossHp<=120){this.bossDamageStage=1;this.burst(this.bossModules[0].x,this.bossModules[0].y,126);this.bossModules[0].setAlpha(.58);}
  if(this.bossDamageStage===1&&this.bossHp<=65){this.bossDamageStage=2;this.burst(this.bossModules[2].x,this.bossModules[2].y,154);this.bossModules[2].setTexture('boss-cannon-destroyed');}
  if(this.bossHp<=0){
   this.burst(this.bossModules[1].x,this.bossModules[1].y,142);this.burst(this.boss.x,this.boss.y,250);
   this.bossHp=180;this.bossDamageStage=0;this.points+=2000;this.boss.setTexture(['boss-1-premium','boss-2','boss-3'][Math.floor(this.points/2000)%3]);
   this.bossModules[0].setAlpha(1).setTexture('boss-tower-left');this.bossModules[2].setTexture('boss-cannon');
  }
  this.bossBar.clear();
  this.bossBar.fillStyle(0x071321,.94).fillRoundedRect(105,36,330,14,5);
  this.bossBar.fillStyle(0xff805a,1).fillRoundedRect(108,39,324*Phaser.Math.Clamp(this.bossHp/180,0,1),8,3);
  this.hud.setText('HP '+this.lives+'  •  PTS '+this.points+'  •  '+Math.round(this.game.loop.actualFps)+' FPS');
 }
}
new Phaser.Game({
 type:Phaser.AUTO,parent:'phaser-stage',width:WIDTH,height:HEIGHT,
 backgroundColor:'#06101f',
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
 scene:[PhaserArena],
 render:{pixelArt:false,antialias:true}
});
