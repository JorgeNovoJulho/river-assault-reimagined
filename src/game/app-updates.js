const dialog = document.getElementById('rs-update-dialog');
const status = document.getElementById('rs-update-status');
const install = document.getElementById('rs-update-install');
const retry = document.getElementById('rs-update-retry');
const download = document.getElementById('rs-update-download');
const bar = document.getElementById('rs-update-progress');
const downloadText = document.getElementById('rs-update-progress-text');
const indicator = document.getElementById('riverstorm-update-notice');
const current = document.getElementById('rs-update-current');
const next = document.getElementById('rs-update-next');
const webVersion = document.querySelector('meta[name="riverstorm-version"]').content;
const invoke = window.__TAURI__?.core?.invoke;
const capacitor = window.Capacitor;
function androidUpdater(bridge) {
  if (bridge?.getPlatform?.() !== 'android') return null;
  const plugin = 'RiverUpdate';
  if (typeof bridge.registerPlugin === 'function') return bridge.registerPlugin(plugin);
  // O bridge injetado pelo Android também funciona sem o runtime web do Capacitor.
  if (typeof bridge.nativePromise !== 'function' || typeof bridge.addListener !== 'function') return null;
  return {
    installed: () => bridge.nativePromise(plugin, 'installed', {}),
    check: () => bridge.nativePromise(plugin, 'check', {}),
    install: options => bridge.nativePromise(plugin, 'install', options),
    addListener: (event, callback) => bridge.addListener(plugin, event, callback)
  };
}
const android = androidUpdater(capacitor);
const native = invoke ? {
  installed: () => window.__TAURI__.app.getVersion(),
  check: () => invoke('river_check_update'),
  install: (version, report) => {
    const onProgress = new window.__TAURI__.core.Channel();
    onProgress.onmessage = report;
    return invoke('river_install_update', { version, onProgress });
  }
} : android ? {
  installed: async () => (await android.installed()).currentVersion,
  check: () => android.check(),
  install: async (version, report) => {
    const listener = await android.addListener('updateProgress', report);
    try { return await android.install({ version }); }
    finally { await listener.remove().catch(() => {}); }
  }
} : null;

let available = null;
let busy = false;
function setCurrent(version) {
  current.textContent = version;
  indicator.textContent = 'v' + version;
}
setCurrent(webVersion);

const megabytes = bytes => (bytes / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' MB';
function showProgress({ phase, received, total }) {
  download.hidden = false;
  if (phase === 'verifying' || phase === 'installing') {
    bar.value = 100;
    downloadText.textContent = 'Download concluído';
    status.textContent = phase === 'verifying' ? 'Verificando o instalador…' : 'Abrindo o instalador do sistema…';
  } else {
    status.textContent = 'Baixando o instalador…';
    if (Number.isFinite(total) && total > 0) {
      const percent = Math.min(100, Math.floor((received || 0) / total * 100));
      bar.value = percent;
      downloadText.textContent = percent + '% · ' + megabytes(received || 0) + ' de ' + megabytes(total);
    } else {
      bar.removeAttribute('value');
      downloadText.textContent = received > 0 ? megabytes(received) + ' baixados' : 'Aguardando os primeiros dados…';
    }
  }
}

async function check(manual) {
  if (manual && !dialog.open) dialog.showModal();
  if (busy) return;
  busy = true;
  available = null;
  download.hidden = true;
  next.textContent = '—';
  install.disabled = true;
  status.textContent = 'Verificando atualizações…';
  try {
    if (!native) {
      status.textContent = 'Prévia web. O navegador carrega a versão publicada ao abrir o jogo.';
      return;
    }
    setCurrent(await native.installed());
    const result = await native.check();
    setCurrent(result.currentVersion);
    available = result.version || null;
    if (!available) {
      status.textContent = 'Você já está na versão disponível para esta plataforma.';
      return;
    }
    next.textContent = available;
    install.disabled = false;
    indicator.textContent += ' · atualização disponível';
    status.textContent = 'Confirme para baixar e instalar a nova versão.';
    const opening = document.getElementById('mode-selection');
    if (!manual && !dialog.open && opening.getClientRects().length &&
        !document.getElementById('start-screen').classList.contains('hidden') &&
        document.getElementById('controller-settings').classList.contains('hidden')) dialog.showModal();
  } catch {
    status.textContent = 'Não foi possível verificar agora. Confira a conexão ou tente novamente.';
  } finally { busy = false; }
}

document.getElementById('rs-update-open').addEventListener('click', () => check(true));
retry.addEventListener('click', () => check(true));
document.getElementById('rs-update-close').addEventListener('click', () => dialog.close());
install.addEventListener('click', async () => {
  if (busy || !available) return;
  busy = true;
  install.disabled = true;
  retry.disabled = true;
  showProgress({ phase: 'downloading' });
  try {
    if (typeof saveActiveProgress === 'function') saveActiveProgress();
    const result = await native.install(available, showProgress);
    if (result?.permissionRequired) download.hidden = true;
    else showProgress({ phase: 'installing' });
    status.textContent = result?.permissionRequired
      ? 'Autorize a instalação nas configurações do Android, volte ao jogo e confirme novamente.'
      : 'Instalador iniciado. Siga as instruções do sistema.';
  } catch {
    download.hidden = true;
    status.textContent = 'Falha no download ou na validação. Verifique novamente antes de tentar.';
    available = null;
  } finally {
    busy = false;
    retry.disabled = false;
    install.disabled = !available;
  }
});
if (native) check(false);
