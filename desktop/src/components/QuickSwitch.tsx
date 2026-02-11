import { useEffect, useState } from "react";
import { getRecents, getProfile } from "../storage";

export default function QuickSwitch({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => { setItems(getRecents()); }, []);

  return (
    <div className="panel" style={{ position: "fixed", top: 80, right: 10, width: 360, zIndex: 40 }}>
      <h3>Quick Switch (Last 5)</h3>
      {items.length === 0 && <div>No recent servers.</div>}
      <ul>
        {items.map(u => {
          const p = getProfile(u);
          return (
            <li key={u} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>
                <span style={{ display: "inline-block", width: 10, height: 10, background: p?.color || "#9ca3af", borderRadius: "50%", marginRight: 6 }} />
                {p?.name || u}
              </span>
              <button onClick={() => onPick(u)}>Use</button>
            </li>
          );
        })}
      </ul>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}