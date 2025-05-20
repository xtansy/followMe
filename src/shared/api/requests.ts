import { api } from "./instance";
import { type IUserInfo } from "../types";
import type { ILoginParams, IPostParams, IRegisterParams } from "./types";

export const login = async (
  params: ILoginParams
): Promise<{ userId: string; token: string }> => {
  try {
    const { data } = await api.post<{ token: string; userId: string }>(
      "/auth/login",
      params
    );
    return { userId: data.userId, token: data.token };
  } catch (error) {
    console.log("@@ error", error);

    return Promise.reject(error);
  }
};

export const register = async (
  params: IRegisterParams
): Promise<{ userId: string; token: string }> => {
  try {
    const { data } = await api.post<{ token: string; userId: string }>(
      "/auth/register",
      params
    );
    return { userId: data.userId, token: data.token };
  } catch (error) {
    console.log("@@ error", error);

    return Promise.reject(error);
  }
};

export const testToken = async () => {
  try {
    const { data } = await api("/api/publications/list/1");
    console.log("@@ data", data);
  } catch (error) {
    console.log("@@ error", error);
    return Promise.reject(error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const { data } = await api<IUserInfo>(`/api/user/${userId}`);
    return data;
  } catch (error) {
    console.log("@@ error", error);
    return Promise.reject(error);
  }
};

export const createPost = async (postParams: IPostParams) => {
  try {
    const formData = new FormData();
    formData.append("title", postParams.title);
    formData.append("description", postParams.description);
    formData.append("requiredLevel", String(postParams.requiredLevel));

    postParams.files.forEach((file) => {
      formData.append("files", file);
    });

    const { data } = await api.post("/api/publications", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.log("@@ error", error);
    return Promise.reject(error);
  }
};
