use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;
use std::fs;

fn tray_icon_bytes(app: &AppHandle, name: &str) -> Option<Vec<u8>> {
  let icons_dir = app
    .path()
    .resolve("icons", BaseDirectory::Resource)
    .ok()?;

  let filename = if cfg!(target_os = "windows") {
    format!("{name}.ico")
  } else {
    format!("{name}.png")
  };

  let path = icons_dir.join(filename);
  fs::read(path).ok()
}

#[tauri::command]
pub fn set_tray_health(app: AppHandle, health: String) {
  let tray = match app.tray_by_id("main") {
    Some(t) => t,
    None => {
      eprintln!("Tray not found");
      return;
    }
  };

  let icon_name = match health.as_str() {
    "green" => "tray_green",
    "yellow" => "tray_yellow",
    "red" => "tray_red",
    _ => "tray_yellow",
  };

  if let Some(bytes) = tray_icon_bytes(&app, icon_name) {
    let _ = tray.set_icon(Some(bytes));
  } else {
    eprintln!("Failed to load tray icon bytes");
  }
}
