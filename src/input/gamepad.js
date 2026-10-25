/* Entrada física única: Gamepad API para USB/Bluetooth, com preferências locais. */
(function(global) {
'use strict';
const DEFAULTS={deadzone:0.22,fire:0,bomb:1,pause:9};
class RiverGamepadInput {
 constructor(){
  this.settings={...DEFAULTS};
  try {const p=JSON.parse(localStorage.getItem('river_gamepad_settings')||'null');if(p)this.configure(p)}catch(e){}
  this.previous={bomb:false,pause:false};
  this.connected=false;this.name='';this.index=-1;this.lastButtons=[];
 }
 configure(changes){
  const n={...this.settings,...changes};
  n.deadzone=Math.max(0.08,Math.min(0.55,Number(n.deadzone)||DEFAULTS.deadzone));
  for(const key of ['fire','bomb','pause'])n[key]=Number.isInteger(Number(n[key]))&&Number(n[key])>=0&&Number(n[key])<32?Number(n[key]):DEFAULTS[key];
  this.settings=n;
  try{localStorage.setItem('river_gamepad_settings',JSON.stringify(n))}catch(e){}
 }
 reset(){this.configure(DEFAULTS)}
 getPad(){
  const pads=typeof navigator.getGamepads==='function'?Array.from(navigator.getGamepads()).filter(Boolean):[];
  return pads.find(p=>p.connected&&p.index===this.index)||pads.find(p=>p.connected&&p.mapping==='standard')||pads.find(p=>p.connected)||null;
 }
 poll(){
  const pad=this.getPad();
  if(!pad){
   this.connected=false;this.name='';this.index=-1;this.previous={bomb:false,pause:false};this.lastButtons=[];
   return {connected:false,left:false,right:false,up:false,down:false,fire:false,bomb:false,pause:false,justBomb:false,justPause:false,justStart:false};
  }
  this.connected=true;this.index=pad.index;this.name=pad.id||'Controle conectado';
  const pressed=i=>!!pad.buttons[i]&&(pad.buttons[i].pressed||pad.buttons[i].value>0.5);
  this.lastButtons=pad.buttons.map((_,i)=>pressed(i));
  const a=i=>Math.abs(pad.axes[i]||0)>=this.settings.deadzone?(pad.axes[i]||0):0;
  const x=a(0),y=a(1);
  const now={connected:true,left:x<0||pressed(14),right:x>0||pressed(15),up:y<0||pressed(12),down:y>0||pressed(13),fire:pressed(this.settings.fire),bomb:pressed(this.settings.bomb),pause:pressed(this.settings.pause)};
  now.justBomb=now.bomb&&!this.previous.bomb;now.justPause=now.pause&&!this.previous.pause;now.justStart=now.justPause;
  this.previous={bomb:now.bomb,pause:now.pause};
  return now;
 }
}
global.RiverGamepadInput=RiverGamepadInput;
})(window);
