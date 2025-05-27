import { useEffect, useState } from "react";
import { Space, Card } from "antd";

import type { IPost, ISubscription, IUserInfo } from "../../shared/types";
import {
  SubscriptionCard,
  Post,
  CreatePostWidget,
  ProfileCard,
  CreateSubscriptionWidget,
} from "../../components";
import {
  createPost,
  createSubscription,
  getMyPosts,
  getSubscriptions,
  getUser,
  IPostParams,
  ISubscriptionParams,
  like,
  unlike,
} from "../../shared/api";
import { useParams } from "react-router";
import { useStore } from "../../store/context";
import { observer } from "mobx-react-lite";
import { SUBSCRIPTIONS_MOCK } from "../../shared/constants";
import { CardDummy } from "../../shared/ui";

// const POSTS_MOCK: IPost[] = [
//   {
//     id: "1",
//     title: "Доступный пост",
//     availableBody: "это большой доступный всем пост...",
//     likesCount: 42,
//     liked: false,
//     files: [],
//     fullContent: true,
//     user: {
//       username: "andrey_dev",
//       avatarFileId: IMAGE_URL_MOCK,
//       userId: "213",
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
//       username: "hidden_author",
//       avatarFileId: IMAGE_URL_MOCK,
//       userId: "213",
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

export const FeedProfile = observer(() => {
  const { userStore } = useStore();
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [subscriptions, setSubscriptions] =
    useState<ISubscription[]>(SUBSCRIPTIONS_MOCK);

  const isOwnProfile = userStore.userId === id;

  const mostExpensiveSubscription = subscriptions.reduce((max, current) =>
    current.level > max.level ? current : max
  );

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      )
    );
    const post = posts.find((post) => post.id === id);
    if (!post) return;

    if (post.liked) {
      unlike(id);
    } else {
      like(id);
    }
  };

  const onSubmitPost = (newPost: IPostParams) => {
    createPost(newPost).then(() => {
      fetchMyPosts(id);
    });
  };

  const onSubmitSubscription = async (subscription: ISubscriptionParams) => {
    return createSubscription(subscription).then(() => fetchSubscriptions(id));
  };

  const fetchSubscriptions = (id: string | undefined) => {
    if (id) {
      getSubscriptions(id).then((fetchedSubscriptions) => {
        setSubscriptions([...SUBSCRIPTIONS_MOCK, ...fetchedSubscriptions]);
      });
    }
  };

  const fetchMyPosts = (id: string | undefined) => {
    if (id) {
      getMyPosts({ ownUserId: id, page: 1 }).then((fetchedPosts) => {
        setPosts(fetchedPosts);
      });
    } else {
      setPosts([]);
    }
  };

  const onDeletePost = (id: string) => {
    const newPosts = posts.filter((post) => post.id !== id);
    setPosts(newPosts);
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
    if (id) {
      getUser(id).then((user) => setUserInfo(user));
    }
  }, [id]);

  useEffect(() => {
    fetchMyPosts(id);
  }, [id]);

  useEffect(() => {
    fetchSubscriptions(id);
  }, [id]);

  if (!userInfo) return null;

  return (
    <div
      style={{
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        gap: 32,
        padding: "32px",
        background: "#fafafa",
      }}
    >
      {/* Левая панель профиля */}
      <div style={{ flexShrink: 0 }}>
        <ProfileCard
          avatarFileId={userInfo.avatarFileId}
          userId={userInfo.userId}
          subscriptionsCount={userInfo.subscriptionsCount}
          followersCount={userInfo.followersCount}
          postsLength={userInfo.publicationsCount}
          isOwnProfile={isOwnProfile}
          username={userInfo.username}
          isFollowed={userInfo.isFollowed}
        />
      </div>

      {/* Центральная колонка с постами */}
      <div style={{ maxWidth: 750, flexShrink: 0, width: "100%" }}>
        {isOwnProfile && (
          <div style={{ marginBottom: "10px" }}>
            <CreatePostWidget
              onSubmit={onSubmitPost}
              subscriptions={subscriptions}
            />
          </div>
        )}

        {posts.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {posts.map((post) => (
              <Post
                onCommentAdded={onCommentAdded}
                onCommentDeleted={onCommentDeleted}
                key={post.id}
                post={post}
                onLike={handleLike}
                onDeletePost={onDeletePost}
              />
            ))}
          </div>
        ) : isOwnProfile ? (
          <div style={{ marginTop: "30px" }}>
            <CardDummy
              title="У вас еще нет постов"
              subtitle="Создавайте интересные посты, чтобы привлечь подписчиков на Ваш контент"
            />
          </div>
        ) : (
          <div style={{ marginTop: "30px" }}>
            <CardDummy
              title="У пользователя еще нет постов"
              subtitle="Вы можете создавать интересные посты, чтобы привлечь подписчиков на Ваш контент"
              buttonText="Перейти в мой профиль"
              navigateTo={`/profile/${userStore.userId}`}
            />
          </div>
        )}
      </div>

      {/* Правая панель с уровнями подписки */}
      <div style={{ flexShrink: 0 }}>
        {isOwnProfile && subscriptions.length < 5 && (
          <CreateSubscriptionWidget
            onSubmit={onSubmitSubscription}
            mostExpensiveSubscription={mostExpensiveSubscription}
          />
        )}
        <Card
          title="Уровни подписки"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 8,
            height: "fit-content",
          }}
        >
          <Space direction="vertical" style={{ maxWidth: "250px" }}>
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                {...subscription}
                channelName={userInfo.username}
                isOwnProfile={isOwnProfile}
                userId={userInfo.userId}
                isSubscribed={userInfo.subLevel >= subscription.level}
              />
            ))}
          </Space>
        </Card>
      </div>
    </div>
  );
});
