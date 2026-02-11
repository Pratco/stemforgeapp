import { useEffect, useState } from "react";
import { api } from "../api";

export default function ProjectBrowser() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api("/api/projects").then(setProjects).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Projects</h2>
      <ul>
        {projects.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}