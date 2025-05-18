import { useState } from "react";
import { Avatar, Button, Typography, Space, Card } from "antd";
import { CrownFilled, UserOutlined } from "@ant-design/icons";
import { IPost } from "../../shared/types";
import { Post } from "../../components";
import { IMAGE_URL_MOCK } from "../../shared/constants";

const { Title, Text } = Typography;

const mockPosts: IPost[] = [
  {
    id: "1",
    title: "Мой первый пост",
    availableBody: "Этот пост доступен всем пользователям",
    likesCount: 42,
    liked: false,
    files: [IMAGE_URL_MOCK],
    fullContent: true,
  },
  {
    id: "2",
    title: "Эксклюзивный контент",
    availableBody: "Только для подписчиков",
    likesCount: 89,
    liked: false,
    files: [IMAGE_URL_MOCK],
  },
];

export const FeedProfile = ({ isOwnProfile = false }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [posts, setPosts] = useState<IPost[]>(mockPosts);

  const handleSubscribe = () => {
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
        <Card
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            borderRadius: 12,
            position: "sticky",
            top: 32,
          }}
        >
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <Avatar
              size={128}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Title level={4} style={{ marginBottom: 0 }}>
              Username
            </Title>
            <Text type="secondary">@username</Text>

            {!isOwnProfile && (
              <Button
                type={isSubscribed ? "default" : "primary"}
                onClick={handleSubscribe}
                style={{ margin: "16px 0", width: "100%" }}
              >
                {isSubscribed ? "Отписаться" : "Подписаться"}
              </Button>
            )}

            <Space split={<div style={{ width: 1, background: "#f0f0f0" }} />}>
              <div style={{ textAlign: "center" }}>
                <Title level={5} style={{ margin: 0 }}>
                  1.2K
                </Title>
                <Text type="secondary">Подписчиков</Text>
              </div>
              <div style={{ textAlign: "center" }}>
                <Title level={5} style={{ margin: 0 }}>
                  456
                </Title>
                <Text type="secondary">Подписок</Text>
              </div>
              <div style={{ textAlign: "center" }}>
                <Title level={5} style={{ margin: 0 }}>
                  {posts.length}
                </Title>
                <Text type="secondary">Постов</Text>
              </div>
            </Space>
          </Space>
        </Card>
      </div>

      {/* Центральная колонка с постами */}
      <div style={{ flexGrow: 1, flexShrink: 0 }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>

      {/* Правая панель с уровнями подписки */}
      <Card
        title="Уровни подписки"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 8,
          height: "fit-content",
        }}
      >
        <Space direction="vertical" style={{ maxWidth: "250px" }}>
          <Card
            type="inner"
            title="Поддержка"
            extra={<CrownFilled style={{ color: "#d4af37" }} />}
          >
            <Text>Доступ к закрытым постам и благодарность автора.</Text>
            <Button
              type="primary"
              block
              style={{ marginTop: 12 }}
              disabled={isSubscribed}
            >
              {isSubscribed ? "Уже подписаны" : "Подписаться — 100₽"}
            </Button>
          </Card>

          <Card
            type="inner"
            title="Премиум"
            extra={<CrownFilled style={{ color: "#e67e22" }} />}
          >
            <Text>
              Всё вышеперечисленное + эксклюзивные материалы и участие в
              опросах.
            </Text>
            <Button
              type="primary"
              block
              style={{ marginTop: 12 }}
              disabled={isSubscribed}
            >
              {isSubscribed ? "Уже подписаны" : "Подписаться — 300₽"}
            </Button>
          </Card>

          <Card
            type="inner"
            title="Легенда"
            extra={<CrownFilled style={{ color: "#8e44ad" }} />}
          >
            <Text>Все преимущества + личное общение с автором и бонусы.</Text>
            <Button
              type="primary"
              block
              style={{ marginTop: 12 }}
              disabled={isSubscribed}
            >
              {isSubscribed ? "Уже подписаны" : "Подписаться — 1000₽"}
            </Button>
          </Card>
        </Space>
      </Card>
    </div>
  );
};
