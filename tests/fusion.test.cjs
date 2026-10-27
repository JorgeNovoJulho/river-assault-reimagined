const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html','utf8');
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
test('RiverStorm contains a playable canvas and main logic', () => {
 assert.match(html,/<canvas\b/);
 assert.match(html,/function update\(\)/);
 assert.match(html,/function gameLoop\(/);
});
test('all inline game scripts parse without syntax errors', () => {
 const vm=require('node:vm');
 for(const [,attrs,code] of scripts){if(attrs.includes('src='))continue; assert.doesNotThrow(()=>new vm.Script(code));}
});
test('six-second fusion beam and weapon restoration are implemented', () => {
 assert.match(html,/const FUSION_DURATION=360/);
 assert.match(html,/function updateFusionBeam\(/);
 assert.match(html,/function drawFusionBeam\(/);
 assert.match(html,/function endFusionBeam\(/);
 assert.match(html,/fusionSavedWeapon=\{weapon:player\.weapon,specialShots:player\.specialShots\}/);
 assert.match(html,/player\.weapon=fusionSavedWeapon\.weapon/);
 assert.match(html,/w\.hp=w\.maxHp/);
});
test('fusion suppresses conventional shooting and protects allies', () => {
 assert.match(html,/if\(fusionBeamTicks>0\|\|player\.weapon==='LASER'\)return/);
 assert.match(html,/if\(fusionBeamTicks>0\|\|missionTicks%4!==0\)return/);
 assert.match(html,/fusionBeamTicks>0\?null:wingmen\.find/);
});
test('combo works on keyboard touch and gamepad', () => {
 assert.match(html,/function bombOrCouple\(/);
 assert.match(html,/function firePressedForCombo\(/);
 assert.match(html,/getElementById\('btn-bomb'\)\.addEventListener\('pointerdown'/);
 assert.match(html,/gamepadState\.justBomb\) bombOrCouple/);
});
test('every referenced local JS resource exists', () => {
 const path=require('node:path');
 const refs=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(x=>x[1]);
 for(const ref of refs){if(/^https?:/.test(ref))continue;assert.ok(fs.existsSync(path.resolve(ref)),ref);}
});

test('alternate J and K keyboard controls are mapped for fusion',()=>{
 assert.match(html,/KeyJ: false/);
 assert.match(html,/KeyK: false/);
 assert.match(html,/e.code === 'KeyJ'/);
 assert.match(html,/e.code === 'KeyK'/);
 assert.match(html,/keys\.KeyJ\|\|touchFireHeld/);
});
test('shoreline decorative obstacles are relocated outside water bounds',()=>{
 assert.match(html,/function constrainShoreDecorations\(/);
 assert.match(html,/constrainShoreDecorations\(\)/);
 assert.match(html,/boundaries.leftBank-half-9/);
 assert.match(html,/boundaries.rightBank\+half\+9/);
});

test('city props are clipped to both river shores',()=>{
 const scene=fs.readFileSync('src/render/scene2d5.js','utf8');
 assert.match(scene,/Clip decoracao terrestre pela geometria REAL/);
 assert.match(scene,/c\.clip\(\)/);
 assert.match(scene,/fim da mascara terrestre/);
});
test('multiplayer lobby is included in web build and contains create/join actions',()=>{
 const lobby=fs.readFileSync('src/net/room-lobby.js','utf8');
 const vite=fs.readFileSync('vite.config.js','utf8');
 assert.match(html,/src\/net\/room-lobby\.js/);
 assert.match(vite,/src\/net\/room-lobby\.js/);
 assert.match(lobby,/async function create\(\)/);
 assert.match(lobby,/async function join\(\)/);
 assert.match(lobby,/const maxPlayers=8/);
 assert.match(lobby,/Senha incorreta/);
});
