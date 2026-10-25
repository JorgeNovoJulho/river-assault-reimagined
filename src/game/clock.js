/* Fixed-step simulation clock with bounded catch-up. Works in browsers and WebViews. */
(function(global){
'use strict';
class RiverClock {
 constructor(options={}) {
  this.stepMs=options.stepMs||1000/60;
  this.maxSteps=options.maxSteps||4;
  this.last=null;
  this.accumulator=0;
  this.droppedFrames=0;
 }
 reset(){this.last=null;this.accumulator=0}
 advance(timestamp, callback){
  if(!Number.isFinite(timestamp))return 0;
  if(this.last===null){this.last=timestamp;return 0}
  const delta=Math.max(0,Math.min(250,timestamp-this.last));
  this.last=timestamp;
  this.accumulator+=delta;
  let steps=0;
  while(this.accumulator+1e-7>=this.stepMs && steps<this.maxSteps){
   callback(this.stepMs/1000);
   this.accumulator-=this.stepMs;
   steps++;
  }
  if(this.accumulator>=this.stepMs){
   this.droppedFrames++;
   this.accumulator=this.accumulator%this.stepMs;
  }
  return steps;
 }
}
global.RiverClock=RiverClock;
})(window);
