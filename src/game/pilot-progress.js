/* Núcleo de progressão do piloto: matemática pura, sem DOM ou armazenamento. */
(function(root){
  'use strict';
  const MAX_LEVEL=100;
  function required(level){return 100+level*22+level*level*2;}
  const thresholds=[0];for(let level=0;level<MAX_LEVEL;level++)thresholds.push(thresholds[level]+required(level));
  function cap(xp){return Math.min(thresholds[MAX_LEVEL],Math.max(0,Math.floor(Number(xp)||0)));}
  function levelFor(xp){
    const amount=cap(xp);
    let low=0,high=MAX_LEVEL;
    while(low<high){const mid=Math.ceil((low+high)/2);if(thresholds[mid]<=amount)low=mid;else high=mid-1;}
    return low;
  }
  function bonus(level){
    const lvl=Math.min(MAX_LEVEL,Math.max(0,Number(level)||0));
    return {damage:1+lvl*.0075,resistance:1-lvl*.0045,fuel:1-lvl*.005};
  }
  root.RiverPilotProgress={MAX_LEVEL,required,threshold:level=>thresholds[Math.max(0,Math.min(MAX_LEVEL,Math.floor(level)))],cap,levelFor,bonus};
})(typeof window!=='undefined'?window:globalThis);
