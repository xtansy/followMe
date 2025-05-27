export interface ILoginParams {
  username: string;
  password: string;
}
export interface IRegisterParams {
  username: string;
  password: string;
}

export interface IPostParams {
  title: string;
  description: string;
  requiredLevel: number;
  files: File[];
}

export interface IPostAvatarParams {
  file: File;
}

export interface IGetMyPostsParams {
  ownUserId: string;
  page: number;
}

export interface ISubscriptionParams {
  title: string;
  description: string;
  price: {
    units: number;
    nanos: number;
  };
  level: number;
}

export interface IGetLentaPostsParams {
  page: number;
}

export interface IFollowParams {
  userId: string; // на кого подписываемся
}

export interface IGetAllUsersParams {
  page: number;
}

export interface ISubscribeParams {
  hostId: string; // userId
  level: number;
}

export interface IFileUrl {
  url: string;
  mimeType: string;
}

export interface ICreateCommentParams {
  postId: string;
  userId: string;
  message: string;
}

export interface IDeleteCommentParams {
  postId: string;
  commentId: string;
}

export interface IEditPostParams {
  postId: string;
  description: string;
}
