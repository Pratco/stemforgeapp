import { useEffect, useRef, useState } from "react";
import { readJwt } from "../authUtils";
import { invoke } from "@tauri-apps/api/tauri";
import { rememberRecent } from "../storage";

type Health = "green" | "yellow" | "red";

async function pingHealth(apiBase: string): Promise<{ health: Health; ms: number | null }> {
  try {
    const t0 = performance.now();
    const r = await fetch(apiBase + "/api/health", { cache: "no-store" });
    const dt = performance.now() - t0;
    if (!r.ok) return { health: "red", ms: null };
    if (dt < 800) return { health: "green", ms: Math.round(dt) };
    if (dt < 2000) return { health: "yellow", ms: Math.round(dt) };
    return { health: "red", ms: Math.round(dt) };
  } catch {
    return { health: "red", ms: null };
  }
}

export default function StatusBar({
  onSwitch,
  onReconnectNow,
  onOpenSelector,
  onOpenQuick
}: {
  onSwitch: () => void;
  onReconnectNow: () => void;
  onOpenSelector: () => void;
  onOpenQuick: () => void;
}) {
  const [apiBase, setApiBase] = useState<string | null>(null);
  const [health, setHealth] = useState<Health>("red");
  const [ms, setMs] = useState<number | null>(null);
  const [user, setUser] = useState<{ email?: string; roles?: string[] } | null>(null);
  const prevHealth = useRef<Health>("red");

  useEffect(() => {
    const update = () => {
      const v = localStorage.getItem("apiBase");
      setApiBase(v);
      setUser(readJwt());
    };
    update();
    window.addEventListener("storage", update);

    const tick = async () => {
      const v = localStorage.getItem("apiBase");
      if (!v) return;
      const r = await pingHealth(v);
      setHealth(r.health);
      setMs(r.ms);

      // tray color
      try { await invoke("set_tray_health", { health: r.health }); } catch {}

      // notifications on transitions
      if ((prevHealth.current === "green" || prevHealth.current === "yellow") && r.health === "red") {
        try { await invoke("tray_notify", { title: "STEMFORGE", body: "Connection lost" }); } catch {}
      }
      if (prevHealth.current === "red" && (r.health === "green" || r.health === "yellow")) {
        try { await invoke("tray_notify", { title: "STEMFORGE", body: "Connection restored" }); } catch {}
        rememberRecent(v);
      }
      prevHealth.current = r.health;
    };

    tick();
    const id = setInterval(tick, 3000);
    return () => {
      window.removeEventListener("storage", update);
      clearInterval(id);
    };
  }, []);

  const dotColor = health === "green" ? "#22c55e" : health === "yellow" ? "#eab308" : "#ef4444";
  const role = user?.roles?.[0] || "user";

  return (
    <div style={{
      position: "fixed",
      bottom: 10,
      right: 10,
      background: "#0f1623",
      border: "1px solid #1f2937",
      borderRadius: 8,
      padding: "6px 10px",
      display: "flex",
      gap: 10,
      alignItems: "center",
      zIndex: 20
    }}>
      <span title={health} style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor, display: "inline-block" }} />
      <span style={{ color: "#9ca3af" }}>{apiBase ? `Connected to ${apiBase}` : "Not connected"}</span>
      <span style={{ color: "#9ca3af" }}>{user?.email ? `${user.email} (${role})` : ""}</span>
      <span style={{ color: "#9ca3af" }}>{ms != null ? `${ms} ms` : ""}</span>
      <button className="secondary" onClick={onReconnectNow}>Reconnect now</button>
      <button className="secondary" onClick={onOpenSelector}>Choose server</button>
      <button className="secondary" onClick={onOpenQuick}>Quick switch</button>
      <button className="secondary" onClick={onSwitch}>Switch server</button>
    </div>
  );
}