import {
  Card,
  List,
  Typography,
  Tag,
  Avatar,
  Button,
  Space,
  Badge,
} from "antd";
import {
  CrownOutlined,
  StarOutlined,
  FireOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { ISubscription, IUserInfo } from "../../shared/types";

interface IMySubscription {
  subscription: ISubscription;
  user: IUserInfo;
}

const { Title, Text } = Typography;

const mockSubscriptions: IMySubscription[] = [
  {
    subscription: {
      title: "Премиум подписка",
      description: "Доступ к эксклюзивному контенту",
      price: { units: 500, nanos: 0 },
      level: 2,
    },
    user: {
      userId: "101",
      username: "Анна Петрова",
      avatarFileId: "",
      followersCount: 1200,
      followsCount: 350,
      subscriptionsCount: 15,
      publicationsCount: 85,
      isFollowed: true,
      subLevel: 2,
    },
  },
  {
    subscription: {
      title: "Базовый доступ",
      description: "Бесплатный вариант подписки",
      price: { units: 200, nanos: 0 },
      level: 0,
    },
    user: {
      userId: "102",
      username: "Иван Сидоров",
      avatarFileId: "",
      followersCount: 850,
      followsCount: 120,
      subscriptionsCount: 8,
      publicationsCount: 42,
      isFollowed: true,
      subLevel: 1,
    },
  },
  {
    subscription: {
      title: "Гигаподписка",
      description: "Весь контент + персональные консультации",
      price: { units: 1000, nanos: 0 },
      level: 4,
    },
    user: {
      userId: "103",
      username: "Мария Иванова",
      avatarFileId: "",
      followersCount: 2400,
      followsCount: 180,
      subscriptionsCount: 22,
      publicationsCount: 156,
      isFollowed: false,
      subLevel: 3,
    },
  },
];

const getLevelInfo = (level: number) => {
  if (level >= 0 && level <= 1) {
    return { color: "blue", icon: <StarOutlined /> };
  }

  if (level >= 2 && level <= 3) {
    return { color: "gold", icon: <CrownOutlined /> };
  }

  return { color: "purple", icon: <FireOutlined /> };
};

const getSubscriptionStatus = () => {
  const now = new Date();
  return {
    willExpireIn: new Date(now.setDate(now.getDate() + 3)).toISOString(), // Через 3 дня
    expiredAt: new Date(now.setDate(now.getDate() - 10)).toISOString(), // 10 дней назад
    activeUntil: new Date(now.setDate(now.getDate() + 20)).toISOString(), // Через 20 дней
  };
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ru-RU", options);
};

const getDaysLeft = (expirationDate: string) => {
  const now = new Date();
  const expireDate = new Date(expirationDate);
  const diffTime = expireDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const dayDeclension = (days: number) => {
  if (days % 10 === 1 && days % 100 !== 11) return "день";
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100))
    return "дня";
  return "дней";
};

export const MySubscriptions = () => {
  const [subscriptions] = useState<IMySubscription[]>(mockSubscriptions);
  const navigate = useNavigate();

  const formatPrice = (price: { units: number; nanos: number }) => {
    return `${price.units} руб.`;
  };

  const handleAuthorClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const renderExpirationAlert = (expirationDate: string) => {
    const daysLeft = getDaysLeft(expirationDate);

    if (daysLeft < 0) {
      return (
        <Space>
          <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
          <Text type="danger">
            Подписка истекла {formatDate(expirationDate)}
          </Text>
        </Space>
      );
    }

    if (daysLeft <= 7) {
      return (
        <Space>
          <ClockCircleOutlined style={{ color: "#faad14" }} />
          <Text type="warning">
            Заканчивается через {daysLeft} {dayDeclension(daysLeft)}
          </Text>
        </Space>
      );
    }

    return (
      <Space>
        <CheckCircleOutlined style={{ color: "#52c41a" }} />
        <Text type="secondary">Активна до: {formatDate(expirationDate)}</Text>
      </Space>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Мои подписки
      </Title>

      <Card>
        {subscriptions.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={subscriptions}
            renderItem={({ subscription, user }) => {
              const levelInfo = getLevelInfo(subscription.level);
              const status = getSubscriptionStatus();
              return (
                <List.Item
                  key={user.userId}
                  extra={
                    <Space direction="vertical" align="end">
                      <Tag
                        icon={levelInfo.icon}
                        color={levelInfo.color}
                        style={{ marginRight: 0 }}
                      >
                        {subscription.title}
                      </Tag>
                      {subscription.level > 0 && (
                        <Text strong>{formatPrice(subscription.price)}</Text>
                      )}
                      <Badge
                        status={user.isFollowed ? "success" : "default"}
                        text={
                          <Text
                            type={user.isFollowed ? undefined : "secondary"}
                          >
                            {user.isFollowed ? "Активна" : "Не активна"}
                          </Text>
                        }
                      />
                      {subscription.level !== 0 &&
                        renderExpirationAlert(
                          subscription.level >= 2 && subscription.level <= 3
                            ? status.willExpireIn
                            : status.expiredAt
                        )}
                    </Space>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={
                          user.avatarFileId
                            ? `/api/file/${user.avatarFileId}`
                            : undefined
                        }
                        icon={<UserOutlined />}
                        size="large"
                        onClick={() => handleAuthorClick(user.userId)}
                        style={{ cursor: "pointer" }}
                      />
                    }
                    title={
                      <a onClick={() => handleAuthorClick(user.userId)}>
                        {user.username}
                      </a>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text>{subscription.description}</Text>
                        <Text type="secondary">
                          Подписчиков: {user.followersCount} • Постов:{" "}
                          {user.publicationsCount}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <Card bordered={false} style={{ textAlign: "center" }}>
            <Title level={4} type="secondary">
              У вас пока нет активных подписок
            </Title>
            <Text type="secondary">
              Подпишитесь на интересных авторов, чтобы получить доступ к
              эксклюзивному контенту
            </Text>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" size="large">
                Найти авторов
              </Button>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};
