use tauri::{AppHandle};

#[tauri::command]
pub fn tray_notify(app: AppHandle, title: String, body: String) {
    let _ = tauri::api::notification::Notification::new(&app.config().tauri.bundle.identifier)
        .title(&title)
        .body(&body)
        .show();
}