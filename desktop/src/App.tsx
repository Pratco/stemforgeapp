import { useState } from "react";
import AuthGate from "./components/AuthGate";
import ProjectBrowser from "./components/ProjectBrowser";

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));

  if (!authed) {
    return <AuthGate onAuthed={() => setAuthed(true)} />;
  }

  return <ProjectBrowser />;
}