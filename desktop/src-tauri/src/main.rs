#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mdns;
mod tray_health;
mod tray_notify;

use crate::mdns::mdns_discover;
use crate::tray_health::set_tray_health;
use crate::tray_notify::tray_notify;

use tauri::Manager;
use tauri::tray::TrayIconBuilder;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .setup(|app| {
      let icon = app
        .default_window_icon()
        .cloned()
        .expect("No default window icon");

      // Create tray with id "main"
      TrayIconBuilder::new("main", icon)
        .tooltip("STEMFORGE")
        .build(app)
        .expect("failed to create tray icon");

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      mdns_discover,
      set_tray_health,
      tray_notify
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
