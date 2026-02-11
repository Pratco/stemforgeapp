
import React from "react";

export function ProfileSwitcher({ profiles, current, onSwitch, onLogout }:
  { profiles: string[]; current: string; onSwitch: (p: string)=>void; onLogout: ()=>void }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select value={current} onChange={e=>onSwitch(e.target.value)}>
        {profiles.map(p=> <option key={p} value={p}>{p}</option>)}
      </select>
      <button className="btn" onClick={onLogout}>Logout</button>
    </div>
  );
}
