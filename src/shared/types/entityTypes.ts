export interface IPost {
  id: string;
  title: string;
  availableBody: string;
  likesCount: number;
  fullContent?: boolean;
  liked: boolean;
  files: string[];
}
