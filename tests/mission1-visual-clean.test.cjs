const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const scene=fs.readFileSync('src/render/scene2d5.js','utf8');
const registry=fs.readFileSync('src/render/premium-registry.js','utf8');

test('Missão 1 usa apresentação limpa e o sprite Premium TUCANO',()=>{
  assert.match(html,/const crtEnabled = false/);
  assert.doesNotMatch(html,/id="crt-toggle"/);
  assert.match(html,/\.crt-effect::before \{ content:none!important; display:none!important; \}/);
  assert.match(html,/filter:brightness\(1\.08\) contrast\(1\.04\) saturate\(1\.10\)/);
  assert.match(registry,/TUCANO:'approved\/enemies\/exclusive\/01_tucano\/idle_000\.png'/);
  assert.match(html,/window\.RiverPremium\?\.get\('enemy',e\.type==='BIOME_ENEMY'\?\(e\.biomeId\|\|'TUCANO'\):e\.type\)/);
});

test('cenário da Missão 1 mantém água clara e atmosfera de baixa opacidade',()=>{
  assert.match(scene,/name:"FLORESTA TROPICAL",ground:\['#1b4a45','#55916b'\],water:\['#167ca9','#3bbbd4'\]/);
  assert.match(scene,/const darkness=climate\[2\]==='night'\|\|climate\[2\]==='midnight'\?\.07/);
  assert.match(scene,/weather==='sand'\?\.055:weather==='ash'\?\.065:\.055/);
  assert.match(html,/rgba\(219,238,245,\.055\)/);
});

test('inimigos Premium declarados não caem em placeholder e usam escala visual independente',()=>{
  for(const id of ['HELI','JET','ZIGZAG','DRONE','MECHA_SWORD','MECHA_GUN','TANK','SHIP','SUB','TURRET','WARSHIP','TUCANO']){
    assert.match(registry,new RegExp(id+":"));
  }
  assert.match(registry,/const ENEMY_DISPLAY=/);
  assert.match(registry,/function declared\(group,id\)/);
  assert.match(registry,/function preload\(\)/);
  assert.match(scene,/const hasDeclaredPremium=root\.RiverPremium\?\.declared\?\.\('enemy',premiumId\)/);
  assert.match(scene,/else if\(hasDeclaredPremium\)\{/);
  assert.match(scene,/displaySize\?\.\(premiumId,e\.width\|\|36,e\.height\|\|36\)/);
});

test('Boss 01 usa o corpo raster Premium sem módulos legados sobrepostos',()=>{
  assert.match(scene,/Number\(sector\)===1\?Math\.min\(Math\.max\(214,/);
  assert.match(scene,/if\(e\.type==='BOSS'&&Number\(d\.sector\)<=2&&drawPremiumBossV3\(c,e,d\.sector\)\)/);
  const block=scene.slice(scene.indexOf("if(e.type==='BOSS'&&Number(d.sector)<=2"),scene.indexOf("}else if(e.type==='BOSS'&&Number(d.sector)===2"));
  assert.doesNotMatch(block,/bossAccessories\(c,e,d\)/,'Bosses V3 não podem ter acessórios legados sobrepostos');
  assert.match(scene,/Number\(e\.bossId\|\|d\.sector\)===1\)continue/);
  assert.match(html,/Number\(boss\.bossId\|\|sector\)===1\)continue/);
});
