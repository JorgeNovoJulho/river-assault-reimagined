const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync('src/game/mission-report.js','utf8'),context);
const report=context.RiverMissionReport;

test('salvamento legado deixa missões anteriores sem registro',()=>{
 const entries=report.restore(null,12);
 assert.equal(entries[0],null);
 assert.equal(entries[11],0);
 assert.equal(report.summary(entries).recorded,1);
});
test('restaura impactos válidos e distingue zero de um registro ausente',()=>{
 const restored=report.restore([0,5,-1,'2',8],5);
 assert.deepEqual(Array.from(restored.slice(0,6)),[0,5,null,null,8,null]);
 assert.equal(report.summary(restored).recorded,3);
 assert.equal(report.summary(restored).rank,'B');
 assert.equal(report.grade(null),null);
 assert.equal(report.grade(0),'SS');
});

test('bônus de chefe e medalhas exigem as notas definidas',()=>{
 assert.deepEqual(['SS','S','A','B','C','D','E'].map(report.bossBonus),[500,500,0,0,0,0,0]);
 for(const [hits,rank,id,points] of [[0,'SS','gold',10000],[1,'S','silver',5000],[3,'A','bronze',2500]]){
  const summary=report.summary(Array(20).fill(hits));
  assert.equal(summary.rank,rank);
  const medal=report.campaignMedal(summary);
  assert.equal(medal.id,id);
  assert.equal(medal.points,points);
 }
 assert.equal(report.campaignMedal(report.summary(report.restore(null,20))),null);
 assert.equal(report.campaignMedal(report.summary(Array(20).fill(7))),null);
 assert.equal(report.summary([...Array(19).fill(0),3]).average,99.1);
});
test('troféus migram vitórias pela patente e preservam medalhas existentes',()=>{
 const trophy=report.trophies(null,4);
 assert.equal(trophy.completed,4);
 assert.equal(trophy.medals.gold,0);
 report.recordMission(trophy,9,5);
 report.recordMission(trophy,3,2);
 report.recordMission(trophy,1,6);
 assert.deepEqual({...trophy.best},{mission:3,hits:2});
 trophy.medals.gold++;
 assert.equal(report.trophies(trophy,0).medals.gold,1);
});
