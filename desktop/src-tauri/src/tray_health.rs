use tauri::SystemTrayHandle;

#[tauri::command]
pub fn set_tray_health(app: tauri::AppHandle, health: String) {
    let tray: SystemTrayHandle = app.tray_handle();
    let icon_path = match health.as_str() {
        "green" => "icons/tray_green.png",
        "yellow" => "icons/tray_yellow.png",
        _ => "icons/tray_red.png",
    };
    let _ = tray.set_icon(tauri::Icon::File(icon_path.into()));
}