const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const h=fs.readFileSync('index.html','utf8');
test('menu com 3 hotspots e posicionamento fixo',()=>{for(const id of ['mode-single','mode-multi','mode-settings'])assert.match(h,new RegExp('id="'+id+'"'));assert.match(h,/#mode-selection #mode-single,#mode-selection #mode-multi,#mode-selection #mode-settings/);});
test('ultimo piloto salvo aparece na tela inicial',()=>{assert.match(h,/function syncFeaturedPilot\(/);assert.match(h,/riverstorm:lastSelectedShip/);assert.match(h,/rs-menu-featured-photo/);});
test('pilotos isolados do menu de abertura',()=>{assert.match(h,/screen.style.cssText='position:absolute;inset:0;z-index:110;background:#041225/);});
