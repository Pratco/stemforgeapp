import { invoke } from "@tauri-apps/api/tauri";

const HEALTH = "/api/health";

async function check(url: string): Promise<boolean> {
  try {
    const r = await fetch(url + HEALTH, { cache: "no-store" });
    if (!r.ok) return false;
    const j = await r.json();
    return j?.name === "STEMFORGE";
  } catch {
    return false;
  }
}

export async function autoDetect(): Promise<string | null> {
  const saved = localStorage.getItem("apiBase");
  if (saved && await check(saved)) return saved;

  const cloud = localStorage.getItem("cloudServer");
  if (cloud && await check(cloud)) return cloud;

  try {
    const found: string[] = await invoke("mdns_discover");
    for (const url of found) {
      if (await check(url)) {
        localStorage.setItem("apiBase", url);
        return url;
      }
    }
  } catch {}

  return null;
}