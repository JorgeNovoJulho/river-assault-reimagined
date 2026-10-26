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
 assert.match(html,/HUD 0\.6\.2/);
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

test('visual phase 04: all twenty missions have deterministic biome atmosphere',()=>{
 const renderer=read('src/render/scene2d5.js');
 const html=read('index.html');
 const campaign=read('src/game/campaign.js');
 assert.match(renderer,/const BIOME_DETAILS=\[/);
 assert.match(renderer,/function biomeAtmosphere\(/);
 assert.match(renderer,/biomeAtmosphere\(c,d,t\)/);
 assert.match(renderer,/BIOME_DETAILS,/);
 assert.match(renderer,/c\.save\(\);c\.translate\(x,y\);c\.scale\(scale,scale\)/);
 assert.match(renderer,/c\.restore\(\);/);
 assert.match(html,/HUD 0\.6\.2/);
 assert.match(campaign,/"id": 20/);
 const codes=renderer.match(/\['[A-Z_]+','#[A-Fa-f0-9]+','[^']+'\]/g)||[];
 assert.equal(codes.length,20);
});

test('visual 05: all seven player aircraft and key enemy types render unique details',()=>{
 const scene=read('src/render/scene2d5.js');
 const aircraft=read('src/game/aircraft.js');
 for(const type of ['falcao','vespa','cometa','fenix','helicoptero','disco','titan']){
   assert.match(scene,new RegExp(type+":\\["));
   assert.match(aircraft,new RegExp(type+":\\{name:"));
 }
 for(const type of ['MECHA_SWORD','MECHA_GUN','MEGAZORD','TANK','TURRET','SHIP','SUB','HELI','JET','ZIGZAG'])
   assert.ok(scene.includes(type));
 assert.match(scene,/function aircraftDetails\(/);
 assert.match(scene,/function enemyDetails\(/);
 assert.match(scene,/aircraftDetails\(c,style,trim\)/);
 assert.match(scene,/enemyDetails\(c,e\)/);
 assert.match(read('index.html'),/HUD 0\.6\.2/);
});

test('visual hangar 052: selected planes, portraits, pilot miniatures, visible silhouettes',()=>{
 const html=read('index.html');
 const renderer=read('src/render/scene2d5.js');
 for(const id of ['hangar-plane','pilot-portrait','pilot-body','hangar-stats','hangar-name','pilot-name'])
   assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/function renderHangar\(/);
 assert.match(html,/renderHangar\(\);/);
 assert.match(html,/window\.RiverVisuals/);
 assert.match(html,/HUD 0\.6\.2/);
 for(const plane of ['falcao','vespa','cometa','fenix','helicoptero','disco','titan'])
   assert.match(html,new RegExp(plane+":\\["));
 for(const enemy of ['MECHA_SWORD','MECHA_GUN','TANK','TURRET','BOSS']) assert.ok(renderer.includes(enemy));
});

test('hangar 053: scrollable menu preserves previews on short displays',()=>{
 const html=read('index.html');
 assert.match(html,/#start-screen\{overflow-y:auto!important/);
 assert.match(html,/id="hangar-preview"/);
 assert.match(html,/id="pilot-portrait"/);
 assert.match(html,/id="pilot-body"/);
 assert.match(html,/id="hangar-stats"/);
 assert.match(html,/HUD 0\.6\.2/);
});

test('hangar 054: commands outside scrollable hangar and attribute bars',()=>{
 const html=read('index.html');
 assert.match(html,/id="start-actions"/);
 assert.match(html,/#start-actions\{display:grid!important/);
 assert.match(html,/#start-screen>div:not\(#start-actions\)/);
 for(const id of ['start-btn','menu-settings-btn','hangar-speed-bar','hangar-shield-bar','hangar-range-bar','hangar-fire-bar'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/HUD 0\.6\.2/);
});

test('menu 055: single scroll region prevents giant mission and quality cards',()=>{
 const html=read('index.html');
 assert.match(html,/id="start-main"/);
 assert.match(html,/#start-screen>#start-main>div/);
 assert.match(html,/#start-screen>#start-main\{display:flex!important/);
 assert.match(html,/#start-screen>#start-actions\{flex:0 0 auto!important/);
 assert.match(html,/HUD 0\.6\.2/);
});

test('deployment 056: build-id fingerprint and verifiable published version',()=>{
 const vite=read('vite.config.js');
 const workflow=read('.github/workflows/deploy-pages.yml');
 const html=read('index.html');
 assert.match(vite,/process\.env\.GITHUB_SHA/);
 assert.match(vite,/build-info\.json/);
 assert.match(vite,/riverstorm-build/);
 assert.match(vite,/\.split\('src="\.\/\+'/);
 assert.match(workflow,/build-info\.json/);
 assert.match(workflow,/scene2d5\.js\?build=\$GITHUB_SHA/);
 assert.match(html,/HUD 0\.6\.2/);
});

test('menu 057: desktop columns, mobile single-column and combat HUD hidden',()=>{
 const html=read('index.html');
 for(const id of ['start-brand','start-main','start-actions','hangar-plane','pilot-portrait','pilot-body','hangar-bars'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/#start-screen:not\(\.hidden\)\{position:absolute!important/);
 assert.match(html,/#start-screen #start-brand/);
 assert.match(html,/body:has\(#start-screen:not\(\.hidden\)\) #compact-hud/);
 assert.match(html,/body:has\(#start-screen:not\(\.hidden\)\) #rs-bottom-actions/);
 assert.match(html,/@media\(max-width:720px\)/);
 assert.match(html,/HUD 0\.6\.2/);
});

test('menu 058: uncropped two-line title and useful sidebar panels',()=>{
 const html=read('index.html');
 assert.match(html,/<h1><span>RIVER<\/span><span>STORM<\/span><\/h1>/);
 assert.match(html,/brand-feature/);
 assert.match(html,/#start-brand h1 span/);
 assert.match(html,/HUD 0\.6\.2/);
});

test('combat 059: boss skill animations, synthesized audio and varied enemy waves',()=>{
 const html=read('index.html');
 assert.match(html,/function playBossSkillEffect\(/);
 assert.match(html,/function drawBossSkillEffect\(/);
 assert.match(html,/drawBossSkillEffect\(\);/);
 assert.match(html,/boss\.hp=Math\.max\(0,boss\.hp-damage\)/);
 assert.match(html,/e\.attackTimer%850===0/);
 assert.match(html,/missionTicks%550===0/);
 assert.match(html,/const roster=\['SUB','SHIP','JET','HELI','ZIGZAG','TANK','TURRET'\]/);
 assert.match(html,/HUD 0\.6\.2/);
});

test('aircraft and missiles 061: active model, weapons and powerup integration',()=>{
 const html=read('index.html');
 assert.match(html,/player\.aircraftType=selectedPlane/);
 assert.match(html,/aircraft:player\.aircraftType\|\|selectedPlane/);
 assert.match(html,/set\('hud-plane',aircraftCatalog\.PLANES\[player\.aircraftType\|\|selectedPlane\]/);
 assert.match(html,/selectedPlane=planeSelect\.value/);
 assert.match(html,/player\.specialShots = 100/);
 assert.match(html,/type: 'BANK_MISSILE', color:/);
 assert.match(html,/BANK_MISSILE:\{color:/);
 assert.match(html,/b\.damage\|\|1/);
 assert.match(html,/boss\.gravityTicks=600/);
 assert.match(html,/continues=10/);
 assert.match(html,/HUD 0\.6\.2/);
});

test('aircraft 062: seven distinct silhouettes visible in game and pickups accessible',()=>{
 const scene=read('src/render/scene2d5.js');
 const html=read('index.html');
 assert.match(scene,/function distinctAircraft\(/);
 assert.match(scene,/distinctAircraft\(c,style\)/);
 assert.match(scene,/d\.player\.aircraftType\|\|d\.aircraft/);
 for(const name of ['falcao','vespa','cometa','fenix','helicoptero','disco','titan'])assert.ok(scene.includes(name+':{wing:'));
 assert.match(html,/function drawActiveAircraftLabel\(/);
 assert.match(html,/drawActiveAircraftLabel\(\);/);
 assert.match(html,/missionTicks%1150===0/);
 assert.match(html,/player\.specialShots = 100/);
 assert.match(html,/continues=10/);
 assert.match(html,/HUD 0\.6\.2/);
});
