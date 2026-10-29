/* Exige os PNGs reais antes de homologar um build Premium.
 * Uso: node scripts/check-premium-environment.cjs
 */
const fs=require('node:fs');
const path=require('node:path');
const {PNG_FILES}= {PNG_FILES:['water_calm.png','riverbank_left.png','riverbank_right.png']};
const folder=path.resolve(__dirname,'../assets/sprites/premium/runtime/environment');
let missing=0;
for(const name of PNG_FILES){
 const file=path.join(folder,name);
 if(!fs.existsSync(file)){console.error('[AUSENTE]',file);missing++;continue;}
 const data=fs.readFileSync(file);
 if(data.length<24||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'){
   console.error('[PNG INVALIDO]',file);missing++;continue;
 }
 const w=data.readUInt32BE(16),h=data.readUInt32BE(20);
 if(w<50||h<50){console.error('[DIMENSAO INADEQUADA]',name,w,h);missing++;continue}
 console.log('[OK]',name,w+'x'+h);
}
if(missing){console.error('Build Premium incompleto:',missing,'recurso(s) de cenario faltando.');process.exitCode=1;}
else console.log('Três PNGs de cenário instalados corretamente.');
