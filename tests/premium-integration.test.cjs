/* Contratos de integracao premium. Nao substitui teste em navegador. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Boss 02 raster fica restrito ao setor 2 e tem fallback do boss original',()=>{
 const s=read('src/render/scene2d5.js');
 assert.match(s,/Number\(d\.sector\)===2&&premiumBoss02\.complete/);
 assert.match(s,/bossSpriteImages\[Number\(d\.sector\)-1\]/);
 assert.match(s,/bossAccessories\(c,e,d\)/);
});
test('20 setores carregam assets conforme missao',()=>{
 const s=read('src/render/premium-environment.js');
 assert.match(s,/Math\.min\(20/);
 assert.match(s,/preload\(sector\)/);
 assert.match(s,/groupReady\(fallback\)/);
});
test('a distribuicao nao omite os carregadores Premium',()=>{
 const s=read('vite.config.js');
 assert.match(s,/src\/render\/premium-registry\.js/);
 assert.match(s,/src\/render\/premium-environment\.js/);
 assert.match(s,/readdirSync/);
});
test('musica original permanece registrada na distribuicao',()=>{
 assert.match(read('vite.config.js'),/src\/audio\/music\.js/);
 assert.match(read('vite.config.js'),/src\/audio\/playlist\.js/);
});
