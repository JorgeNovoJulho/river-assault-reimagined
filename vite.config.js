import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const legacyScripts = [
  'src/input/gamepad.js',
  'src/game/aircraft.js',
  'src/game/clock.js',
  'src/game/pilot-progress.js',
  'src/game/campaign.js',
  'src/render/scene2d5.js',
  'src/audio/music.js',
  'src/audio/sfx-modern.js',
  'src/audio/playlist.js',
  'src/net/room-lobby.js'
];

function copyAndVersionRuntime() {
  return {
    name: 'riverstorm-versioned-runtime',
    apply: 'build',
    closeBundle() {
      const buildId = (process.env.GITHUB_SHA || process.env.RIVER_BUILD_ID || String(Date.now()))
        .replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
      const indexPath = resolve('dist/index.html');
      let html = readFileSync(indexPath, 'utf8');
      for (const file of legacyScripts) {
        const source = resolve(file), target = resolve('dist', file);
        if (!existsSync(source)) throw new Error('Script obrigatório ausente: '+file);
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(source, target);
        html = html.split('src="./'+file+'"').join('src="./'+file+'?build='+buildId+'"');
      }
      html = html.split('href="./src/styles/tailwind.css"')
        .join('href="./src/styles/tailwind.css?build='+buildId+'"');
      html = html.replace('</head>',
        '<meta name="riverstorm-build" content="'+buildId+'">\n</head>');
      for(const file of ['assets/sprites/projectiles/plasma-blue.svg','assets/sprites/projectiles/plasma-red.svg','assets/sprites/bosses/iron-wasp.svg','assets/sprites/bosses/abyss-manta.svg','assets/sprites/bosses/crimson-rotor.svg','assets/sprites/bosses/granite-dam.svg','assets/sprites/bosses/crimson-spider.svg','assets/sprites/bosses/frost-sentinel.svg','assets/sprites/bosses/storm-mantis.svg','assets/sprites/bosses/neon-leviathan.svg','assets/sprites/bosses/inferno-dredger.svg','assets/sprites/bosses/glacier-titan.svg','assets/sprites/bosses/solar-vulture.svg','assets/sprites/bosses/night-harvester.svg']){
        const source=resolve(file),target=resolve('dist',file);
        if(!existsSync(source))throw new Error('Sprite obrigatorio ausente: '+file);
        mkdirSync(dirname(target),{recursive:true});copyFileSync(source,target);
      }
      writeFileSync(indexPath, html);
      writeFileSync(resolve('dist/build-info.json'), JSON.stringify({
        build: buildId, release: '0.5.6', timestamp: new Date().toISOString()
      }, null, 2));
    }
  };
}

export default defineConfig({
  base: './',
  build: { target: 'es2020' },
  plugins: [copyAndVersionRuntime()]
});
