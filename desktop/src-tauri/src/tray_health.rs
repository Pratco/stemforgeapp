use tauri::{AppHandle, Manager};
use tauri::image::Image;
use tauri::path::BaseDirectory;
use std::path::PathBuf;

fn tray_icon_path(app: &AppHandle, name: &str) -> PathBuf {
    let icons_dir = app
        .path()
        .resolve("icons", BaseDirectory::Resource)
        .expect("failed to resolve icons dir");

    let filename = if cfg!(target_os = "windows") {
        format!("{name}.ico")
    } else {
        format!("{name}.png")
    };

    icons_dir.join(filename)
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

    let path = tray_icon_path(&app, icon_name);

    match Image::from_path(path) {
        Ok(image) => {
            let _ = tray.set_icon(Some(image));
        }
        Err(err) => {
            eprintln!("Failed to load tray icon: {err}");
        }
    }
}
