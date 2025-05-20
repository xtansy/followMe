import "./shared/styles/base.css";

import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";

import { userStore } from "./store/UserStore.ts";
import { Router } from "./router.tsx";
import { StoreContext } from "./store/context.ts";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <StoreContext.Provider value={{ userStore }}>
      <Router />
    </StoreContext.Provider>
  </HashRouter>
);
