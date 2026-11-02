const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const h=fs.readFileSync('index.html','utf8');
test('somente uma imagem principal e nenhum menu interno',()=>{assert.doesNotMatch(h,/mountPremiumBoard/);assert.doesNotMatch(h,/rs-menu-board/);assert.match(h,/#mode-selection\{position:absolute!important;inset:0!important/)});
test('configuracoes acessiveis acima do menu',()=>{assert.match(h,/dialog\.style\.zIndex='250'/);assert.match(h,/showControllerSettings\(true\)/)});
test('pilotos com tela independente',()=>{assert.match(h,/#rs-premium-pilots\{position:absolute!important/);assert.match(h,/#rs-premium-pilot-cards\{grid-template-columns:repeat\(4/)});
