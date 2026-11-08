const dialog = document.getElementById('rs-update-dialog');
const status = document.getElementById('rs-update-status');
const install = document.getElementById('rs-update-install');
const indicator = document.getElementById('riverstorm-update-notice');
const current = document.getElementById('rs-update-current');
const next = document.getElementById('rs-update-next');
const webVersion = document.querySelector('meta[name="riverstorm-version"]').content;
const invoke = window.__TAURI__?.core?.invoke;
const android = window.Capacitor?.getPlatform() === 'android'
  ? window.Capacitor.registerPlugin('RiverUpdate') : null;
const native = invoke ? {
  installed: () => window.__TAURI__.app.getVersion(),
  check: () => invoke('river_check_update'),
  install: version => invoke('river_install_update', { version })
} : android ? {
  installed: async () => (await android.installed()).currentVersion,
  check: () => android.check(),
  install: version => android.install({ version })
} : null;

let available = null;
let busy = false;
function setCurrent(version) {
  current.textContent = version;
  indicator.textContent = 'v' + version;
}
setCurrent(webVersion);

async function check(manual) {
  if (manual && !dialog.open) dialog.showModal();
  if (busy) return;
  busy = true;
  available = null;
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
document.getElementById('rs-update-retry').addEventListener('click', () => check(true));
document.getElementById('rs-update-close').addEventListener('click', () => dialog.close());
install.addEventListener('click', async () => {
  if (busy || !available) return;
  busy = true;
  install.disabled = true;
  status.textContent = 'Baixando e verificando o instalador…';
  try {
    if (typeof saveActiveProgress === 'function') saveActiveProgress();
    const result = await native.install(available);
    status.textContent = result?.permissionRequired
      ? 'Autorize a instalação nas configurações do Android, volte ao jogo e confirme novamente.'
      : 'Instalador iniciado. Siga as instruções do sistema.';
  } catch {
    status.textContent = 'Falha no download ou na validação. Verifique novamente antes de tentar.';
    available = null;
  } finally {
    busy = false;
    install.disabled = !available;
  }
});
if (native) check(false);
