use tauri::AppHandle;

#[tauri::command]
pub fn set_tray_health(app: AppHandle, health: String) {
  // Get tray by the ID we created in main.rs
  let tray = match app.tray_by_id("main") {
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
