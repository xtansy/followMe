import "./styles.scss";

import { useEffect, useState } from "react";
import { List } from "antd";

import { type IPost } from "../../shared/types/entityTypes";
import { IMAGE_URL_MOCK } from "../../shared/constants";
import { Post, CreatePostWidget } from "../../components";
import { createPost, type IPostParams, testToken } from "../../shared/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/context";

const mockPosts: IPost[] = [
  {
    id: "1",
    title: "Доступный пост",
    availableBody: "это большой доступный всем пост...",
    likesCount: 42,
    liked: false,
    files: [IMAGE_URL_MOCK],
    fullContent: true,
    user: {
      username: "andrey_dev",
      avatarFileId: IMAGE_URL_MOCK,
    },
    publishDate: "2025-05-20T17:34:56.767186909Z",
  },
  {
    id: "2",
    title: "Закрытый пост",
    availableBody: "это маленький, недоступный никому закрытый пост",
    likesCount: 89,
    liked: false,
    files: [IMAGE_URL_MOCK],
    user: {
      username: "hidden_author",
      avatarFileId: IMAGE_URL_MOCK,
    },
    publishDate: "2025-05-20T17:34:56.767186909Z",
  },
];

export const Feed = observer(() => {
  const { userStore } = useStore();
  const [posts, setPosts] = useState<IPost[]>(mockPosts);

  const onLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId && post.fullContent
          ? {
              ...post,
              liked: !post.liked,
              likesCount: post.likesCount + (post.liked ? -1 : 1),
            }
          : post
      )
    );
  };

  const handleCreatePost = (newPost: IPostParams) => {
    createPost(newPost).then((res) => {
      console.log("@@ res", res);
    });
  };

  useEffect(() => {
    testToken();
  }, []);

  return (
    <div className="feed-page">
      <div className="feed-container">
        {userStore.isAuthenticated && (
          <CreatePostWidget onSubmit={handleCreatePost} />
        )}
        <List
          dataSource={posts}
          itemLayout="vertical"
          renderItem={(post) => (
            <List.Item key={post.id}>
              <Post
                post={post}
                onLike={onLike}
                isAuthenticated={userStore.isAuthenticated}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
});
