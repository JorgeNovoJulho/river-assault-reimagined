/* Gamepad adapter: browser Gamepad API; no external dependency. */
(function(global) {
  'use strict';
  class RiverGamepadInput {
    constructor() {
      this.previous = {fire:false,bomb:false,pause:false,start:false};
      this.deadzone = 0.22;
      this.connected = false;
    }
    poll() {
      const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
      const pad = Array.from(pads).find(p => p && p.connected && p.mapping === 'standard')
               || Array.from(pads).find(p => p && p.connected);
      this.connected = !!pad;
      if (!pad) {
        this.previous = {fire:false,bomb:false,pause:false,start:false};
        return {left:false,right:false,up:false,down:false,fire:false,bomb:false,pause:false,start:false,justBomb:false,justPause:false,justStart:false,connected:false};
      }
      const axis = (i) => Math.abs(pad.axes[i] || 0) < this.deadzone ? 0 : pad.axes[i];
      const pressed = (i) => !!pad.buttons[i] && (pad.buttons[i].pressed || pad.buttons[i].value > 0.5);
      const x = axis(0), y = axis(1);
      const now = {
        left: x < -this.deadzone || pressed(14),
        right: x > this.deadzone || pressed(15),
        up: y < -this.deadzone || pressed(12),
        down: y > this.deadzone || pressed(13),
        fire: pressed(0) || pressed(5) || pressed(7),
        bomb: pressed(1) || pressed(2),
        pause: pressed(9),
        start: pressed(9)
      };
      now.justBomb = now.bomb && !this.previous.bomb;
      now.justPause = now.pause && !this.previous.pause;
      now.justStart = now.start && !this.previous.start;
      this.previous = {fire:now.fire,bomb:now.bomb,pause:now.pause,start:now.start};
      return {...now,connected:true};
    }
  }
  global.RiverGamepadInput = RiverGamepadInput;
})(window);
