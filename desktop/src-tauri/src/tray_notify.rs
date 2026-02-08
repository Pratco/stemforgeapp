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
pub fn tray_notify(app: AppHandle, title: String, body: String) {
  let icon_path = notification_icon_path(&app);

  let result = app
    .notification()
    .builder()
    .title(title)
    .body(body)
    .icon(icon_path)
    .on_click(move || {
      // When user clicks the notification, show and focus the main window
      if let Some(window) = app.get_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
      }
    })
    .show();

  if let Err(err) = result {
    eprintln!("Failed to show notification: {err}");
  }
}
