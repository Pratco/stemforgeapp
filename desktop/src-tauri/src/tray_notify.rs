use tauri::{AppHandle, Manager};
use tauri_plugin_notification::NotificationExt;

#[tauri::command]
pub fn tray_notify(app: AppHandle, title: String, body: String, route: Option<String>) {
  let _ = app
    .notification()
    .builder()
    .title(title)
    .body(body)
    .show();

  // Bring app to front and optionally navigate
  if let Some(window) = app.get_webview_window("main") {
    let _ = window.show();
    let _ = window.set_focus();

    if let Some(route) = route {
      let _ = window.eval(&format!("window.dispatchEvent(new CustomEvent('navigate', {{ detail: '{}' }}));", route));
    }
  }
}
