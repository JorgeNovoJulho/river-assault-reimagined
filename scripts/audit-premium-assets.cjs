/* RiverStorm — validação offline da biblioteca raster Premium.
   Execução: node scripts/audit-premium-assets.cjs
   Não altera o jogo, não gera sprites procedurais. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'assets/sprites/premium/runtime');
const categories={
  player:['falcao','vespa','cometa','fenix','helicoptero','disco','titan'],
  enemies:['helicopter','jet','zigzag','turret','tank','submarine','ship','mecha-gun','mecha-sword'],
  terrain:['island','bridge','dam','bridge-damaged','dam-damaged'],
  items:['bomb','shield','fuel','drones','repair'],
  projectiles:['single','double','spread','laser','missile','burst','alternate','needle','pulse','rocket','rapid','diagonal','trident','beam','precision','hybrid','circle','tracker','multi'],
  fx:['explosion_atlas_4x3']
};
const overrides={ 'player/falcao':'player/fighter_candidate.png','fx/explosion_atlas_4x3':'fx/explosion_atlas_4x3.png'};
const report={checked:0,valid:[],missing:[],invalid:[]};
for(const [group,names] of Object.entries(categories))for(const name of names){
  const relative=overrides[group+'/'+name]||group+'/'+name+'.png';
  const file=path.join(base,relative);report.checked++;
  if(!fs.existsSync(file)){report.missing.push(relative);continue;}
  const buf=fs.readFileSync(file);
  const isPng=buf.length>=24&&buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if(!isPng){report.invalid.push({file:relative,reason:'Assinatura PNG inválida'});continue;}
  const width=buf.readUInt32BE(16),height=buf.readUInt32BE(20);
  if(width<16||height<16){report.invalid.push({file:relative,reason:'Dimensões inferiores a 16 pixels'});continue;}
  report.valid.push({file:relative,width,height,bytes:buf.length});
}
console.log(JSON.stringify(report,null,2));
console.log('\nVERIFICADOS:',report.checked,'PNG VÁLIDOS:',report.valid.length,'AUSENTES:',report.missing.length,'INVÁLIDOS:',report.invalid.length);
if(report.invalid.length)process.exitCode=2;

// V3 é uma biblioteca separada do runtime legado. Toda promoção é conferida
// contra o SHA-256 gravado no manifesto; nenhuma imagem composta é tratada
// como sprite carregável sem essa prova de origem.
const crypto=require('node:crypto');
const manifestFile=path.join(root,'assets/sprites/premium/approved/manifest-v3.json');
if(fs.existsSync(manifestFile)){
 const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
 const v3={checked:0,valid:0,missing:[],hashMismatch:[],invalid:[]};
 for(const asset of manifest.assets||[]){
  const file=path.join(root,'assets/sprites/premium',asset.path);v3.checked++;
  if(!fs.existsSync(file)){v3.missing.push(asset.path);continue;}
  const data=fs.readFileSync(file),png=data.length>=24&&data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const hash=crypto.createHash('sha256').update(data).digest('hex');
  if(!png){v3.invalid.push(asset.path);continue;}
  if(hash!==asset.sha256){v3.hashMismatch.push(asset.path);continue;}
  v3.valid++;
 }
 console.log('\nV3 APROVADO:',JSON.stringify(v3));
 if(v3.missing.length||v3.hashMismatch.length||v3.invalid.length)process.exitCode=2;
}
