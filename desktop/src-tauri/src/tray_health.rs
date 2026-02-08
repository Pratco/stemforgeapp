use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;
use tauri::image::Image;
use std::fs;

fn tray_icon_image(app: &AppHandle, name: &str) -> Option<Image<'static>> {
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
  let bytes = fs::read(path).ok()?;

  Image::from_bytes(bytes).ok()
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

  if let Some(image) = tray_icon_image(&app, icon_name) {
    let _ = tray.set_icon(Some(image));
  } else {
    eprintln!("Failed to load tray icon image");
  }
}
