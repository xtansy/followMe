import {
  Card,
  List,
  Typography,
  Tag,
  Button,
  Space,
  Spin,
  message,
  Tooltip,
} from "antd";
import {
  CrownOutlined,
  StarOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { calculateExpiresAt, convertPriceToNumber } from "../../shared/lib";
import { type ISubscriptionDto } from "../../shared/types";
import { getMySubscriptionsToUser } from "../../shared/api";
import { CardDummy } from "../../shared/ui";
import { AvatarUser } from "../../components";

const { Title, Text } = Typography;

const getLevelInfo = (level: number) => {
  if (level === 0) return { color: "blue", icon: <StarOutlined /> };
  if (level === 1) return { color: "blue", icon: <StarOutlined /> };
  if (level === 2) return { color: "gold", icon: <CrownOutlined /> };
  return { color: "purple", icon: <FireOutlined /> };
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ru-RU", options);
};

const dayDeclension = (days: number) => {
  if (days % 10 === 1 && days % 100 !== 11) return "день";
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100))
    return "дня";
  return "дней";
};

// const mockSubscriptions: ISubscriptionDto[] = [
//   {
//     host: {
//       userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       followersCount: 1200,
//       followsCount: 350,
//       subscriptionsCount: 15,
//       publicationsCount: 85,
//       username: "Анна Петрова",
//       email: "anna@example.com",
//       isFollowed: true,
//       subLevel: 2,
//       avatarFileId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     },
//     subscription: {
//       title: "Премиум подписка",
//       price: { units: 500, nanos: 0 },
//       isActive: true,
//       daysLeft: 4,
//       isFrozen: true,
//       level: 2,
//     },
//   },
//   {
//     host: {
//       userId: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
//       followersCount: 850,
//       followsCount: 120,
//       subscriptionsCount: 8,
//       publicationsCount: 42,
//       username: "Иван Сидоров",
//       email: "ivan@example.com",
//       isFollowed: true,
//       subLevel: 1,
//       avatarFileId: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
//     },
//     subscription: {
//       title: "Базовый +",
//       price: { units: 200, nanos: 0 },
//       isActive: true,
//       daysLeft: 4,
//       isFrozen: false,
//       level: 1,
//     },
//   },
//   {
//     host: {
//       userId: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
//       followersCount: 2400,
//       followsCount: 180,
//       subscriptionsCount: 22,
//       publicationsCount: 156,
//       username: "Мария Иванова",
//       email: "maria@example.com",
//       isFollowed: false,
//       subLevel: 3,
//       avatarFileId: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
//     },
//     subscription: {
//       title: "Гигаподписка",
//       price: { units: 1000, nanos: 0 },
//       isActive: false,
//       daysLeft: 4,
//       isFrozen: false,
//       level: 3,
//     },
//   },
//   {
//     host: {
//       userId: "3fa85f64-5717-4562-b3fc-2c963f66afa9",
//       followersCount: 500,
//       followsCount: 50,
//       subscriptionsCount: 5,
//       publicationsCount: 30,
//       username: "Алексей Смирнов",
//       email: "alex@example.com",
//       isFollowed: true,
//       subLevel: 2,
//       avatarFileId: "3fa85f64-5717-4562-b3fc-2c963f66afa9",
//     },
//     subscription: {
//       title: "Премиум+",
//       price: { units: 750, nanos: 0 },
//       isActive: true,
//       daysLeft: 4,
//       isFrozen: false,
//       level: 2,
//     },
//   },
// ];

const SnowflakeIcon = () => (
  <span style={{ color: "#1890ff", fontSize: "1.2em" }}>❄️</span>
);

export const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<ISubscriptionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleAuthorClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const renderExpirationAlert = (
    daysLeft: number,
    isActive: boolean,
    isFrozen: boolean
  ) => {
    const expiresAt = calculateExpiresAt(daysLeft);

    if (isFrozen) {
      return (
        <Tooltip title="Подписка заморожена. Дни не списываются">
          <Space>
            <SnowflakeIcon />
            <Text type="secondary">Заморожена до: {formatDate(expiresAt)}</Text>
          </Space>
        </Tooltip>
      );
    }
    if (!isActive) {
      return (
        <Space>
          <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
          <Text type="danger">Подписка неактивна</Text>
        </Space>
      );
    }

    if (daysLeft < 0) {
      return (
        <Space>
          <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
          <Text type="danger">Подписка истекла {formatDate(expiresAt)}</Text>
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
        <Text type="secondary">Активна до: {formatDate(expiresAt)}</Text>
      </Space>
    );
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getMySubscriptionsToUser();
      setSubscriptions(data);
    } catch {
      setError(true);
      messageApi.error("Не удалось загрузить подписки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "40px" }}
      >
        {contextHolder}
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
        {contextHolder}
        <Card>
          <div style={{ textAlign: "center" }}>
            <Title level={4} type="danger">
              Произошла ошибка при загрузке подписок
            </Title>
            <Button
              type="primary"
              onClick={fetchSubscriptions}
              style={{ marginTop: 16 }}
            >
              Повторить попытку
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
            renderItem={({ host, subscription }) => {
              const levelInfo = getLevelInfo(subscription.level);
              return (
                <List.Item
                  key={host.userId}
                  extra={
                    <Space direction="vertical" align="end">
                      <Tag
                        icon={levelInfo.icon}
                        color={levelInfo.color}
                        style={{ marginRight: 0 }}
                      >
                        {subscription.title}
                      </Tag>
                      <Text strong>
                        {convertPriceToNumber(subscription.price)} руб.
                      </Text>
                      {renderExpirationAlert(
                        subscription.daysLeft,
                        subscription.isActive,
                        subscription.isFrozen
                      )}
                    </Space>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <AvatarUser
                        size="large"
                        onClick={() => handleAuthorClick(host.userId)}
                        avatarFileId={host.avatarFileId}
                      />
                    }
                    title={
                      <a onClick={() => handleAuthorClick(host.userId)}>
                        {host.username}
                        {subscription.isFrozen && (
                          <Tooltip title="Подписка заморожена">
                            <span style={{ marginLeft: 8 }}>❄️</span>
                          </Tooltip>
                        )}
                      </a>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text>{subscription.title}</Text>
                        <Text type="secondary">
                          Подписчиков: {host.followersCount} • Постов:{" "}
                          {host.publicationsCount}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <CardDummy
            title="У вас пока нет активных подписок"
            subtitle="Подпишитесь на интересных авторов, чтобы получить доступ к
              эксклюзивному контенту"
            buttonText="К авторам"
            navigateTo="/users"
          />
        )}
      </Card>
    </div>
  );
};
