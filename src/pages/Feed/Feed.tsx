import "./styles.scss";
import { useState } from "react";
import { List } from "antd";
import { IPost } from "../../shared/types/entityTypes";
import { IMAGE_URL_MOCK } from "../../shared/constants";
import { Post } from "../../components";

const mockPosts: IPost[] = [
  {
    id: "1",
    title: "Доступный пост",
    availableBody: "Check out my latest artwork! What do you think?",
    likesCount: 42,
    liked: false,
    files: [IMAGE_URL_MOCK],
    fullContent: true,
  },
  {
    id: "2",
    title: "Закрытый пост",
    availableBody: "New gadget review coming soon! Stay tuned!",
    likesCount: 89,
    liked: false,
    files: [IMAGE_URL_MOCK],
  },
];

export const Feed = () => {
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

  return (
    <div className="feed-page">
      <div className="feed-container">
        <List
          dataSource={posts}
          itemLayout="vertical"
          renderItem={(post) => (
            <List.Item key={post.id}>
              <Post post={post} onLike={onLike} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
