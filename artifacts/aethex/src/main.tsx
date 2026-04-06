import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Subdomain routing: cadus.aethex.in → /cadus-standalone
if (window.location.hostname === "cadus.aethex.in") {
  const target = "/cadus-standalone";
  if (!window.location.pathname.startsWith(target)) {
    window.location.replace(target);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
