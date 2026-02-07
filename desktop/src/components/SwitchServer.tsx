import { useState } from "react";

export default function SwitchServer({ onDone }: { onDone: () => void }) {
  const [url, setUrl] = useState(localStorage.getItem("apiBase") || "");

  function save() {
    if (!url) return;
    localStorage.removeItem("token");
    localStorage.setItem("apiBase", url);
    onDone();
  }

  return (
    <div className="panel" style={{ position: "fixed", top: 80, right: 10, width: 360, zIndex: 20 }}>
      <h3>Switch Server</h3>
      <p style={{ color: "#9ca3af" }}>This will clear your session and ask you to log in again.</p>
      <input value={url} onChange={e => setUrl(e.target.value)} style={{ width: "100%" }} />
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button onClick={save}>Connect</button>
        <button className="secondary" onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}