
import React from "react";
import { StatusPill } from "../ui/StatusPill";
import { ProfileSwitcher } from "../ui/ProfileSwitcher";

export function TopBar({ status, profiles, currentProfile, onSwitchProfile, onLogout, onToggleTheme, onToggleSidebar }:
  { status: "ok"|"warn"|"bad"; profiles: string[]; currentProfile: string;
    onSwitchProfile:(p:string)=>void; onLogout:()=>void; onToggleTheme:()=>void; onToggleSidebar:()=>void }) {
  return (
    <div className="topbar">
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="btn" onClick={onToggleSidebar}>☰</button>
        <strong>STEMFORGE</strong>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <StatusPill status={status} />
        <button className="btn" onClick={onToggleTheme}>Toggle Theme</button>
        <ProfileSwitcher profiles={profiles} current={currentProfile} onSwitch={onSwitchProfile} onLogout={onLogout} />
      </div>
    </div>
  );
}
