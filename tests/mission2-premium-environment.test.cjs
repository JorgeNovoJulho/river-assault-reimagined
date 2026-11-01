const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const folder='assets/sprites/premium/approved/environment/mission_02_industrial';
const expected={
  'water.png':'d55c5a963f634ba0f7eccae6ff27c5a79726fdbdfe2f596874020debe130775d',
  'bank_left.png':'7b4395a868b6c8299d6191be04edeea48e4b024d1da22d8cdddeec6f8d851900',
  'bank_right.png':'a18c9cf8910805062540a7a3f3ddd07bd360f25564455fe26a29c17bdf362802'
};
test('Setor 2 possui os três masters industriais com SHA-256 homologado',()=>{
  for(const [name,hash] of Object.entries(expected)){
    const bytes=fs.readFileSync(path.join(root,folder,name));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),hash,name);
  }
});
test('renderizador prioriza PNGs aprovados e reduz repetição curta no porto',()=>{
  const env=fs.readFileSync(path.join(root,'src/render/premium-environment.js'),'utf8');
  assert.match(env,/approved\/environment\/mission_/);
  assert.match(env,/'industrial'/);
  assert.match(env,/h\*1\.55/);
  assert.match(env,/dist\*\.18/);
});
test('Boss 02 mantém corpo V3 sem acessórios vetoriais sobrepostos',()=>{
  const scene=fs.readFileSync(path.join(root,'src/render/scene2d5.js'),'utf8');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(scene,/Number\(sector\)===2\?Math\.min\(Math\.max\(210,/);
  assert.match(scene,/e\.type==='BOSS'&&Number\(d\.sector\)<=2&&drawPremiumBossV3/);
  assert.match(html,/Number\(boss\.bossId\|\|sector\)<=2\)continue/);
});
