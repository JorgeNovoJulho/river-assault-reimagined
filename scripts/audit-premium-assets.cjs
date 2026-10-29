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
