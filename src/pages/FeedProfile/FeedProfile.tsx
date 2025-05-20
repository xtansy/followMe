import { useEffect, useState } from "react";
import { Space, Card } from "antd";

import { IPost, ISubscription, IUserInfo } from "../../shared/types";
import {
  SubscriptionCard,
  Post,
  CreatePostWidget,
  ProfileCard,
  CreateSubscriptionWidget,
} from "../../components";
import { IMAGE_URL_MOCK } from "../../shared/constants";
import { getUser } from "../../shared/api";
import { useParams } from "react-router";

const POSTS_MOCK: IPost[] = [
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

const SUBSCRIPTIONS_MOCK: ISubscription[] = [
  {
    title: "Поддержка",
    description: "Доступ к закрытым постам и благодарность автора",
    price: 100,
    level: 0,
  },
  {
    title: "Премиум",
    description:
      "Всё вышеперечисленное + эксклюзивные материалы и участие в опросах",
    price: 300,
    level: 3,
  },
  {
    title: "Легенда",
    description: "Все преимущества + личное общение с автором и бонусы",
    price: 1_000,
    level: 4,
  },
];

export const FeedProfile = () => {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [posts, setPosts] = useState<IPost[]>(POSTS_MOCK);

  const isOwnProfile = userInfo?.userId === id;

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

  const onSubmitPost = (postData: any) => {
    console.log("@@ postData", postData);
  };

  useEffect(() => {
    if (id) {
      getUser(id).then((user) => setUserInfo(user));
    }
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
          onSubscribe={onSubscribe}
          isSubscribed={isSubscribed}
          postsLength={POSTS_MOCK.length}
          isOwnProfile={isOwnProfile}
          username={"Username"}
        />
      </div>

      {/* Центральная колонка с постами */}
      <div style={{ flexGrow: 1, flexShrink: 0 }}>
        {isOwnProfile && (
          <div style={{ marginBottom: "10px" }}>
            <CreatePostWidget onSubmit={onSubmitPost} />
          </div>
        )}
        {posts.map((post) => (
          <Post key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>

      {/* Правая панель с уровнями подписки */}
      <div>
        {isOwnProfile && <CreateSubscriptionWidget />}
        <Card
          title="Уровни подписки"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: 8,
            height: "fit-content",
          }}
        >
          <Space direction="vertical" style={{ maxWidth: "250px" }}>
            {SUBSCRIPTIONS_MOCK.map((subscription) => (
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
};
