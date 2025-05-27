export interface IFile {
  fileId: string;
  contentType: string;
}

export interface IPost {
  id: string;
  title: string;
  availableBody: string;
  likesCount: number;
  fullContent?: boolean;
  liked: boolean;
  files: IFile[];
  user: {
    username: string;
    avatarFileId: string;
    userId: string;
  };
  publishDate: string;
  subscription: ISubscription;

  comments: {
    id: string;
    userInfo: {
      username: string;
      email?: string;
      avatarFileId: string;
      userId: string;
    };
    message: string;
    createdAt: string;
  }[];
}

export interface ISubscription {
  title: string;
  description: string;
  price: {
    units: number;
    nanos: number;
  };
  level: number;
}

export interface IUserInfo {
  userId: string;
  followersCount: number;
  followsCount: number;
  subscriptionsCount: number;
  publicationsCount: number;
  username: string;
  avatarFileId: string;
  isFollowed: boolean;
  subLevel: number;
}

export interface ISubscriptionDto {
  host: {
    userId: string;
    followersCount: number;
    followsCount: number;
    subscriptionsCount: number;
    publicationsCount: number;
    username: string;
    email: string;
    isFollowed: boolean;
    subLevel: number;
    avatarFileId: string;
  };
  subscription: {
    title: string;
    price: {
      units: number;
      nanos: number;
    };
    isActive: boolean;
    daysLeft: number;
    isFrozen: boolean;
    level: number;
    orderDate: string;
  };
}

export type IUserInfoShort = Omit<
  IUserInfo,
  | "isFollowed"
  | "publicationsCount"
  | "followersCount"
  | "followsCount"
  | "subscriptionsCount"
>;
