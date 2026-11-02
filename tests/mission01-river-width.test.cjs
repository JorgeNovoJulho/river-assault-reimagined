const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const filename=path.resolve(__dirname,'../index.html');const html=fs.readFileSync(filename,'utf8');
for(const snippet of ['Math.min(VIRTUAL_WIDTH * 0.67, VIRTUAL_WIDTH - 56)','Math.max(VIRTUAL_WIDTH * 0.57, Math.min(VIRTUAL_WIDTH * 0.73','Math.min(VIRTUAL_WIDTH * 0.76, VIRTUAL_WIDTH - 40)']) assert.ok(html.includes(snippet),'Missing wide-river clause: '+snippet);
for(const width of [400,600,800,1200]){
 const initial=Math.min(width*.67,width-56),min=width*.57,max=width*.73,boss=Math.min(width*.76,width-40);
 assert.ok(initial>0&&initial<width,'Bad initial width '+width);
 assert.ok(min<max&&max<width,'Bad lane limits '+width);
 assert.ok(boss<width,'Bad boss lane '+width);
}
console.log('River corridor responsive geometry PASS');
