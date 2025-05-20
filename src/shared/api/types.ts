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
