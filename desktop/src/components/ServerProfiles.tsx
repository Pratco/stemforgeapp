import { useEffect, useState } from "react";
import { loadProfiles, saveProfiles, ServerProfile } from "../storage";

export default function ServerProfiles() {
  const [list, setList] = useState<ServerProfile[]>([]);

  useEffect(() => { setList(loadProfiles()); }, []);

  function add() {
    setList([...list, { url: "", name: "", notes: "", color: "#22c55e" }]);
  }

  function save() {
    saveProfiles(list.filter(p => p.url));
    alert("Saved profiles");
  }

  function update(i: number, key: keyof ServerProfile, val: any) {
    const n = [...list];
    (n[i] as any)[key] = val;
    setList(n);
  }

  function remove(i: number) {
    const n = [...list];
    n.splice(i, 1);
    setList(n);
  }

  return (
    <div className="panel">
      <h3>Server Profiles</h3>
      {list.map((p, i) => (
        <div key={i} style={{ borderBottom: "1px solid #1f2937", paddingBottom: 8, marginBottom: 8 }}>
          <input placeholder="URL" value={p.url} onChange={e => update(i, "url", e.target.value)} style={{ width: "100%" }} />
          <input placeholder="Name" value={p.name || ""} onChange={e => update(i, "name", e.target.value)} style={{ width: "100%", marginTop: 6 }} />
          <input placeholder="Notes" value={p.notes || ""} onChange={e => update(i, "notes", e.target.value)} style={{ width: "100%", marginTop: 6 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <label>Color</label>
            <input type="color" value={p.color || "#22c55e"} onChange={e => update(i, "color", e.target.value)} />
            <button className="secondary" onClick={() => remove(i)}>Remove</button>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={add}>Add</button>
        <button className="secondary" onClick={save}>Save</button>
      </div>
    </div>
  );
}