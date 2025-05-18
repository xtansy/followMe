import "./shared/styles/base.css";

import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";

import { Router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Router />
  </HashRouter>
);
