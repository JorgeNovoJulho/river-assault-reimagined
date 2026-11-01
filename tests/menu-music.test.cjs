const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
test('menu music retries blocked autoplay on gesture, loops through selection and stops for campaign',async()=>{
 class Audio {
  constructor(src){this.src=src;this.paused=true;this.calls=0;this.block=true;}
  addEventListener(){}
  play(){this.calls++;if(this.block)return Promise.reject(Object.assign(Error('gesture'),{name:'NotAllowedError'}));this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
 }
 const ctx={window:{},Audio,document:{getElementById:()=>null}};
 vm.runInNewContext(fs.readFileSync('src/audio/music.js','utf8'),ctx);
 const music=new ctx.window.RiverMenuMusic();
 const settle=()=>new Promise(resolve=>setImmediate(resolve));
 music.sync(true,true,.4);await settle();assert.equal(music.blocked,true);
 music.sync(true,true,.4);assert.equal(music.audio.calls,1);
 music.audio.block=false;music.sync(true,true,.4,true);await settle();
 assert.equal(music.audio.paused,false);assert.equal(music.audio.loop,true);
 music.sync(true,true,.2);assert.equal(music.audio.calls,2);assert.equal(music.audio.volume,.2);
 music.stop();assert.equal(music.audio.paused,true);
 music.sync(false,true,.2);assert.equal(music.audio.calls,2);
 music.sync(true,true,.2);await settle();assert.equal(music.audio.paused,false);
 music.sync(true,false,.2);assert.equal(music.audio.paused,true);
});
