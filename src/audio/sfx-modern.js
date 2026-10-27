/* River Assault - FX procedural leve (camadas tonais, ruído filtrado e subgrave). */
(function(w){'use strict';
let ctx=null,noiseBuffer=null,last=0;
function get(){try{const A=w.AudioContext||w.webkitAudioContext;if(!A)return null;ctx=ctx||new A();if(ctx.state==='suspended')ctx.resume();return ctx}catch(e){return null}}
function tone(freq=330,duration=.16,type='sawtooth',end=120,gain=.09,delay=0){
 const c=get();if(!c)return;try{
 const t=c.currentTime+delay,o=c.createOscillator(),v=c.createGain(),lp=c.createBiquadFilter();
 o.type=type;o.frequency.setValueAtTime(Math.max(36,freq),t);o.frequency.exponentialRampToValueAtTime(Math.max(35,end),t+duration);
 lp.type='lowpass';lp.frequency.value=2100;
 v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(Math.max(.0002,gain*(w.RiverSFX?.volume??.65)),t+.013);v.gain.exponentialRampToValueAtTime(.0001,t+duration);
 o.connect(lp);lp.connect(v);v.connect(c.destination);o.start(t);o.stop(t+duration+.02);
 }catch(e){}
}
function noise(duration=.19,gain=.1,low=600,high=5000,delay=0){
 const c=get();if(!c)return;try{
 const t=c.currentTime+delay,frames=Math.ceil(c.sampleRate*duration);
 const b=c.createBuffer(1,frames,c.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<frames;i++)d[i]=Math.random()*2-1;
 const src=c.createBufferSource(),band=c.createBiquadFilter(),amp=c.createGain();
 src.buffer=b;band.type='bandpass';band.frequency.value=Math.sqrt(low*high);band.Q.value=.65;
 amp.gain.setValueAtTime(.0001,t);amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),t+.015);amp.gain.exponentialRampToValueAtTime(.0001,t+duration);
 src.connect(band);band.connect(amp);amp.connect(c.destination);src.start(t);src.stop(t+duration+.02);
 }catch(e){}
}
w.RiverSFX={volume:.65,
 status(kind){
  const pitches={EMP:[185,65],LIGHTNING:[1150,240],ICE:[860,115],FIRE:[240,85],BLEED:[450,125],POISON:[130,70],PRISM:[940,610],SHADOW:[125,45],GRAVITY:[105,38]};
  const p=pitches[kind];if(!p)return;
  tone(p[0],.21,kind==='GRAVITY'||kind==='SHADOW'?'sine':'triangle',p[1],.055);
  if(['FIRE','LIGHTNING','BLEED','EMP'].includes(kind))noise(.14,.038,kind==='FIRE'?160:500,3600);
 },
 weapon(name){
  const t=Date.now();if(t-last<70)return;last=t;
  if(/LASER|BEAM|PULSE/.test(name)){tone(1320,.19,'sawtooth',300,.047);tone(1100,.12,'sine',520,.025,.012)}
  else if(/MISSILE|ROCKET|PRECISION|TRACKER/.test(name)){noise(.18,.065,350,2400);tone(220,.26,'sawtooth',55,.067)}
  else if(/CIRCLE|MULTI|HYBRID/.test(name)){tone(890,.16,'triangle',220,.065);noise(.07,.035,500,5500)}
  else if(/RAPID|BURST|NEEDLE/.test(name)){noise(.072,.052,400,7200);tone(290,.11,'triangle',90,.052)}
  else{noise(.045,.042,850,6300);tone(440,.11,'triangle',160,.045)}
 },
 impact(){noise(.48,.15,45,2200);tone(120,.55,'sawtooth',37,.16);tone(67,.36,'sine',35,.13,.045)},
 collect(){tone(620,.16,'sine',840,.08);tone(930,.19,'triangle',1150,.075,.09)},
 shield(){noise(.16,.05,900,3800);tone(400,.26,'triangle',110,.065)},
 alert(){for(let i=0;i<4;i++){tone(i%2?420:650,.24,'sawtooth',i%2?610:360,.12,i*.3);noise(.09,.03,600,2400,i*.3)}},
 engine(){tone(79,.14,'sine',71,.025)}
};
w.RiverVoice={chirp(){const syllables=6+Math.floor(Math.random()*4);for(let i=0;i<syllables;i++){const base=90+Math.random()*150;const delay=i*.095;tone(base,.09,'sawtooth',base*(.65+Math.random()*.5),.065,delay);tone(base*1.48,.06,'square',base*.7,.022,delay+.018);}}};
})(window);
