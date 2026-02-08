use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn set_tray_health(app: AppHandle, health: String) {
  let tray = match app.tray() {
    Some(t) => t,
    None => {
      eprintln!("Tray not found");
      return;
    }
  };

  let label = match health.as_str() {
    "green" => "STEMFORGE — Connected",
    "yellow" => "STEMFORGE — Connecting",
    "red" => "STEMFORGE — Disconnected",
    _ => "STEMFORGE",
  };

  let _ = tray.set_tooltip(Some(label.to_string()));
}
