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
