const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('HTML contém área de jogo, controles e interface de seleção',()=>{
 const html=fs.readFileSync('index.html','utf8');
 for(const id of ['gameCanvas','start-btn','plane-select','virtual-joystick','btn-fire','btn-bomb','controller-settings']){
  assert.ok(html.includes('id="'+id+'"'),id+' ausente');
 }
 assert.ok(html.includes('src="./src/game/clock.js"'));
 assert.ok(html.includes('src="./src/game/aircraft.js"'));
});
test('script principal tem sintaxe JavaScript válida',()=>{
 const html=fs.readFileSync('index.html','utf8');
 const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
 assert.equal(inline.length,1);
 new vm.Script(inline[0],{filename:'index-inline.js'});
});

test('renderizador moderno e CSS responsivo disponíveis',()=>{
 const html=fs.readFileSync('index.html','utf8');
 assert.ok(html.includes('src="./src/render/scene2d5.js"'),'renderizador não referenciado');
 assert.ok(html.includes('id="mobile-responsive-v2"'));
 assert.ok(html.includes('overflow-y:auto!important'),'modais sem rolagem');
 assert.ok(html.includes('21dvh'),'altura de controles não responsiva');
});

test('campanha tem 20 missões e identificação exclusiva dos chefes',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),ctx={window:{}};
 vm.runInNewContext(fs.readFileSync('src/game/campaign.js','utf8'),ctx);
 const levels=ctx.window.RiverCampaign.levels;
 assert.equal(levels.length,20);
 assert.equal(new Set(levels.map(x=>x.boss)).size,20);
 assert.deepEqual(Array.from(new Set(levels.map(x=>x.difficulty))).sort(),[1,2,3]);
});

test('as vinte missões possuem biomas e chefes temáticos; represas têm abertura de passagem',()=>{
 const context={window:{}};vm.runInNewContext(fs.readFileSync('src/game/campaign.js','utf8'),context);
 const levels=context.window.RiverCampaign.levels;
 assert.equal(levels.length,20);
 assert.ok(levels.every(l=>l.biome&&l.bossVisual&&Number.isInteger(l.hazardSet)));
 const html=fs.readFileSync('index.html','utf8');
 assert.ok(html.includes("type==='DAM' && Math.abs(player.x-p.x)<p.opening/2-player.width/2"),'corredor livre ausente');
 assert.ok(html.includes("opening:passage"),'represa sem abertura');
 assert.ok(html.includes("islandLastDistance"),'distância entre ilhas ausente');
});

test('trilha catalogada com 14 faixas e ordens random/manual',()=>{
  const music=fs.readFileSync('src/audio/playlist.js','utf8');
  const entries=[...music.matchAll(/"id": "bundled-\d+"/g)];
  assert.equal(entries.length,14);
  assert.match(music,/this\.random=true/);
  assert.match(music,/startNewGame\(\).*this\.random\?shuffle/);
  assert.match(music,/preview\(id\)/);
  assert.match(music,/move\(id,delta\)/);
  assert.match(music,/item\.url/);
});
test('bosses usam HP ampliado, alerta e tempo minimo de batalha',()=>{
  const html=fs.readFileSync('index.html','utf8');
  assert.match(html,/360\+mission\.difficulty\*110\+sector\*27/);
  assert.match(html,/RED ALERT/);
  assert.match(html,/redAlertTicks===0/);
  assert.match(html,/missionTicks >= 90\*60/);
});

test('recompensas, mechas e transição estão no jogo',()=>{
 const html=fs.readFileSync('index.html','utf8');
 assert.match(html,/player\.bombs=3;document\.getElementById\('bomb-count-touch'\)/);
 assert.match(html,/p\.type==='LIFE'/);
 assert.match(html,/p\.type==='FUEL'/);
 assert.match(html,/type==='MECHA_SWORD'/);
 assert.match(html,/type==='MECHA_GUN'/);
 assert.match(html,/e\.attackTimer%960===0/);
 assert.match(html,/missionTransitionTicks=180/);
});
