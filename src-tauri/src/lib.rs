use tauri::AppHandle;
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

#[tauri::command]
async fn river_install_update(app: AppHandle, version: String) -> Result<(), String> {
    let updater = app.updater().map_err(|error| error.to_string())?;
    let update = updater.check().await.map_err(|error| error.to_string())?
        .filter(|release| release.version == version)
        .ok_or_else(|| "A versão disponível mudou. Verifique novamente.".to_owned())?;
    update.download_and_install(|_, _| {}, || {}).await.map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![river_check_update, river_install_update])
        .run(tauri::generate_context!())
        .expect("River Storm: failed to run application");
}
