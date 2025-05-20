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
} from "../../shared/api";
import { useParams } from "react-router";
import { useStore } from "../../store/context";
import { observer } from "mobx-react-lite";
import { SUBSCRIPTIONS_MOCK } from "../../shared/constants";

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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [subscriptions, setSubscriptions] =
    useState<ISubscription[]>(SUBSCRIPTIONS_MOCK);

  const isOwnProfile = userStore.userId === id;

  const mostExpensiveSubscription = subscriptions.reduce((max, current) =>
    current.level > max.level ? current : max
  );

  const onSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

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
      <div style={{ width: 300, flexShrink: 0 }}>
        <ProfileCard
          userId={userInfo.userId}
          subscriptionsCount={userInfo.subscriptionsCount}
          followersCount={userInfo.followersCount}
          onSubscribe={onSubscribe}
          isSubscribed={isSubscribed}
          postsLength={userInfo.publicationsCount}
          isOwnProfile={isOwnProfile}
          username={userInfo.username}
          isFollowed={userInfo.isFollowed}
        />
      </div>

      {/* Центральная колонка с постами */}
      <div style={{ flexGrow: 1, flexShrink: 0 }}>
        {isOwnProfile && (
          <div style={{ marginBottom: "10px" }}>
            <CreatePostWidget
              onSubmit={onSubmitPost}
              subscriptions={subscriptions}
            />
          </div>
        )}
        {posts.map((post) => (
          <Post key={post.id} post={post} onLike={handleLike} />
        ))}
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
                isSubscribed={isSubscribed}
                channelName={userInfo.username}
                isOwnProfile={isOwnProfile}
              />
            ))}
          </Space>
        </Card>
      </div>
    </div>
  );
});
