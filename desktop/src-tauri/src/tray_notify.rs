use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;
use tauri::Emitter;
use tauri_plugin_notification::NotificationExt;

fn notification_icon_string(app: &AppHandle) -> Option<String> {
  let icons_dir = app
    .path()
    .resolve("icons", BaseDirectory::Resource)
    .ok()?;

  let filename = if cfg!(target_os = "windows") {
    "icon.ico"
  } else {
    "icon.png"
  };

  Some(icons_dir.join(filename).to_string_lossy().to_string())
}

#[tauri::command]
pub fn tray_notify(app: AppHandle, title: String, body: String, route: Option<String>) {
  let icon = notification_icon_string(&app).unwrap_or_default();

  let _ = app
    .notification()
    .builder()
    .title(title)
    .body(body)
    .icon(icon)
    .show();

  // Bring app to front and navigate
  if let Some(window) = app.get_webview_window("main") {
    let _ = window.show();
    let _ = window.set_focus();

    if let Some(route) = route {
      let _ = window.emit("navigate", route);
    }
  }

  // macOS: bounce dock
  #[cfg(target_os = "macos")]
  {
    let _ = app.dock().bounce();
  }
}
