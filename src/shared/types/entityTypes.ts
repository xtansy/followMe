export interface IPost {
  id: string;
  title: string;
  availableBody: string;
  likesCount: number;
  fullContent?: boolean;
  liked: boolean;
  files: string[];
  user: {
    username: string;
    avatarFileId: string;
  };
  publishDate: string;
}

export interface ISubscription {
  title: string;
  description: string;
  price: number;
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
}
