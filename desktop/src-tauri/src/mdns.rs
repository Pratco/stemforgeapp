use mdns_sd::{ServiceDaemon, ServiceEvent};
use std::time::Duration;

#[tauri::command]
pub async fn mdns_discover() -> Vec<String> {
    let mdns = ServiceDaemon::new().expect("mdns init failed");
    let receiver = mdns.browse("_stemforge._tcp.local.").expect("browse failed");

    let mut found: Vec<String> = Vec::new();
    let start = std::time::Instant::now();

    while start.elapsed() < Duration::from_secs(3) {
        if let Ok(event) = receiver.recv_timeout(Duration::from_millis(300)) {
            if let ServiceEvent::ServiceResolved(info) = event {
                for addr in info.get_addresses() {
                    let url = format!("http://{}:{}", addr, info.get_port());
                    if !found.contains(&url) {
                        found.push(url);
                    }
                }
            }
        }
    }
    found
}