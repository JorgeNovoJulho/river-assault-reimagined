use std::time::{Duration, Instant};
use tauri::{ipc::Channel, AppHandle};
use tauri_plugin_updater::UpdaterExt;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct UpdateInfo {
    current_version: String,
    version: Option<String>,
}

#[tauri::command]
async fn river_check_update(app: AppHandle) -> Result<UpdateInfo, String> {
    let current_version = app.package_info().version.to_string();
    let updater = app.updater().map_err(|error| error.to_string())?;
    let update = updater.check().await.map_err(|error| error.to_string())?;
    Ok(UpdateInfo { current_version, version: update.map(|release| release.version) })
}

#[derive(Clone, serde::Serialize)]
struct UpdateProgress {
    phase: &'static str,
    received: Option<u64>,
    total: Option<u64>,
}

#[tauri::command]
async fn river_install_update(app: AppHandle, version: String, on_progress: Channel<UpdateProgress>) -> Result<(), String> {
    let updater = app.updater().map_err(|error| error.to_string())?;
    let update = updater.check().await.map_err(|error| error.to_string())?
        .filter(|release| release.version == version)
        .ok_or_else(|| "A versão disponível mudou. Verifique novamente.".to_owned())?;
    let mut received = 0;
    let mut last_sent = None::<Instant>;
    let bytes = update.download(
        |chunk, total| {
            received += chunk as u64;
            if last_sent.is_none_or(|last| last.elapsed() >= Duration::from_millis(200)) ||
                total.is_some_and(|size| received >= size) {
                last_sent = Some(Instant::now());
                let _ = on_progress.send(UpdateProgress { phase: "downloading", received: Some(received), total });
            }
        },
        || { let _ = on_progress.send(UpdateProgress { phase: "verifying", received: None, total: None }); },
    ).await.map_err(|error| error.to_string())?;
    let _ = on_progress.send(UpdateProgress { phase: "installing", received: None, total: None });
    update.install(bytes).map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![river_check_update, river_install_update])
        .run(tauri::generate_context!())
        .expect("River Storm: failed to run application");
}
