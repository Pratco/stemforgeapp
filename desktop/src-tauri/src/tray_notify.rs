use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

#[tauri::command]
pub fn tray_notify(app: AppHandle, title: String, body: String) {
  let _ = app
    .notification()
    .builder()
    .title(title)
    .body(body)
    .show();
}