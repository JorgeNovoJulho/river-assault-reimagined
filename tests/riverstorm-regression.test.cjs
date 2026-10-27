const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const game=fs.readFileSync('index.html','utf8');
test('jogo possui inicializacao e canvas',()=>{assert.match(game,/id="gameCanvas"/);assert.match(game,/function update\(\)/);});
test('JavaScript inline compila',()=>{
 const scripts=[...game.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
 for(const [,attrs,code] of scripts){if(!attrs.includes('src='))assert.doesNotThrow(()=>new vm.Script(code));}
});
test('fusao dura 6s, impede tiros e restaura armamento',()=>{
 assert.match(game,/fusionTicks=360/);
 assert.match(game,/fusionTicks>0\) return/);
 assert.match(game,/fusionPreviousArmament/);
 assert.match(game,/player\.weapon=fusionPreviousArmament\.weapon/);
 assert.match(game,/w\.hp=w\.maxHp/);
});
test('feixe de fusao verifica pontes represas e ilhas',()=>{
 assert.match(game,/for\(const collection of \[structures,islands\]\)/);
 assert.match(game,/beamHalfWidth=27/);
 assert.match(game,/collection\.splice\(i,1\)/);
});
test('scripts obrigatorios existem',()=>{
 for(const [,p] of game.matchAll(/<script[^>]+src="\.\/([^"]+)"/g)){
  assert.ok(fs.existsSync(p.split('?')[0]),p);
 }
});
test('lobby e renderer compilam',()=>{
 for(const p of ['src/net/room-lobby.js','src/render/scene2d5.js']){
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(p,'utf8')));
 }
});

test('auxiliares possuem formacoes adaptativas para 19 armas',()=>{
 const segment=game.match(/const AUX_FORMATIONS=\{([\s\S]*?)\};/);
 assert.ok(segment,'tabela de formacoes');
 for(const weapon of ['SINGLE','DOUBLE','SPREAD','LASER','MISSILE','BURST','ALTERNATE','NEEDLE','PULSE','ROCKET','RAPID','DIAGONAL','TRIDENT','BEAM','PRECISION','HYBRID','CIRCLE','TRACKER','MULTI'])
  assert.match(segment[1],new RegExp('\\b'+weapon+':'));
 assert.match(game,/function wingPosition\(/);
});
test('CIRCLE usa raios horizontais com impacto em estruturas, ilhas e inimigos',()=>{
 assert.match(game,/CIRCLE:'SIDE_RAYS'/);
 assert.match(game,/function fireCircleSideRays\(/);
 assert.match(game,/function drawCircleSideRays\(/);
 assert.match(game,/for\(const collection of \[structures,islands\]\)/);
 assert.match(game,/if\(e.type==='BOSS'\)/);
});
test('fusao tem contador de duracao e recarga independente',()=>{
 assert.match(game,/function drawFusionStatus\(/);
 assert.match(game,/fusionTicks=360;fusionCooldown=0/);
 assert.match(game,/fusionCooldown=360/);
 assert.match(game,/FUSÃO RECARGA/);
});

test('fusao intercepta tiros inimigos na faixa',()=>{
 assert.match(game,/for\(let i=enemyBullets\.length-1;i>=0;i--\)/);
 assert.match(game,/Math\.abs\(shot\.x-player\.x\)>32/);
 assert.match(game,/enemyBullets\.splice\(i,1\)/);
});
test('acertos, notas e adaptacao persistem por campanha',()=>{
 assert.match(game,/missionHits=Array\(20\)\.fill\(0\)/);
 assert.match(game,/const hitGrade=/);
 assert.match(game,/function adaptAfterBoss\(/);
 assert.match(game,/function showMissionReport\(/);
 assert.match(game,/damageBlinkFrames=16/);
 assert.match(game,/adaptiveThreat/);
});

test('gravidade termina e restitui movimento independente',()=>{
 assert.match(game,/if\(player\.effectTimer===0\)\{player\.effectType=''/);
 assert.match(game,/e\.gravityTicks===0/);
 assert.match(game,/player\.effectType==='GRAVITY'&&player\.effectTimer>0/);
});
test('sprite assets existem e build os distribui',()=>{
 const vite=fs.readFileSync('vite.config.js','utf8');
 for(const p of ['assets/sprites/projectiles/plasma-blue.svg','assets/sprites/projectiles/plasma-red.svg','assets/sprites/bosses/iron-wasp.svg']){
  assert.ok(fs.existsSync(p),p);
  assert.ok(vite.includes(p),p);
 }
 assert.match(game,/projectileArt\.blue\.src/);
});
test('piscar vermelho em cima do sprite do piloto',()=>{
 assert.match(game,/damageBlinkFrames=16/);
 assert.match(game,/rgba\(255,22,41,\.88\)/);
});

test('FOGO boss usa 8 chamas sem gradientes por chama',()=>{
 const render=fs.readFileSync('src/render/scene2d5.js','utf8');
 const effect=render.slice(render.indexOf("}else if(f.kind==='FIRE'){"),render.indexOf("}else if(f.kind==='BLEED'){"));
 assert.match(effect,/i<8/);
 assert.doesNotMatch(effect,/createLinearGradient/);
});
test('limites na arena respeitam qualidade grafica',()=>{
 assert.match(game,/bossMaxBullets=qualitySelect/);
 assert.match(game,/floatingTexts.length>=20/);
 assert.match(game,/maxParticles=bossActive\?\(qualitySelect/);
});

test('boss UI uses arcs and slender status lines without square halo',()=>{
 const render=fs.readFileSync('src/render/scene2d5.js','utf8');
 const block=render.slice(render.indexOf('function bossPresentation(c,d)'),render.indexOf('function livingSetDressing(c,d,t)'));
 assert.match(block,/integrados ao casco/);
 assert.doesNotMatch(block,/strokeRect\(/);
});
test('all boss statuses have sound and visible feedback on pilot',()=>{
 const audio=fs.readFileSync('src/audio/sfx-modern.js','utf8');
 assert.match(game,/function drawPlayerStatusEffect\(/);
 assert.match(game,/drawPlayerStatusEffect\(\)/);
 assert.match(game,/RiverSFX\?\.status\?\.\(player.effectType\)/);
 for(const effect of ['EMP','LIGHTNING','ICE','FIRE','BLEED','POISON','PRISM','SHADOW','GRAVITY']){
  assert.ok(audio.includes(effect+':['),effect+' sound');
  assert.ok(game.includes(effect+':'),effect+' visual palette');
 }
});

test('boss low-health and special warning use arcs, never rectangle outlines',()=>{
 assert.doesNotMatch(game,/ctx\.strokeRect\(e\.x-e\.width\/2/);
 assert.match(game,/ctx\.arc\(e\.x,e\.y,Math\.min\(34,e\.width\*\.28\)/);
});

test('bosses 1 a 3 usam sprites diferentes e distribuidos na build',()=>{
 const renderer=fs.readFileSync('src/render/scene2d5.js','utf8');
 const vite=fs.readFileSync('vite.config.js','utf8');
 for(const file of ['iron-wasp.svg','abyss-manta.svg','crimson-rotor.svg']){
  const p='assets/sprites/bosses/'+file;
  assert.ok(fs.existsSync(p),p);
  assert.ok(vite.includes(p),p);
  assert.ok(renderer.includes(file),file);
 }
 assert.match(renderer,/Number\(d\.sector\)<=3/);
});
