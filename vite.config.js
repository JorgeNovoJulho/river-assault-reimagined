import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
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
  'src/audio/sfx-modern.js',
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
      // Cada compilação recebe seu próprio identificador para evitar scripts antigos no cache.
      const buildId=(process.env.GITHUB_SHA||process.env.RIVER_BUILD_ID||String(Date.now())).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40);
      const indexPath=resolve('dist/index.html');
      let html=readFileSync(indexPath,'utf8');
      for (const relativePath of legacyScripts) {
        const escaped=relativePath.replace(/[.*+?^${}()|[\]\\]/g,'\\        copyFileSync(origin, target);
      }
    }');
        html=html.replace(new RegExp('src="\\./'+escaped+'(?:\\?[^\"]*)?"','g'), 'src="./'+relativePath+'?build='+buildId+'"');
      }
      html=html.replace(/(<link[^>]+href="\.\/src\/styles\/tailwind\.css)(?:\?[^\"]*)?("[^>]*>)/g, '$1?build='+buildId+'$2');
      html=html.replace('</head>','<meta name="riverstorm-build" content="'+buildId+'">\\n</head>');
      writeFileSync(indexPath,html);
      writeFileSync(resolve('dist/build-info.json'),JSON.stringify({build:buildId,release:'0.5.6',timestamp:new Date().toISOString()},null,2));
    }
  };
}
export default defineConfig({
  base: './',
  build: { target: 'es2020' },
  plugins: [includeRuntimeScripts()]
});
