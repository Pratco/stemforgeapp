import { useState } from "react";
import { api, setApiBase } from "../api";

export default function AuthGate({ onAuthed }: { onAuthed: () => void }) {
  const [server, setServer] = useState(localStorage.getItem("apiBase") || "http://127.0.0.1:3000");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function login() {
    try {
      setApiBase(server);
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("token", res.token);
      onAuthed();
    } catch (e: any) {
      setError("Login failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>STEMFORGE Login</h2>
      <input value={server} onChange={e => setServer(e.target.value)} placeholder="Server URL" />
      <br />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <br />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <br />
      <button onClick={login}>Login</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}