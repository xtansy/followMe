import { makeAutoObservable } from "mobx";

import { register, login, postAvatar, getUser } from "../shared/api";
import type {
  ILoginParams,
  IPostAvatarParams,
  IRegisterParams,
} from "../shared/api/types";

class UserStore {
  userId: string | null = null;
  isAuthenticated = false;
  avatarFileId: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const avatarFileId = localStorage.getItem("avatarFileId");
    if (token) {
      this.isAuthenticated = true;
    }
    if (userId) {
      this.userId = userId;
    }
    if (avatarFileId) {
      this.avatarFileId = avatarFileId;
    }
  }

  async login(params: ILoginParams) {
    return login(params)
      .then(({ userId, token }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        this.userId = userId;
        this.isAuthenticated = true;
        return getUser(userId);
      })
      .then((user) => {
        this.avatarFileId = user.avatarFileId;
        localStorage.setItem("avatarFileId", user.avatarFileId);
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

  async postAvatar(userId: string, params: IPostAvatarParams) {
    return postAvatar(params)
      .then(() => getUser(userId))
      .then((user) => {
        this.avatarFileId = user.avatarFileId;
        localStorage.setItem("avatarFileId", user.avatarFileId);
      });
  }

  logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("avatarFileId");
    this.userId = null;
    this.isAuthenticated = false;
    this.avatarFileId = null;
  }
}

export const userStore = new UserStore();
