
import React from "react";

export function Sidebar({ hidden, onChangeServer }:{ hidden:boolean; onChangeServer:()=>void }) {
  return (
    <aside className={`sidebar ${hidden ? "hidden" : ""}`}>
      <div className="card">
        <h3>Navigation</h3>
        <ul>
          <li>Dashboard</li>
          <li>Jobs</li>
          <li>Models</li>
          <li>Settings</li>
        </ul>
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={onChangeServer}>Change server</button>
      </div>
    </aside>
  );
}
