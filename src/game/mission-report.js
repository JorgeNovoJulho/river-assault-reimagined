/* Histórico de impactos da campanha, incluindo missões ausentes em saves antigos. */
(function(global){
'use strict';
const total=20;
const points={SS:100,S:92,A:82,B:70,C:55,D:35,E:10};
const medals={
 SS:{id:'gold',name:'Ouro',points:10000},
 S:{id:'silver',name:'Prata',points:5000},
 A:{id:'bronze',name:'Bronze',points:2500}
};
function grade(hits){
 if(hits===null)return null;
 return hits===0?'SS':hits<=2?'S':hits<=4?'A':hits<=7?'B':hits<=11?'C':hits<=16?'D':'E';
}
function restore(saved,sector){
 const entries=Array.from({length:total},(_,index)=>{
  const value=Array.isArray(saved)?saved[index]:null;
  return Number.isSafeInteger(value)&&value>=0?value:null;
 });
 entries[sector-1]??=0;
 return entries;
}
function summary(entries){
 const recorded=entries.filter(value=>value!==null);
 if(!recorded.length)return {recorded:0,rank:null,average:null};
 const average=recorded.reduce((sum,value)=>sum+points[grade(value)],0)/recorded.length;
 const rank=average>=99?'SS':average>=90?'S':average>=80?'A':average>=68?'B':average>=52?'C':average>=30?'D':'E';
 return {recorded:recorded.length,rank,average};
}
function bossBonus(rank){return rank==='SS'||rank==='S'?500:0;}
function campaignMedal(result){return result.recorded===total?medals[result.rank]||null:null;}
function trophies(saved,legacyWins){
 const count=value=>Number.isSafeInteger(value)&&value>=0?value:0;
 const best=saved?.best;
 const validBest=Number.isInteger(best?.mission)&&best.mission>=1&&best.mission<=total&&
  Number.isSafeInteger(best.hits)&&best.hits>=0;
 return {
  completed:saved?.completed==null?count(legacyWins):count(saved.completed),
  medals:Object.fromEntries(Object.values(medals).map(({id})=>[id,count(saved?.medals?.[id])])),
  best:validBest?{mission:best.mission,hits:best.hits}:null
 };
}
function recordMission(trophy,mission,hits){
 if(!trophy.best||hits<trophy.best.hits||hits===trophy.best.hits&&mission<trophy.best.mission){
  trophy.best={mission,hits};
 }
}
global.RiverMissionReport={grade,restore,summary,bossBonus,campaignMedal,trophies,recordMission,medals};
})(globalThis);
