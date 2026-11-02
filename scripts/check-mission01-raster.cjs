const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../assets/sprites/premium/approved/environment/mission_01_rio_verde');
for(const name of ['water.png','bank_left.png','bank_right.png']){
 const file=path.join(root,name);
 assert.ok(fs.existsSync(file),'Missing Mission 01 premium raster: '+file);
 const b=fs.readFileSync(file);
 assert.ok(b.length>1024,'Raster unexpectedly small: '+name);
 assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Not PNG: '+name);
 const w=b.readUInt32BE(16),h=b.readUInt32BE(20);
 assert.ok(w>=256&&h>=256,'Undersized master '+name+': '+w+'x'+h);
 console.log('Mission 01 master OK',name,w,h,b.length);
}
