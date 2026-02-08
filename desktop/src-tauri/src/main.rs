#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mdns;
mod tray_health;
mod tray_notify;

use crate::mdns::mdns_discover;
use crate::tray_health::set_tray_health;
use crate::tray_notify::tray_notify;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .invoke_handler(tauri::generate_handler![
      mdns_discover,
      set_tray_health,
      tray_notify
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}