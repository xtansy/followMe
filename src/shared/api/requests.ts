import { api } from "./instance";
import type { IUserInfo, IPost } from "../types";
import type {
  IFollowParams,
  IGetAllUsersParams,
  IGetLentaPostsParams,
  IGetMyPostsParams,
  ILoginParams,
  IPostParams,
  IRegisterParams,
  ISubscribeParams,
  ISubscriptionParams,
} from "./types";

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

export const getMyPosts = async ({
  ownUserId,
  page,
}: IGetMyPostsParams): Promise<IPost[]> => {
  try {
    const { data } = await api.get<IPost[]>(
      `/api/publications/list/${ownUserId}/${page}`
    );

    return data;
  } catch (error) {
    console.log("@@ error", error);
    return Promise.reject(error);
  }
};

export const getFile = async (fileId: string): Promise<string> => {
  try {
    const response = await api.get(`/api/files/${fileId}`, {
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(response.data);
    return blobUrl;
  } catch (error) {
    console.error("Error fetching file:", error);
    return Promise.reject(error);
  }
};

export const getPostFiles = async (
  files: Array<{ fileId: string; contentType: string }>
): Promise<string[]> => {
  try {
    const fileUrls = await Promise.all(
      files.map((file) => getFile(file.fileId))
    );
    return fileUrls;
  } catch (error) {
    console.error("Error fetching post files:", error);
    return Promise.reject(error);
  }
};

export const getSubscriptions = async (userId: string) => {
  try {
    const { data } = await api(`/subscription/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching post files:", error);
    return Promise.reject(error);
  }
};

export const createSubscription = async (params: ISubscriptionParams) => {
  try {
    const { data } = await api.post("/subscription/createPlan", params);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLentaPosts = async ({ page }: IGetLentaPostsParams) => {
  try {
    const { data } = await api.get<IPost[]>(`/api/publications/list/${page}`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const follow = async ({ userId }: IFollowParams) => {
  try {
    const { data } = await api.post(`/api/follow/${userId}`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const unfollow = async ({ userId }: IFollowParams) => {
  try {
    const { data } = await api.delete(`/api/follow/${userId}`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllUsers = async ({ page }: IGetAllUsersParams) => {
  try {
    const { data } = await api.get(`/api/user/all/${page}`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteMyPost = async (postId: string) => {
  try {
    const { data } = await api.delete(`/api/publications/${postId}`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const subscribe = async (params: ISubscribeParams) => {
  try {
    const { data } = await api.post("/subscription", params);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const like = async (postId: string) => {
  try {
    const { data } = await api.post(`/like/${postId}/like`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const unlike = async (postId: string) => {
  try {
    const { data } = await api.post(`/like/${postId}/unlike`);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};
