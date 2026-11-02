const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const env=fs.readFileSync('src/render/premium-environment.js','utf8');const html=fs.readFileSync('index.html','utf8');
test('Rio Verde localiza pasta oficial 01 sem usar alias jungle',()=>assert.match(env,/n===1\?'approved\/environment\/mission_01_rio_verde\//));
test('Missões 1/2 não podem selecionar texturas genéricas em caso de ausência',()=>{assert.match(env,/if\(Number\(sector\)<=2\)return null/);assert.match(env,/n>2&&/)});
test('seleção de pilotos tem quadro 4+3 e painel em destaque',()=>{assert.match(html,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);assert.match(html,/rs-premium-pilot-detail/);assert.match(html,/rs-pilot-confirming/)});
test('modo inicial tem composição horizontal larga e três dimensões de menu',()=>{assert.match(html,/rs-viewport-v6/);assert.match(html,/min-height:100dvh/);assert.match(html,/mode-single/);assert.match(html,/mode-multi/)});
