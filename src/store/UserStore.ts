import { makeAutoObservable } from "mobx";

import { register, login } from "../shared/api";
import type { ILoginParams, IRegisterParams } from "../shared/api/types";

class UserStore {
  userId: string | null = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token) {
      this.isAuthenticated = true;
    }
    if (userId) {
      this.userId = userId;
    }
  }

  async login(params: ILoginParams) {
    return login(params).then(({ userId, token }) => {
      this.isAuthenticated = true;
      this.userId = userId;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
    });
  }

  async register(params: IRegisterParams) {
    return register(params).then(({ userId, token }) => {
      this.isAuthenticated = true;
      this.userId = userId;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
    });
  }

  logout() {
    localStorage.removeItem("token");
    this.userId = null;
    this.isAuthenticated = false;
  }
}

export const userStore = new UserStore();
