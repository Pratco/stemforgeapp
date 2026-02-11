export type JwtPayload = { email?: string; roles?: string[] };

export function readJwt(): JwtPayload | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}