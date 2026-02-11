
import React from "react";

export function StatusPill({ status }: { status: "ok" | "warn" | "bad" }) {
  const label = status === "ok" ? "Online" : status === "warn" ? "Degraded" : "Offline";
  return (
    <span className={`status-pill ${status}`}>
      <span>●</span>
      <span>{label}</span>
    </span>
  );
}
