import { useState } from "react";

async function test(url: string) {
  const out: any = { url, ok: false, ms: null as number | null, error: null as string | null };
  try {
    const t0 = performance.now();
    const r = await fetch(url + "/api/health", { cache: "no-store" });
    out.ms = Math.round(performance.now() - t0);
    out.ok = r.ok;
    if (!r.ok) out.error = "Health check failed";
  } catch (e: any) {
    out.error = e?.message || "Network error";
  }
  return out;
}

export default function Diagnostics() {
  const [url, setUrl] = useState(localStorage.getItem("apiBase") || "");
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    const r = await test(url);
    setResult(r);
    setRunning(false);
  }

  return (
    <div className="panel">
      <h3>Run Diagnostics</h3>
      <input value={url} onChange={e => setUrl(e.target.value)} style={{ width: "100%" }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={run} disabled={running}>{running ? "Testing..." : "Run test"}</button>
      </div>
      {result && (
        <pre style={{ marginTop: 10, background: "#0b1020", padding: 10 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}