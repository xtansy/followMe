import { api } from "./instance";
import type { IUserInfo, IPost, ISubscriptionDto } from "../types";
import type {
  ICreateCommentParams,
  IDeleteCommentParams,
  IEditPostParams,
  IFileUrl,
  IFollowParams,
  IGetAllUsersParams,
  IGetLentaPostsParams,
  IGetMyPostsParams,
  ILoginParams,
  IPostAvatarParams,
  IPostParams,
  ISearchParams,
  ISearchSoloParams,
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


export const searchOnlyUserPublications = async ({
  text,
  userId
}: ISearchSoloParams): Promise<IPost[]> => {
  try {
    const { data } = await api.get<IPost[]>("/api/publications/"+userId, {
      params: { text },
    });

    return data;
  } catch (error) {
    console.error("Search error:", error);
    return Promise.reject(error);
  }
};

export const searchPublications = async ({
  text,
}: ISearchParams): Promise<IPost[]> => {
  try {
    const { data } = await api.get<IPost[]>("/api/publications", {
      params: { text },
    });

    return data;
  } catch (error) {
    console.error("Search error:", error);
    return Promise.reject(error);
  }
};


// export const getFile = async (fileId: string): Promise<IFileUrl> => {
//   try {
//     const { data } = await api.get(`/api/files/${fileId}`, {
//       responseType: "blob",
//     });

//     const fileObj: IFileUrl = {
//       url: URL.createObjectURL(data),
//       mimeType: data.type,
//     };

//     return fileObj;
//   } catch (error) {
//     console.error("Error fetching file:", error);
//     return Promise.reject(error);
//   }
// };

export const getPostFiles = async (
  files: Array<{ fileId: string; contentType: string }>
): Promise<IFileUrl[]> => {
  try {
    const fileUrls = await Promise.all(
      files.map(async ({ fileId, contentType }) => {
        const { data } = await api.get(`/api/files/${fileId}`, {
          responseType: "blob",
        });

        const blob = new Blob([data], { type: contentType });
        return {
          url: URL.createObjectURL(blob),
          mimeType: contentType,
        };
      })
    );

    return fileUrls;
  } catch (error) {
    console.error("Error fetching post files:", error);
    return [];
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

export const subscribe = async (
  params: ISubscribeParams
): Promise<{ paymentLink: string }> => {
  try {
    const { data } = await api.post<{ paymentLink: string }>(
      "/subscription",
      params
    );
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

export const postAvatar = async ({ file }: IPostAvatarParams) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/api/files/avatar", formData, {
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

export const getAvatar = async (fileId: string): Promise<string> => {
  try {
    const response = await api.get(`/api/files/avatar/${fileId}`, {
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(response.data);
    return blobUrl;
  } catch (error) {
    console.error("Error fetching file:", error);
    return Promise.reject(error);
  }
};

export const getMySubscriptionsToUser = async (): Promise<
  ISubscriptionDto[]
> => {
  try {
    const { data } = await api.get<ISubscriptionDto[]>("/subscription/list");
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMyFollows = async () => {
  try {
    const { data } = await api.get("/api/follow/list");
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMySubscribers = async (): Promise<ISubscriptionDto[]> => {
  try {
    const { data } = await api.get<ISubscriptionDto[]>(
      "/subscription/subscribers/list"
    );
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createComment = async ({
  postId,
  message,
  userId,
}: ICreateCommentParams): Promise<any> => {
  try {
    const { data } = await api.post(`/api/publications/${postId}/comments`, {
      userId,
      message,
    });
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteComment = async ({
  postId,
  commentId,
}: IDeleteCommentParams): Promise<any> => {
  try {
    const { data } = await api.delete(
      `/api/publications/${postId}/comments/${commentId}`
    );
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const editPost = async ({
  postId,
  description,
}: IEditPostParams): Promise<any> => {
  try {
    const { data } = await api.put(`/api/publications/${postId}`, {
      title: null,
      description,
      requiredLevel: null,
      files: null,
    });
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};
