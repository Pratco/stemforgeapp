use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;
use tauri_plugin_notification::NotificationExt;
use std::path::PathBuf;

fn notification_icon_path(app: &AppHandle) -> PathBuf {
  let icons_dir = app
    .path()
    .resolve("icons", BaseDirectory::Resource)
    .expect("failed to resolve icons dir");

  let filename = if cfg!(target_os = "windows") {
    "icon.ico"
  } else {
    "icon.png"
  };

  icons_dir.join(filename)
}

#[tauri::command]
pub fn tray_notify(app: AppHandle, title: String, body: String, route: Option<String>) {
  let icon_path = notification_icon_path(&app);

  // Clone what we need inside the click handler
  let app_handle = app.clone();
  let route_to_open = route.unwrap_or_else(|| "/".to_string());

  let result = app
    .notification()
    .builder()
    .title(title)
    .body(body)
    .icon(icon_path)
    .on_click(move || {
      // Show and focus the main window
      if let Some(window) = app_handle.get_window("main") {
        let _ = window.show();
        let _ = window.set_focus();

        // Navigate to a specific page inside your app
        // This assumes your frontend listens for this event
        let _ = window.emit("navigate", route_to_open.clone());
      }

      // macOS: bounce the Dock icon to draw attention
      #[cfg(target_os = "macos")]
      {
        use tauri::AppHandle;
        // Tauri v2 provides a dock API
        let _ = app_handle.dock().bounce();
      }
    })
    .show();

  if let Err(err) = result {
    eprintln!("Failed to show notification: {err}");
  }
}
