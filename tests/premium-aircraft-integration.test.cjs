const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const ids=['falcao','vespa','cometa','fenix','helicoptero','disco','titan'];
const states=['normal','disparo','boost','especial'];
test('28 PNGs oficiais disponíveis e correspondentes ao manifesto',()=>{
 const dir=path.join(root,'assets/sprites/premium/aircraft');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
 assert.deepEqual(Object.keys(manifest).sort(),[...ids].sort());
 for(const id of ids)for(const state of states){
  const name=id+'_'+state+'.png';
  assert.equal(manifest[id][state],name);
  const data=fs.readFileSync(path.join(dir,name));
  assert.ok(data.length>24,name);
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name+' não é PNG');
 }
});
test('campanha desenha sprite conforme aeronave, não apenas Falcão',()=>{
 const registry=fs.readFileSync(path.join(root,'src/render/premium-registry.js'),'utf8');
 const renderer=fs.readFileSync(path.join(root,'src/render/scene2d5.js'),'utf8');
 assert.match(registry,/AIRCRAFT_IDS=\['falcao','vespa','cometa','fenix','helicoptero','disco','titan'\]/);
 assert.match(renderer,/root\.RiverPremium\?\.aircraft\(aircraft/);
 assert.doesNotMatch(renderer,/aircraft==='falcao'\?root\.RiverPremium/);
});
test('build inclui as 28 artes PNG oficiais',()=>{
 const vite=fs.readFileSync(path.join(root,'vite.config.js'),'utf8');
 assert.match(vite,/assets\/sprites\/premium\/aircraft/);
 assert.match(vite,/Sprite Arcade Premium obrigatório ausente/);
});
