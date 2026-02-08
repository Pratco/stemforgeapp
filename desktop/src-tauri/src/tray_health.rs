use tauri::{AppHandle, Manager};
use std::path::PathBuf;

fn tray_icon_path(app: &AppHandle, name: &str) -> PathBuf {
    let base = app
        .path()
        .resolve("icons", tauri::path::BaseDirectory::Resource)
        .expect("failed to resolve icons dir");

    let filename = if cfg!(target_os = "windows") {
        format!("{name}.ico")
    } else {
        format!("{name}.png")
    };

    base.join(filename)
}

pub fn set_tray_health(app: &AppHandle, status: &str) {
    let tray = app.tray_by_id("main").expect("tray not found");

    let icon_name = match status {
        "green" => "tray_green",
        "yellow" => "tray_yellow",
        "red" => "tray_red",
        _ => "tray_yellow",
    };

    let path = tray_icon_path(app, icon_name);

    let _ = tray.set_icon(Some(
        tauri::image::Image::from_path(path).expect("failed to load tray icon"),
    ));
}
