let API_BASE = localStorage.getItem("apiBase") || "http://127.0.0.1:3000";

export function setApiBase(url: string) {
  API_BASE = url;
  localStorage.setItem("apiBase", url);
}

export async function api(path: string, opts: any = {}) {
  const token = localStorage.getItem("token");
  const headers: any = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) throw new Error("API error");
  return res.json();
}