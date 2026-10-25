/* Trilha ORIGINAL estilo 16-bit, sintetizada em Web Audio, sem arquivos externos. */
(function(root){'use strict';
class RiverMusic {
 constructor(){this.ctx=null;this.master=null;this.loopTimer=null;this.next=0;this.step=0;this.enabled=true;this.bpm=148;this.interval=60/this.bpm/4;this.running=false;this.notes=[0,2,4,7,9,7,4,2,0,4,7,12,11,7,4,2,5,7,9,12,14,12,9,7,4,7,9,11,12,9,7,4];}
 start(){if(this.running||!this.enabled)return;try{
 const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
 if(!this.ctx)this.ctx=new Audio();this.ctx.resume();
 this.master=this.ctx.createGain();this.master.gain.value=.085;this.master.connect(this.ctx.destination);
 this.running=true;this.next=this.ctx.currentTime+.05;this.schedule();
 }catch(e){this.running=false}}
 tone(midi,time,duration,type='square',gain=.16){
 const o=this.ctx.createOscillator(),v=this.ctx.createGain(),lp=this.ctx.createBiquadFilter();
 o.type=type;o.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),time);
 lp.type='lowpass';lp.frequency.value=type==='sawtooth'?2600:4000;
 v.gain.setValueAtTime(.0001,time);v.gain.exponentialRampToValueAtTime(gain,time+.012);
 v.gain.exponentialRampToValueAtTime(.0001,time+duration);
 o.connect(lp);lp.connect(v);v.connect(this.master);o.start(time);o.stop(time+duration+.025);
 }
 schedule(){if(!this.running)return;let n=0;
 while(this.next<this.ctx.currentTime+.18&&n++<48){
 const st=this.step++,bar=st%64,tonic=[50,53,45,48][Math.floor(st/64)%4];
 if(bar%2===0)this.tone(tonic+this.notes[(Math.floor(st/2))%32]+12,this.next,this.interval*1.7,'square',.20);
 if(bar%4===0)this.tone(tonic-12+(bar%16===8?7:0),this.next,this.interval*3.3,'triangle',.28);
 if(bar%8===4)this.tone(tonic+7,this.next,this.interval*2.3,'sawtooth',.055);
 if(bar%4===2)this.tone(tonic+24,this.next,this.interval*.3,'triangle',.032);
 this.next+=this.interval;
 }
 this.loopTimer=setTimeout(()=>this.schedule(),70);
 }
 stop(){this.running=false;clearTimeout(this.loopTimer);if(this.master){try{this.master.gain.setTargetAtTime(.0001,this.ctx.currentTime,.05)}catch(e){}}}
 toggle(){this.enabled=!this.enabled;if(!this.enabled)this.stop();else this.start();return this.enabled}
}
root.RiverMusic=RiverMusic;
})(window);
