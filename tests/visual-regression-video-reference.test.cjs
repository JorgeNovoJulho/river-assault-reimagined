const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const scene=fs.readFileSync('src/render/scene2d5.js','utf8');
const env=fs.readFileSync('src/render/premium-environment.js','utf8');
const prefix='assets/sprites/premium/approved/environment/';
test('abertura Premium preserva arte aprovada e contraste sem ocultar o cenário',()=>{
 assert.match(html,/background-image:linear-gradient\(#03132933,#071c3755\),url\(\.\/assets\/ui\/premium\/menu\//);
 assert.match(html,/rs-premium-pilots/);
 assert.match(html,/rs-pilot-detail-photo/);
 assert.match(html,/rs-pilot-detail-bars/);
 assert.match(html,/rs-pilot-confirming/);
});
test('paisagem procedural não é pintada abaixo do ambiente raster completo',()=>{
 assert.match(scene,/if\(!premiumReady\)landscape\(c,d,t\)/);
 assert.match(scene,/env\?\.ready\(d.sector\)&&env.paint/);
});
test('Missão 2 tem trio de texturas industriais reais; não aceita substituição tropical',()=>{
 for(const part of ['water','bank_left','bank_right'])assert.ok(fs.existsSync(prefix+'mission_02_industrial/'+part+'.png'));
 assert.match(env,/approved\/environment\/mission_/);
});
test('Missão 1 deve ser marcada como incompleta até receber os masters do Rio Verde',()=>{
 const folder=prefix+'mission_01_rio_verde/';
 const missing=['water','bank_left','bank_right'].filter(x=>!fs.existsSync(folder+x+'.png'));
 assert.deepEqual(missing,['water','bank_left','bank_right'],'Atualizar este teste quando os 3 masters oficiais forem incorporados');
});
