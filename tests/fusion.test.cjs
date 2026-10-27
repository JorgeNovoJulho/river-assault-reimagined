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
