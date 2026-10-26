const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('RiverStorm inline JavaScript parses',()=>{
 const html=read('index.html');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(s=>s.trim());
 assert.ok(scripts.length>0);
 for(const source of scripts)new vm.Script(source);
});
test('visual quality includes all supported profiles',()=>{
 const html=read('index.html');
 for(const name of ['eco','balanced','enhanced'])assert.match(html,new RegExp('value="'+name+'"'));
 assert.match(html,/function beginLogicalFrame\(/);
 assert.match(html,/devicePixelRatio/);
});
test('campaign, saves and bundled soundtrack remain wired',()=>{
 const html=read('index.html');
 assert.match(html,/writeCheckpoint/);
 assert.match(html,/RiverCampaign/);
 assert.match(html,/src\/audio\/playlist\.js/);
 const music=read('src/audio/playlist.js');
 for(let n=1;n<=14;n++)assert.ok(music.includes('track-'+String(n).padStart(2,'0')+'.opus'));
});
test('scene renderer parses and differentiates quality',()=>{
 const source=read('src/render/scene2d5.js');
 new vm.Script(source);
 assert.match(source,/quality==='enhanced'/);
 assert.match(source,/quality==='eco'/);
});