#[tauri::command]
pub fn set_tray_health(_app: tauri::AppHandle, _health: String) {
  // TODO: Implement real tray icon switching using Tauri v2 tray plugin.
  // For now, keep this as a no-op so the app compiles and runs.
}