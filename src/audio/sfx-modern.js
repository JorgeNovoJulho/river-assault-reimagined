/* Efeitos sintetizados originais, leves, sem arquivos externos. */
(function(w){'use strict';let ctx=null;
function tone(freq=330,duration=.16,type='sawtooth',pitch=0,gain=.09){
 try{const A=w.AudioContext||w.webkitAudioContext;if(!A)return;ctx=ctx||new A();ctx.resume();
 const o=ctx.createOscillator(),v=ctx.createGain(),f=ctx.createBiquadFilter(),now=ctx.currentTime;
 o.type=type;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(35,freq+pitch),now+duration);
 f.type='lowpass';f.frequency.value=2600;v.gain.setValueAtTime(.001,now);v.gain.linearRampToValueAtTime(gain,now+.012);v.gain.exponentialRampToValueAtTime(.001,now+duration);
 o.connect(f);f.connect(v);v.connect(ctx.destination);o.start(now);o.stop(now+duration+.02)}catch(e){}
}
w.RiverSFX={
 weapon(name){if(/LASER|BEAM|PULSE/.test(name))tone(950,.2,'sawtooth',-730,.05);
 else if(/MISSILE|ROCKET|PRECISION/.test(name))tone(190,.32,'sawtooth',-130,.075);
 else if(/RAPID|BURST|NEEDLE/.test(name))tone(510,.085,'square',-240,.04);
 else tone(670,.12,'triangle',-400,.06)},
 impact(){tone(105,.38,'sawtooth',-68,.14);setTimeout(()=>tone(62,.28,'triangle',-25,.08),65)},
 collect(){tone(550,.15,'triangle',350,.08);setTimeout(()=>tone(890,.18,'sine',120,.07),100)}
};
w.RiverVoice={chirp(){for(let i=0;i<5;i++)setTimeout(()=>tone(160+i%3*95,.085,'sawtooth',i%2?120:-45,.033),i*100)}};
})(window);
