import { useContext, createContext } from "react";

import { userStore } from "./UserStore";

export const StoreContext = createContext({
  userStore,
});
export const useStore = () => useContext(StoreContext);
