export type ServerProfile = {
  url: string;
  name?: string;
  notes?: string;
  color?: string;
};

const PROFILES_KEY = "serverProfiles";
const RECENTS_KEY = "recentServers";

export function loadProfiles(): ServerProfile[] {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]"); } catch { return []; }
}
export function saveProfiles(p: ServerProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(p));
}
export function upsertProfile(profile: ServerProfile) {
  const list = loadProfiles();
  const idx = list.findIndex(p => p.url === profile.url);
  if (idx >= 0) list[idx] = { ...list[idx], ...profile };
  else list.push(profile);
  saveProfiles(list);
}
export function getProfile(url: string): ServerProfile | undefined {
  return loadProfiles().find(p => p.url === url);
}
export function rememberRecent(url: string) {
  let list: string[] = [];
  try { list = JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"); } catch {}
  list = [url, ...list.filter(u => u !== url)].slice(0, 5);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
}
export function getRecents(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"); } catch { return []; }
}