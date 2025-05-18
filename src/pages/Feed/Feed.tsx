import "./styles.scss";
import { useState } from "react";
import { List } from "antd";
import { IPost } from "../../shared/types/entityTypes";

import { Post } from "../../components";

const mockPosts: IPost[] = [
  {
    id: "1",
    title: "Доступный пост",
    availableBody: "Check out my latest artwork! What do you think?",
    likesCount: 42,
    liked: false,
    files: [
      "https://sun9-13.userapi.com/impg/I5Yvt9zkYIfl1_Ctkg2k556EA1Db854kNK9aTg/0GWYlwf0-e8.jpg?size=1200x628&quality=96&sign=0dccfd830475562f97c17181aff94e93&c_uniq_tag=gYCV9LYKUkbvUC4cvovYT_rsXV3ILCIrffkYPjQa3N8&type=album",
    ],
    fullContent: true,
  },
  {
    id: "2",
    title: "Закрытый пост",
    availableBody: "New gadget review coming soon! Stay tuned!",
    likesCount: 89,
    liked: false,
    files: [
      "https://sun9-13.userapi.com/impg/I5Yvt9zkYIfl1_Ctkg2k556EA1Db854kNK9aTg/0GWYlwf0-e8.jpg?size=1200x628&quality=96&sign=0dccfd830475562f97c17181aff94e93&c_uniq_tag=gYCV9LYKUkbvUC4cvovYT_rsXV3ILCIrffkYPjQa3N8&type=album",
    ],
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
    <div style={{ display: "flex", justifyContent: "center" }}>
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
  );
};
