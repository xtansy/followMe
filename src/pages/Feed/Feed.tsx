import "./styles.scss";

import { useEffect, useState } from "react";
import { List } from "antd";

import { ISubscription, type IPost } from "../../shared/types/entityTypes";
import { Post, CreatePostWidget } from "../../components";
import {
  createPost,
  getSubscriptions,
  type IPostParams,
  getLentaPosts,
} from "../../shared/api";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/context";
import { SUBSCRIPTIONS_MOCK } from "../../shared/constants";
import { like, unlike } from "../../shared/api";
import { CardDummy } from "../../shared/ui";

// const mockPosts: IPost[] = [
//   {
//     id: "1",
//     title: "Доступный пост",
//     availableBody: "это большой доступный всем пост...",
//     likesCount: 42,
//     liked: false,
//     files: [],
//     fullContent: true,
//     user: {
//       userId: "1",
//       username: "andrey_dev",
//       avatarFileId: IMAGE_URL_MOCK,
//     },
//     publishDate: "2025-05-20T17:34:56.767186909Z",
//     subscription: {
//       title: "string",
//       description: "string",
//       level: 1,
//       price: {
//         units: 0,
//         nanos: 0,
//       },
//     },
//   },
//   {
//     id: "2",
//     title: "Закрытый пост",
//     availableBody: "это маленький, недоступный никому закрытый пост",
//     likesCount: 89,
//     liked: false,
//     files: [],
//     user: {
//       userId: "2",
//       username: "hidden_author",
//       avatarFileId: IMAGE_URL_MOCK,
//     },
//     publishDate: "2025-05-20T17:34:56.767186909Z",
//     subscription: {
//       title: "string",
//       description: "string",
//       level: 1,
//       price: {
//         units: 0,
//         nanos: 0,
//       },
//     },
//   },
// ];

export const Feed = observer(() => {
  const { userStore } = useStore();
  const [posts, setPosts] = useState<IPost[]>([]);

  const [subscriptions, setSubscriptions] =
    useState<ISubscription[]>(SUBSCRIPTIONS_MOCK);

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
    const post = posts.find((post) => post.id === postId);
    if (!post) return;

    if (post.liked) {
      unlike(postId);
    } else {
      like(postId);
    }
  };

  const handleCreatePost = (newPost: IPostParams) => {
    createPost(newPost);
  };

  const fetchSubscriptions = (id: string | null) => {
    if (id) {
      getSubscriptions(id).then((fetchedSubscriptions) => {
        setSubscriptions((old) => [...old, ...fetchedSubscriptions]);
      });
    }
  };

  const onCommentAdded = (postId: string, newComment: IPost["comments"][0]) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
            }
          : post
      )
    );
  };

  const onCommentDeleted = (postId: string, commentId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : post
      )
    );
  };

  useEffect(() => {
    fetchSubscriptions(userStore.userId);
  }, [userStore.userId]);

  useEffect(() => {
    getLentaPosts({ page: 1 }).then((fetchedPosts) => {
      setPosts(fetchedPosts);
    });
  }, [userStore.userId]);

  return (
    <div className="feed-page">
      <div className="feed-container">
        {userStore.isAuthenticated && (
          <CreatePostWidget
            onSubmit={handleCreatePost}
            subscriptions={subscriptions}
          />
        )}
        {userStore.isAuthenticated ? (
          <>
            {posts.length > 0 ? (
              <List
                dataSource={posts}
                itemLayout="vertical"
                renderItem={(post) => (
                  <List.Item key={post.id}>
                    <Post
                      onCommentAdded={onCommentAdded}
                      onCommentDeleted={onCommentDeleted}
                      post={post}
                      onLike={onLike}
                      isAuthenticated={userStore.isAuthenticated}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ marginTop: "30px" }}>
                <CardDummy
                  title="В Вашей ленте еще нет постов"
                  subtitle="Подпишитесь на интересных авторов, чтобы получить доступ к
              эксклюзивному контенту"
                />
              </div>
            )}
          </>
        ) : (
          <div style={{ marginTop: "30px" }}>
            <CardDummy
              title="Посты недоступны"
              subtitle="Зарегистрируйтесь или войдите, чтобы смотреть посты"
            />
          </div>
        )}
      </div>
    </div>
  );
});
