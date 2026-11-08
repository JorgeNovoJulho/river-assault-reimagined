import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const repository = 'https://github.com/JorgeNovoJulho/river-assault-reimagined/releases';
const [mode, tag = 'v' + JSON.parse(readFileSync('package.json', 'utf8')).version] = process.argv.slice(2);
if (!/^v(0|[1-9]\d{0,3})\.(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})$/.test(tag)) {
  throw new Error('A release requer uma tag vMAJOR.MINOR.PATCH estável');
}
const version = tag.slice(1);
const [major, minor, patch] = version.split('.').map(Number);
const versionCode = major * 1000000 + minor * 1000 + patch;
if (versionCode < 1 || versionCode > 2100000000) throw new Error('Versão fora dos limites do Android');

function json(path, value) { writeFileSync(path, JSON.stringify(value, null, 2) + '\n'); }
function replaceOnce(path, pattern, replacement) {
  const before = readFileSync(path, 'utf8');
  if (!pattern.test(before)) throw new Error('Modelo Android inesperado: ' + path);
  writeFileSync(path, before.replace(pattern, replacement));
}
switch (mode) {
  case 'android': {
    const root = 'android/app/src/main';
    const java = root + '/java/com/riverstorm/game';
    const manifest = root + '/AndroidManifest.xml';
    const activity = java + '/MainActivity.java';
    copyFileSync('native/android/RiverUpdate.java', java + '/RiverUpdate.java');
    for (const density of ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi']) {
      const path = '/mipmap-' + density + '/riverstorm_launcher.png';
      copyFileSync('native/branding' + path, root + '/res' + path);
    }
    if (!readFileSync(manifest, 'utf8').includes('@mipmap/riverstorm_launcher')) {
      replaceOnce(manifest, /@mipmap\/ic_launcher(?:_round)?/g, '@mipmap/riverstorm_launcher');
    }
    if (!readFileSync(activity, 'utf8').includes('registerPlugin(RiverUpdate.class)')) {
      replaceOnce(activity, /class MainActivity extends BridgeActivity\s*\{/, match => match + `
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(RiverUpdate.class);
        super.onCreate(savedInstanceState);
    }
`);
    }
    if (!readFileSync(manifest, 'utf8').includes('android.permission.REQUEST_INSTALL_PACKAGES')) {
      replaceOnce(manifest, /<\/manifest>/, '    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />\n</manifest>');
    }
    replaceOnce('android/app/build.gradle', /versionCode \d+/, 'versionCode ' + versionCode);
    replaceOnce('android/app/build.gradle', /versionName "[^"]+"/, 'versionName "' + version + '"');
    break;
  }
  case 'windows': {
    const pubkey = process.env.RIVER_UPDATE_PUBLIC_KEY?.trim();
    if (!pubkey || !process.env.TAURI_SIGNING_PRIVATE_KEY) throw new Error('Configure as chaves de assinatura do Tauri');
    json('src-tauri/update.release.json', {
      version,
      bundle: { createUpdaterArtifacts: true },
      plugins: { updater: { pubkey, endpoints: [repository + '/latest/download/latest.json'] } }
    });
    break;
  }
  case 'manifest': {
    const directory = resolve('release-assets');
    const installer = 'riverstorm-windows-x64.exe';
    const android = 'riverstorm-android.apk';
    if (!existsSync(resolve(directory, installer))) throw new Error('Instalador Windows ausente');
    const signature = readFileSync(resolve(directory, installer + '.sig'), 'utf8').trim();
    if (!signature) throw new Error('Assinatura Windows ausente');
    const url = repository + '/download/' + tag + '/';
    const sha256 = createHash('sha256').update(readFileSync(resolve(directory, android))).digest('hex');
    json(resolve(directory, 'latest.json'), {
      version,
      platforms: { 'windows-x86_64': { url: url + installer, signature } }
    });
    json(resolve(directory, 'android-update.json'), { version, versionCode, sha256 });
    break;
  }
  default: throw new Error('Use android, windows ou manifest');
}
