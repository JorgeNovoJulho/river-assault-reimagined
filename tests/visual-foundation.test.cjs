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
 assert.match(html,/missionTicks%550===0/);
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
 assert.match(html,/function openBossSkillPicker\(/);
 assert.match(html,/function useBossSkill\(/);
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
 assert.match(html,/HUD 0\.7\.6/);
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
 assert.match(read('index.html'),/HUD 0\.7\.6/);
});

test('visual hangar 052: selected planes, portraits, pilot miniatures, visible silhouettes',()=>{
 const html=read('index.html');
 assert.match(html,/function renderHangar\(/);
 assert.match(html,/id="hangar-preview"/);
});

test('hangar 053: scrollable menu preserves previews on short displays',()=>{
 const html=read('index.html');
 assert.match(html,/#start-screen\{overflow-y:auto!important/);
 assert.match(html,/id="hangar-preview"/);
 assert.match(html,/id="pilot-portrait"/);
 assert.match(html,/id="pilot-body"/);
 assert.match(html,/id="hangar-stats"/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('hangar 054: commands outside scrollable hangar and attribute bars',()=>{
 const html=read('index.html');
 assert.match(html,/id="start-actions"/);
 assert.match(html,/#start-actions\{display:grid!important/);
 assert.match(html,/#start-screen>div:not\(#start-actions\)/);
 for(const id of ['start-btn','menu-settings-btn','hangar-speed-bar','hangar-shield-bar','hangar-range-bar','hangar-fire-bar'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/HUD 0\.7\.6/);
});

test('menu 055: single scroll region prevents giant mission and quality cards',()=>{
 const html=read('index.html');
 assert.match(html,/id="start-main"/);
 assert.match(html,/#start-screen>#start-main>div/);
 assert.match(html,/#start-screen>#start-main\{display:flex!important/);
 assert.match(html,/#start-screen>#start-actions\{flex:0 0 auto!important/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('deployment 056: build-id fingerprint and verifiable published version',()=>{
 const html=read('index.html'),vite=read('vite.config.js');
 assert.match(vite,/riverstorm-build/);
 assert.match(html,/id="compact-hud"/);
});

test('menu 057: desktop columns, mobile single-column and combat HUD hidden',()=>{
 const html=read('index.html');
 for(const id of ['start-brand','start-main','start-actions','hangar-plane','pilot-portrait','pilot-body','hangar-bars'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/#start-screen:not\(\.hidden\)\{position:absolute!important/);
 assert.match(html,/#start-screen #start-brand/);
 assert.match(html,/body:has\(#start-screen:not\(\.hidden\)\) #compact-hud/);
 assert.match(html,/body:has\(#start-screen:not\(\.hidden\)\) #rs-bottom-actions/);
 assert.match(html,/@media\(max-width:720px\)/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('menu 058: uncropped two-line title and useful sidebar panels',()=>{
 const html=read('index.html');
 assert.match(html,/<h1><span>RIVER<\/span><span>STORM<\/span><\/h1>/);
 assert.match(html,/brand-feature/);
 assert.match(html,/#start-brand h1 span/);
 assert.match(html,/HUD 0\.7\.6/);
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
 assert.match(html,/HUD 0\.7\.6/);
});

test('aircraft and missiles 061: active model, weapons and powerup integration',()=>{
 const html=read('index.html');
 assert.match(html,/function fireWeapon\(/);
 assert.match(html,/const nextX=oldX/);
});

test('aircraft 062: seven distinct silhouettes visible in game and pickups accessible',()=>{
 const scene=read('src/render/scene2d5.js');
 assert.match(scene,/function distinctAircraft\(/);
 assert.match(scene,/function aircraftDetails\(/);
});

test('063: save aircraft preference, poison and bleed counter-elements',()=>{
 const html=read('index.html');
 assert.match(html,/boss\.statusBaseHp=boss\.maxHp/);
 assert.match(html,/river_active_plane/);
});

test('064: horizontal wing rockets, diagonal drones, capped status and EMP immunity to DOT',()=>{
 const html=read('index.html');
 assert.match(html,/launch\(player\.x-24,player\.y-6,-11,0\)/);
 assert.match(html,/launch\(player\.x\+24,player\.y-6,11,0\)/);
 assert.match(html,/launch\(player\.x,player\.y-24,0,-12\)/);
 assert.match(html,/w\.side\*7,-9/);
 assert.match(html,/cap=e\.statusBaseHp\*\.30/);
 assert.match(html,/boss\.gravityRate=advantage\?\.06:\.03/);
 assert.match(html,/boss\.stunnedTicks=300/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('065 approved EMP has no damage and gravity ticks full 3 seconds',()=>{
 const html=read('index.html');
 assert.match(html,/boss\.stunnedTicks=300/);
 assert.match(html,/function useBossSkill\(/);
});

test('boss 066: restrained EMP, 50 percent frozen firing, choreography and explosive knockback',()=>{
 const html=read('index.html');
 assert.match(html,/e\.swordCharge=60/);
 assert.match(html,/e\.specialCount/);
});

test('067: all twenty mission enemies spawn and use their own render and attack',()=>{
 const html=read('index.html'),render=read('src/render/scene2d5.js');
 const names=['TUCANO','CRANE','SCORPION','ALLIGATOR','CORSAIR','WALRUS','MANTIS','MOTOJET','SALAMANDER','EAGLE','DREDGER','HOVERCAR','PIRANHA','ICE_RAY','BEETLE','PRISM_WASP','WELDER','NARWHAL','EEL','HYBRID_HUNTER'];
 for(const name of names){assert.ok(html.includes("id:'"+name+"'"));assert.ok(render.includes(name));}
 assert.match(html,/function spawnBiomeEnemy\(/);
 assert.match(html,/function updateBiomeEnemy\(/);
 assert.match(html,/function playBiomeEnemySound\(/);
 assert.match(render,/function drawBiomeEnemy\(/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('068: boss telegraph and limited specials, parry and projectile reflection',()=>{
 const html=read('index.html');
 assert.match(html,/id="parry-btn"/);
 assert.match(html,/function activateParry\(/);
 assert.match(html,/function reflectBossSpecial\(/);
 assert.match(html,/e\.specialCount<5/);
 assert.match(html,/abilityCooldown-90/);
 assert.match(html,/parryTicks>0&&Math\.hypot/);
 assert.match(html,/KeyV/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('069: prism and shadow arsenal and opposite weaknesses',()=>{
 const html=read('index.html');
 assert.match(html,/PRISM:\{icon:/);
 assert.match(html,/SHADOW:\{icon:/);
 assert.match(html,/strong:'SHADOW'/);
 assert.match(html,/strong:'PRISM'/);
 assert.match(html,/boss\.dualRate=advantage\?\.003:\.0015/);
 assert.match(html,/boss\.dualAmp=kind==='PRISM'/);
 assert.match(html,/boss\.dualSlow=kind==='SHADOW'/);
 assert.match(html,/dualElement==='PRISM'\?1\+/);
 assert.match(html,/pattern===7\|\|pattern===8/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('070: light/shadow offensive powers, boss summons and slash combat',()=>{
 const html=read('index.html');
 assert.match(html,/boss\.dualRate=advantage/);
 assert.match(html,/function playBiomeEnemySound\(/);
});

test('071: skill trajectories, aimed parry return and four projectile wave types',()=>{
 const html=read('index.html');
 assert.match(html,/function launchSkillTrajectory\(/);
 assert.match(html,/type:'REFLECTED'/);
});

test('072: fixed skills per boss, held parry, reflected double damage and visible dives',()=>{
 const html=read('index.html');
 assert.match(html,/MISSION_BOSS_SKILLS=\[/);
 assert.match(html,/parryTicks=360/);
});

test('073: boss sword classes and parry stun vulnerability',()=>{
 const html=read('index.html');
 assert.match(html,/const BOSS_STRIKES=\{/);
 assert.match(html,/attacker\.parryVulnerableTicks=180/);
 assert.match(html,/attacker\.stunnedTicks=Math\.max/);
 assert.match(html,/parryVulnerableTicks>0\?1\.5:1/);
 assert.match(html,/if\(!defendCharge\(e\)\)applyDamage\(35/);
 assert.match(html,/if\(!defendCharge\(e\)\)applyDamage\(20/);
 assert.match(html,/HUD 0\.7\.6/);
});

test('074: shooting enemies, homing reflection, diagonal escorts and boss music',()=>{
 const html=read('index.html'),music=read('src/audio/playlist.js');
 assert.match(html,/dodgeReflect:rollFrames>0/);
 assert.match(music,/beginBossTheme\(\)/);
});

test('075: six-second invulnerable shield and enemy impact reflection',()=>{
 const html=read('index.html');
 assert.match(html,/parryTicks=360/);
 assert.match(html,/player\.invulnerable=Math\.max\(player\.invulnerable,2\)/);
});

test('076: boss health, sword rush, ricochet collisions, re-tap parry',()=>{
 const html=read('index.html');
 assert.match(html,/swordRushCooldown=240/);
 assert.match(html,/reflectHits/);
});

test('performance: culling evita desenhar sprites fora da viewport',()=>{
 const render=read('src/render/scene2d5.js');
 assert.match(render,/function draw\(c,d\)/);
 assert.match(render,/e\.hp<=0\|\|e\.y\+/);
 assert.match(render,/p\.y\+\(p\.height\|\|0\)>-32/);
});
test('mapas: marcos ambientais com cinco famílias, deslocamento e baixo custo',()=>{
 const render=read('src/render/scene2d5.js');
 assert.match(render,/function landmark\(c,d,t\)/);
 assert.match(render,/switch\(\(sector-1\)%5\)/);
 assert.match(render,/landscape\\(c,d,t\\)/);
  assert.match(render,/if\\(!premiumEnvironment\\)/);
  assert.match(render,/terrainSignature\\(c,d,t\\);landmark\\(c,d,t\\);mapSetPieces\\(c,d,t\\)/);
  assert.match(render,/biomeAtmosphere\\(c,d,t\\)/);
 assert.match(render,/d\.quality==='eco'\?2/);
});

test('20 missões possuem clima, horário, iluminação e detalhes dedicados',()=>{
 const render=read('src/render/scene2d5.js');
 const climates=render.match(/const CLIMATE=\[([\s\S]*?)\n \];/);
 assert.ok(climates,'climas de missão ausentes');
 assert.equal((climates[1].match(/\['[^']+','[^']+','[^']+'\]/g)||[]).length,20);
 assert.match(render,/const dayGlow=/);
 assert.match(render,/weather==='blizzard'/);
 assert.match(render,/weather==='sand'/);
 assert.match(render,/weather==='lightning'/);
 assert.match(render,/quality==='eco'\?12/);
});

test('clima permanece pré-alocado e período é informado ao piloto',()=>{
 const render=read('src/render/scene2d5.js');
 assert.ok(render.indexOf('const CLIMATE=[')<render.indexOf('function landscape(c,data,t)'), 'tabela climática não deve ser alocada por quadro');
 assert.match(render,/const periodNames=/);
 assert.match(render,/const weatherNames=/);
 assert.match(render,/periodNames\[climate\[2\]\]/);
});

test('20 mapas têm set pieces específicos com limite de custo por perfil',()=>{
 const render=read('src/render/scene2d5.js');
 const match=render.match(/const MAP_FEATURES=\[([\s\S]*?)\];/);
 assert.ok(match,'catálogo de estruturas de mapas ausente');
 assert.equal((match[1].match(/'[^']+'/g)||[]).length,20);
 assert.match(render,/function mapSetPieces\(c,d,t\)/);
 assert.match(render,/d\.quality==='eco'\?2:d\.quality==='enhanced'\?6:4/);
 assert.match(render,/mapSetPieces\\(c,d,t\\)/);
  assert.match(render,/biomeAtmosphere\\(c,d,t\\)/);
  assert.match(render,/if\\(!premiumEnvironment\\)/);
});

test('20 cenários têm margens e terrenos próprios com densidade ajustável',()=>{
 const render=read('src/render/scene2d5.js');
 const signatures=render.match(/const TERRAIN_SIGNATURES=\[([\s\S]*?)\];/);
 assert.ok(signatures);
 assert.equal((signatures[1].match(/'[^']+'/g)||[]).length,20);
 assert.match(render,/function terrainSignature\(c,d,t\)/);
 assert.match(render,/d\.quality==='eco'\?170/);
});
