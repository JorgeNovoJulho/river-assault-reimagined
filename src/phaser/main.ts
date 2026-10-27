import Phaser from 'phaser';

const width=540,height=960;
const sampleAssets=[
  ['boss-1','assets/sprites/bosses/iron-wasp.svg'],
  ['boss-2','assets/sprites/bosses/abyss-manta.svg'],
  ['boss-3','assets/sprites/bosses/crimson-rotor.svg'],
  ['enemy-gun','assets/sprites/enemies/mecha-gun.svg'],
  ['enemy-heli','assets/sprites/enemies/helicopter.svg'],
  ['enemy-sub','assets/sprites/enemies/submarine.svg'],
  ['island','assets/sprites/terrain/island-tropical.svg'],
  ['beam','assets/sprites/projectiles/plasma-blue.svg']
] as const;
class GraphicsLab extends Phaser.Scene {
  private ship!: Phaser.GameObjects.Triangle;
  private boss!: Phaser.GameObjects.Image;
  private status!: Phaser.GameObjects.Text;
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor(){super('GraphicsLab')}
  preload(){
    for(const [key,file] of sampleAssets) this.load.svg(key,'./'+file);
    this.load.on('loaderror',(file: Phaser.Loader.File)=>console.warn('Sprite indisponível',file.key));
  }
  create(){
    this.cameras.main.setBackgroundColor('#0c2340');
    this.add.rectangle(270,480,240,960,0x115778);
    for(let i=0;i<8;i++) {
      const island=this.add.image(i%2?150:385,90+i*125,'island').setDisplaySize(130,90);
      island.setAlpha(.9);
    }
    this.boss=this.add.image(270,190,'boss-1').setDisplaySize(185,185);
    this.add.image(180,340,'enemy-gun').setDisplaySize(65,75);
    this.add.image(365,430,'enemy-heli').setDisplaySize(74,76);
    this.add.image(220,540,'enemy-sub').setDisplaySize(100,65);
    this.ship=this.add.triangle(270,810,0,40,28,0,56,40,0x93edff).setStrokeStyle(3,0xf5c673);
    this.status=this.add.text(15,15,'LAB PHASER — sprites carregados',{fontFamily:'system-ui',fontSize:'19px',color:'#ffffff'});
    this.add.text(15,52,'Setas / WASD: mover · 1,2,3: alterar boss',{fontFamily:'system-ui',fontSize:'14px',color:'#d5eeff'});
    this.keys=this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on('keydown-ONE',()=>this.boss.setTexture('boss-1'));
    this.input.keyboard!.on('keydown-TWO',()=>this.boss.setTexture('boss-2'));
    this.input.keyboard!.on('keydown-THREE',()=>this.boss.setTexture('boss-3'));
    document.getElementById('phaser-status')!.textContent='Motor Phaser inicializado. Este laboratório ainda não contém a campanha.';
  }
  update(_:number,delta:number){
    const speed=delta*.28;
    const kb=this.input.keyboard!;
    if(this.keys.left.isDown||kb.addKey('A').isDown)this.ship.x-=speed;
    if(this.keys.right.isDown||kb.addKey('D').isDown)this.ship.x+=speed;
    if(this.keys.up.isDown||kb.addKey('W').isDown)this.ship.y-=speed;
    if(this.keys.down.isDown||kb.addKey('S').isDown)this.ship.y+=speed;
    this.ship.x=Phaser.Math.Clamp(this.ship.x,18,width-18);
    this.ship.y=Phaser.Math.Clamp(this.ship.y,65,height-18);
    this.status.setText('PHASER + TS | '+Math.round(this.game.loop.actualFps)+' FPS (laboratório)');
  }
}
new Phaser.Game({
  type:Phaser.AUTO,
  parent:'phaser-stage',
  width,height,
  backgroundColor:'#06101f',
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
  scene:[GraphicsLab],
  render:{pixelArt:false,antialias:true}
});
