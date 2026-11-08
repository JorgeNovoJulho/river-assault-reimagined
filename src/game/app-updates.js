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
const fallback = document.getElementById('rs-update-android-download');
const announcement = document.getElementById('rs-update-announcement');

function isAndroidApp() {
  const bridge = window.Capacitor;
  return !!window.androidBridge ||
    (typeof bridge?.getPlatform === 'function' && bridge.getPlatform() === 'android');
}

function androidUpdater() {
  const bridge = window.Capacitor;
  const plugin = 'RiverUpdate';
  const registered = bridge?.Plugins?.[plugin];
  if (typeof registered?.check === 'function') return registered;
  if (typeof bridge?.nativePromise !== 'function') return null;
  return {
    check: () => bridge.nativePromise(plugin, 'check', {}),
    install: options => bridge.nativePromise(plugin, 'install', options),
    addListener: (event, callback) => bridge.addListener?.(plugin, event, callback)
  };
}

const windows = invoke ? {
  check: () => invoke('river_check_update'),
  install: (version, report) => {
    const onProgress = new window.__TAURI__.core.Channel();
    onProgress.onmessage = report;
    return invoke('river_install_update', { version, onProgress });
  }
} : null;

function boundedCheck(check) {
  let timer;
  return Promise.race([
    Promise.resolve().then(check),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Tempo de verificação esgotado')), 50000);
    })
  ]).finally(() => clearTimeout(timer));
}

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

function openDialog() {
  if (dialog.open) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

async function check(manual) {
  if (manual) openDialog();
  if (busy) return;
  busy = true;
  available = null;
  announcement.hidden = true;
  fallback.hidden = true;
  download.hidden = true;
  next.textContent = '—';
  install.disabled = true;
  status.textContent = 'Verificando atualizações…';
  try {
    const androidApp = !windows && isAndroidApp();
    const native = windows || (androidApp && androidUpdater());
    if (!native && androidApp) throw new Error('RiverUpdate indisponível');
    if (!native) {
      status.textContent = 'Prévia web. O navegador carrega a versão publicada ao abrir o jogo.';
      return;
    }
    const result = await boundedCheck(() => native.check());
    setCurrent(result.currentVersion);
    available = result.version || null;
    if (!available) {
      status.textContent = 'Você já está na versão disponível para esta plataforma.';
      return;
    }
    next.textContent = available;
    install.disabled = false;
    announcement.hidden = false;
    status.textContent = 'Confirme para baixar e instalar a nova versão.';
    const opening = document.getElementById('mode-selection');
    if (!manual && !dialog.open && opening.getClientRects().length &&
        !document.getElementById('start-screen').classList.contains('hidden') &&
        document.getElementById('controller-settings').classList.contains('hidden')) openDialog();
  } catch (error) {
    console.warn('Verificação de atualização indisponível.', error);
    fallback.hidden = !!windows || !isAndroidApp();
    status.textContent = fallback.hidden
      ? 'Não foi possível verificar agora. Confira a conexão ou tente novamente.'
      : 'O Android não conseguiu verificar a atualização. Tente novamente ou abra o download oficial.';
  } finally { busy = false; }
}

document.getElementById('rs-update-open').addEventListener('click', () => check(true));
announcement.addEventListener('click', openDialog);
retry.addEventListener('click', () => check(true));
document.getElementById('rs-update-close').addEventListener('click', () => {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
});
install.addEventListener('click', async () => {
  if (busy || !available) return;
  busy = true;
  install.disabled = true;
  retry.disabled = true;
  showProgress({ phase: 'downloading' });
  try {
    if (typeof saveActiveProgress === 'function') saveActiveProgress();
    let result;
    if (windows) {
      result = await windows.install(available, showProgress);
    } else {
      const android = androidUpdater();
      const listener = await android.addListener?.('updateProgress', showProgress);
      try { result = await android.install({ version: available }); }
      finally {
        try { await listener?.remove(); }
        catch (error) { console.warn('Falha ao remover o monitor de download.', error); }
      }
    }
    if (result?.permissionRequired) download.hidden = true;
    else showProgress({ phase: 'installing' });
    status.textContent = result?.permissionRequired
      ? 'Autorize a instalação nas configurações do Android, volte ao jogo e confirme novamente.'
      : 'Instalador iniciado. Siga as instruções do sistema.';
  } catch {
    download.hidden = true;
    status.textContent = 'Falha no download ou na validação. Verifique novamente antes de tentar.';
    available = null;
    announcement.hidden = true;
    fallback.hidden = !!windows || !isAndroidApp();
  } finally {
    busy = false;
    retry.disabled = false;
    install.disabled = !available;
  }
});
if (windows || isAndroidApp()) check(false);
else if (document.readyState !== 'complete') {
  window.addEventListener('load', () => {
    if (isAndroidApp()) check(false);
  }, { once: true });
}
