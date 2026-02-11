import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function ServerSelector({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [servers, setServers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const found: string[] = await invoke("mdns_discover");
        setServers(found);
      } catch {
        setServers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="panel" style={{ position: "fixed", top: 80, right: 10, width: 420, zIndex: 30 }}>
      <h3>Select STEMFORGE Server</h3>
      {loading && <div>Searching on LAN…</div>}
      {!loading && servers.length === 0 && <div>No servers found.</div>}
      <ul>
        {servers.map(s => (
          <li key={s} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span>{s}</span>
            <button onClick={() => onPick(s)}>Use</button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}