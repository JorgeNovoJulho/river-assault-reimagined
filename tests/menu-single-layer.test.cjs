const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');const h=fs.readFileSync('index.html','utf8');
test('menu único não monta artboard interna',()=>{assert.doesNotMatch(h,/mountPremiumBoard/);assert.doesNotMatch(h,/rs-menu-board/);assert.match(h,/rs-menu-layout-hud-v4/);});
test('única arte preenche seleção com áreas funcionais',()=>{assert.match(h,/#mode-selection\{position:absolute!important;inset:0!important/);for(const id of ['mode-single','mode-multi','mode-settings'])assert.match(h,new RegExp('id="'+id+'"'));});
test('último piloto e seleção independente continuam',()=>{assert.match(h,/function syncFeaturedPilot/);assert.match(h,/rs-premium-pilots/);});
