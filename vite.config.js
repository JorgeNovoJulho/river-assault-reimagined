import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// Legacy window-global scripts need to be delivered intact and in their original order.
// Vite does NOT bundle classic scripts from index.html. Missing them breaks EVERY button.
const legacyScripts = [
  'src/input/gamepad.js',
  'src/game/aircraft.js',
  'src/game/clock.js',
  'src/game/campaign.js',
  'src/render/scene2d5.js',
  'src/audio/music.js',
  'src/audio/playlist.js'
];
function includeRuntimeScripts() {
  return {
    name: 'river-assault-copy-runtime',
    apply: 'build',
    closeBundle() {
      for (const relativePath of legacyScripts) {
        const origin = resolve(relativePath);
        const target = resolve('dist', relativePath);
        if (!existsSync(origin)) throw new Error('Falta script essencial: ' + relativePath);
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(origin, target);
      }
    }
  };
}
export default defineConfig({
  base: './',
  build: { target: 'es2020' },
  plugins: [includeRuntimeScripts()]
});
