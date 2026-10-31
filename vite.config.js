import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
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
      for(const file of ['assets/sprites/terrain/water-detail.svg','assets/sprites/terrain/river-island-detail.svg','assets/sprites/terrain/bridge-steel-detail.svg','assets/sprites/fx/explosion-ring.svg','assets/sprites/player/riverstorm-fighter.svg','assets/sprites/terrain/river-bank-left.svg','assets/sprites/terrain/river-bank-right.svg','assets/sprites/projectiles/plasma-blue.svg','assets/sprites/projectiles/plasma-red.svg','assets/sprites/bosses/iron-wasp.svg','assets/sprites/bosses/abyss-manta.svg','assets/sprites/bosses/crimson-rotor.svg','assets/sprites/bosses/granite-dam.svg','assets/sprites/bosses/crimson-spider.svg','assets/sprites/bosses/frost-sentinel.svg','assets/sprites/bosses/storm-mantis.svg','assets/sprites/bosses/neon-leviathan.svg','assets/sprites/bosses/inferno-dredger.svg','assets/sprites/bosses/glacier-titan.svg','assets/sprites/bosses/solar-vulture.svg','assets/sprites/bosses/night-harvester.svg','assets/sprites/bosses/thunder-serpent.svg','assets/sprites/bosses/blizzard-hydra.svg','assets/sprites/bosses/desert-reaper.svg','assets/sprites/bosses/abyssal-jellyfish.svg','assets/sprites/bosses/forge-colossus.svg','assets/sprites/bosses/polar-scythe.svg','assets/sprites/bosses/phantom-fortress.svg','assets/sprites/bosses/omega-overlord.svg','assets/sprites/terrain/island-tropical.svg','assets/sprites/terrain/island-rock.svg','assets/sprites/terrain/bridge-industrial.svg','assets/sprites/terrain/dam-concrete.svg','assets/sprites/terrain/bridge-damaged.svg','assets/sprites/terrain/dam-damaged.svg','assets/sprites/terrain/island-scorched.svg','assets/sprites/enemies/mecha-gun.svg','assets/sprites/enemies/mecha-sword.svg','assets/sprites/enemies/helicopter.svg','assets/sprites/enemies/submarine.svg','assets/sprites/enemies/tank.svg','assets/sprites/enemies/turret.svg','assets/sprites/enemies/ship.svg','assets/sprites/enemies/jet.svg','assets/sprites/enemies/zigzag.svg']){
        const source=resolve(file),target=resolve('dist',file);
        if(!existsSync(source))throw new Error('Sprite obrigatorio ausente: '+file);
        mkdirSync(dirname(target),{recursive:true});copyFileSync(source,target);
      }
      // Texturas da arena experimental, versionadas na biblioteca oficial.
      for (const file of [
        'assets/sprites/premium/environment/river-water-v1.svg',
        'assets/sprites/premium/environment/river-bank-left-v1.svg',
        'assets/sprites/premium/environment/river-bank-right-v1.svg'
      ]) {
        const source = resolve(file), target = resolve('dist', file);
        if (!existsSync(source)) throw new Error('Cenário premium ausente: ' + file);
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(source, target);
      }
      // Copiar texturas raster opcionais do cenário quando homologadas.
      for (const file of [
        'assets/sprites/premium/runtime/environment/water_calm.png',
        'assets/sprites/premium/runtime/environment/riverbank_left.png',
        'assets/sprites/premium/runtime/environment/riverbank_right.png'
      ]) {
        const source=resolve(file), target=resolve('dist',file);
        if (existsSync(source)) {
          mkdirSync(dirname(target),{recursive:true});
          copyFileSync(source,target);
        }
      }
      // Copiar as texturas premium aprovadas; os SVGs legados continuam intactos.
      for (const file of [
        'assets/sprites/premium/runtime/player/fighter_candidate.png',
        'assets/sprites/premium/runtime/fx/explosion_atlas_4x3.png',
        'assets/sprites/premium/runtime/environment/water_calm.png',
        'assets/sprites/premium/runtime/environment/riverbank_left.png',
        'assets/sprites/premium/runtime/environment/riverbank_right.png',
        'assets/sprites/premium/runtime/boss01/core.png',
        'assets/sprites/premium/runtime/boss01/tower1.png',
        'assets/sprites/premium/runtime/boss01/tower2.png',
        'assets/sprites/premium/runtime/boss01/towerFire.png',
        'assets/sprites/premium/runtime/boss01/cannon.png',
        'assets/sprites/premium/runtime/boss01/cannonFire.png',
        'assets/sprites/premium/runtime/boss01/cannonDamaged.png',
        'assets/sprites/premium/runtime/boss01/cannonDestroyed.png',
        'assets/sprites/premium/runtime/boss01/areaHelicopter.png',
        'assets/sprites/premium/runtime/boss01/areaMecha.png',
        'assets/sprites/premium/runtime/boss01/areaSubmarine.png',
        'assets/sprites/premium/runtime/terrain/island_river.png',
        'assets/sprites/premium/runtime/shore/turret.png',
        'assets/sprites/premium/runtime/shore/tank.png',
        'assets/sprites/premium/runtime/weapons/player_bolt.png',
        'assets/sprites/premium/runtime/weapons/enemy_bolt.png'
      ]) {
        const source = resolve(file), target = resolve('dist', file);
        if (!existsSync(source)) throw new Error('Imagem premium obrigatória ausente: ' + file);
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(source, target);
      }
      // Recursos aprovados do menu: não são importações de JS, por isso devem
      // ser copiados explicitamente para o Pages; sem isso os cartões dão 404.
      for (const folder of ['assets/ui/premium/pilots', 'assets/ui/premium/menu', 'music']) {
        const sourceDir=resolve(folder);
        if (!existsSync(sourceDir)) continue;
        for (const fileName of readdirSync(sourceDir)) {
          if (!/\\.(png|jpg|jpeg|webp|opus|mp3|ogg|wav)$/i.test(fileName)) continue;
          const from=resolve(folder,fileName),to=resolve('dist',folder,fileName);
          mkdirSync(dirname(to),{recursive:true});
          copyFileSync(from,to);
        }
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
  build: { target: 'es2020', rollupOptions: { input: { game: resolve('index.html'), phaserLab: resolve('phaser-lab.html'), boss01Test: resolve('boss01-test.html') } } },
  plugins: [copyAndVersionRuntime()]
});
