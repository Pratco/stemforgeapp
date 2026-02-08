import { useEffect, useState } from "react";
import AuthGate from "./components/AuthGate";
import ProjectBrowser from "./components/ProjectBrowser";

import { autoDetect } from "./autoDetect";
import StatusBar from "./components/StatusBar";
import SwitchServer from "./components/SwitchServer";
import ServerSelector from "./components/ServerSelector";
import QuickSwitch from "./components/QuickSwitch";
import ServerProfiles from "./components/ServerProfiles";
import Diagnostics from "./components/Diagnostics";

type View = "boot" | "login" | "app" | "profiles" | "diagnostics";

export default function App() {
  const [view, setView] = useState<View>("boot");
  const [showSwitch, setShowSwitch] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  async function connect() {
    setView("boot");
    const found = await autoDetect();
    if (found) {
      setView(localStorage.getItem("token") ? "app" : "login");
    } else {
      setView("login");
    }
  }

  useEffect(() => {
    connect();
  }, []);

  function onAuthed() {
    setView("app");
  }

  let content = null;
  if (view === "boot") content = <div style={{ padding: 20 }}>Connecting…</div>;
  if (view === "login") content = <AuthGate onAuthed={onAuthed} />;
  if (view === "app") content = <ProjectBrowser />;
  if (view === "profiles") content = <ServerProfiles />;
  if (view === "diagnostics") content = <Diagnostics />;

  return (
    <div>
      {content}

      <StatusBar
        onSwitch={() => setShowSwitch(true)}
        onReconnectNow={connect}
        onOpenSelector={() => setShowSelector(true)}
        onOpenQuick={() => setShowQuick(true)}
      />

      {showSwitch && (
        <SwitchServer
          onDone={() => {
            setShowSwitch(false);
            connect();
          }}
        />
      )}

      {showSelector && (
        <ServerSelector
          onPick={(url) => {
            localStorage.removeItem("token");
            localStorage.setItem("apiBase", url);
            setShowSelector(false);
            connect();
          }}
          onClose={() => setShowSelector(false)}
        />
      )}

      {showQuick && (
        <QuickSwitch
          onPick={(url) => {
            localStorage.removeItem("token");
            localStorage.setItem("apiBase", url);
            setShowQuick(false);
            connect();
          }}
          onClose={() => setShowQuick(false)}
        />
      )}

      {/* Simple nav for tools */}
      {view === "app" && (
        <div style={{ position: "fixed", top: 10, right: 10 }}>
          <button onClick={() => setView("profiles")}>Server Profiles</button>
          <button onClick={() => setView("diagnostics")}>Diagnostics</button>
          <button onClick={() => setView("app")}>Projects</button>
        </div>
      )}
    </div>
  );
}
