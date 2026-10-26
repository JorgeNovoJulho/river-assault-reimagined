const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('RiverStorm inline JavaScript parses',()=>{
 const html=read('index.html');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(s=>s.trim());
 assert.ok(scripts.length>0);
 for(const source of scripts)new vm.Script(source);
});
test('visual quality includes all supported profiles',()=>{
 const html=read('index.html');
 for(const name of ['eco','balanced','enhanced'])assert.match(html,new RegExp('value="'+name+'"'));
 assert.match(html,/function beginLogicalFrame\(/);
 assert.match(html,/devicePixelRatio/);
});
test('campaign, saves and bundled soundtrack remain wired',()=>{
 const html=read('index.html');
 assert.match(html,/writeCheckpoint/);
 assert.match(html,/RiverCampaign/);
 assert.match(html,/src\/audio\/playlist\.js/);
 const music=read('src/audio/playlist.js');
 for(let n=1;n<=14;n++)assert.ok(music.includes('track-'+String(n).padStart(2,'0')+'.opus'));
});
test('scene renderer parses and differentiates quality',()=>{
 const source=read('src/render/scene2d5.js');
 new vm.Script(source);
 assert.match(source,/quality==='enhanced'/);
 assert.match(source,/quality==='eco'/);
});
test('river graphics use deterministic current and shoreline detail without gameplay mutation',()=>{
 const source=read('src/render/scene2d5.js');
 assert.match(source,/function waterMotion\(/);
 assert.match(source,/function bankDetails\(/);
 assert.match(source,/waterMotion\(c,points,w,h,distance,quality,t\)/);
 assert.match(source,/bankDetails\(c,points,w,h,distance,quality,t\)/);
 assert.doesNotMatch(source.slice(source.indexOf('function waterMotion'),source.indexOf('function landscape')),/Math\.random/);
});

test('visual 03: dam and bridge share a traversable opening',()=>{
 const html=read('index.html');
 assert.match(html,/const passage=Math.max\(player.width\+50/);
 assert.match(html,/Math.abs\(player.x-p.x\)<p.opening\/2-player.width\/2/);
 assert.match(html,/PASSAGEM/);
 assert.match(html,/function drawStructures\(/);
 const renderer=read('src/render/scene2d5.js');
 assert.match(renderer,/drawIslands\(c,items,sector\)/);
 assert.match(renderer,/const icy=\/ÁRTICO/);
});

test('approved compact HUD occupies bottom and preserves control ids',()=>{
 const html=read('index.html');
 assert.match(html,/id="compact-hud"/);
 assert.match(html,/id="rs-bottom-actions"/);
 assert.match(html,/id="hud-score"/);
 assert.match(html,/id="boss-special-hud"/);
 assert.match(html,/function drawHUD\(/);
 for(const id of ['hi-score-text','crt-toggle','controller-settings-btn','track-next','music-library','music-toggle','sound-toggle'])
   assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1);
 assert.ok(html.indexOf('id="compact-hud"')>html.indexOf('id="game-over-screen"'));
});

test('gameplay 045: dams spaced, shots held, banks targetable',()=>{
 const html=read('index.html');
 assert.match(html,/structureGap=2800/);
 assert.match(html,/islandGap=720/);
 assert.match(html,/mouseInput\.fire \|\| keys\.Space \|\| keys\.KeyZ \|\| touchFireHeld/);
 assert.match(html,/touchFireButton\.addEventListener\('pointerdown'/);
 assert.match(html,/e\.type === 'SHIP' \|\| e\.type === 'TURRET'/);
 assert.match(html,/e\.y>=5 && e\.y<VIRTUAL_HEIGHT-90/);
 assert.match(html,/HUD 0\.4\.9/);
});

test('hotfix 1: pickup spacing and visual types are enforced',()=>{
 const html=read('index.html');
 assert.match(html,/pickupLaneClear\(200\)/);
 assert.match(html,/pickupLaneClear\(190\)/);
 assert.match(html,/rescueBoatsLastAt=distance/);
 for(const type of ['BOMB','SHIELD','SPREAD','LIFE','WINGMAN'])assert.ok(html.includes(type+':{color:'));
 assert.match(html,/mouseFireHeld/);
 assert.match(html,/const corridor=Math.max\(96,player.width\+55\)/);
});

test('boss hud 047: compact boss bars without full width overlay',()=>{
 const html=read('index.html');
 assert.match(html,/width=Math.min\(92,Math.max\(66,e.width\*\.76\)\)/);
 assert.match(html,/charge>=\.99/);
 assert.doesNotMatch(html,/ESPECIAL DO CHEFE · RECARGA/);
 assert.match(html,/boss-dialogue-strip/);
 const scene=read('src/render/scene2d5.js');
 assert.doesNotMatch(scene,/c\.fillRect\(e.x-e.width\/2,e.y-e.height\/2-9,e.width,5\)/);
});

test('boss UI fix: active renderer uses compact meters and synthesized boss voices',()=>{
 const html=read('index.html');
 assert.match(html,/function drawBossCompactMeters\(/);
 assert.match(html,/drawBossCompactMeters\(\);/);
 assert.match(html,/const width=80,y=e.y-e.height\/2-34/);
 assert.match(html,/function bossRobotVoice\(/);
 assert.match(html,/bossRobotVoice\(e,true\)/);
 assert.match(html,/115\)/);
 assert.match(html,/window.addEventListener\('pointermove'/);
});

test('boss abilities 049: persistent unlocks, mandatory selection and elemental gameplay',()=>{
 const html=read('index.html');
 for(const skill of ['EMP','LIGHTNING','GRAVITY','ICE','FIRE','BLEED'])
   assert.match(html,new RegExp(skill+":\\{icon:"));
 assert.match(html,/river_boss_skills_v1/);
 assert.match(html,/function openBossSkillPicker\(/);
 assert.match(html,/function useBossSkill\(/);
 assert.match(html,/gameState='BOSS_SELECT'/);
 assert.match(html,/spawnBoss\(0,true\)/);
 assert.match(html,/bossSkillCooldown=skill.cooldown/);
 assert.match(html,/boss\.gravityTicks=180/);
 assert.match(html,/e\.bleedClock>=180/);
 assert.match(html,/unlockBossSkill\(e.skillAffinity\)/);
 assert.match(html,/boss-skill-picker/);
 assert.match(html,/e\.code==='KeyC'/);
});
