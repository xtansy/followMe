import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  Tooltip as TooltipAntd,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  CopyOutlined,
  RiseOutlined,
  UserSwitchOutlined,
  WalletOutlined,
  CrownOutlined,
  StarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { convertPriceToNumber } from "../../shared/lib";
import { type ISubscriptionDto } from "../../shared/types";
import { getMySubscribers } from "../../shared/api";
import { CardDummy } from "../../shared/ui";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;

const EMAIL = "followme-donation@yandex.com";

const getLevelInfo = (level: number) => {
  if (level === 0) return { color: "blue", icon: <StarOutlined /> };
  if (level === 1) return { color: "blue", icon: <StarOutlined /> };
  if (level === 2) return { color: "gold", icon: <CrownOutlined /> };
  return { color: "purple", icon: <FireOutlined /> };
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
//       expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
//       expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
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
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
//       expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
//       level: 2,
//     },
//   },
// ];

export const Income = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isWithdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [subscriptions, setSubscriptions] = useState<ISubscriptionDto[]>([]);

  const showWithdrawModal = () => setWithdrawModalVisible(true);
  const handleWithdrawClose = () => setWithdrawModalVisible(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      messageApi.success("Почта скопирована в буфер обмена!");
    });
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getMySubscribers();
      setSubscriptions(data);
    } catch {
      setError(true);
      messageApi.error("Не удалось загрузить данные о доходах");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const totalIncome = subscriptions.reduce(
    (sum, { subscription }) => sum + convertPriceToNumber(subscription.price),
    0
  );

  const currentMonthIncome = subscriptions
    .filter(({ subscription }) => {
      const date = new Date(subscription.expiresAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce(
      (sum, { subscription }) => sum + convertPriceToNumber(subscription.price),
      0
    );

  const activeSubscriptionsCount = subscriptions.filter(
    ({ subscription }) => subscription.isActive
  ).length;

  const transactions = subscriptions.map(({ host, subscription }) => ({
    id: host.userId,
    date: subscription.expiresAt,
    amount: convertPriceToNumber(subscription.price),
    user: host.username,
    userId: host.userId,
    subscriptionTitle: subscription.title,
    level: subscription.level,
    isActive: subscription.isActive,
  }));

  const columns = [
    {
      title: "Дата окончания",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (text: string) => (
        <Text style={{ color: "#666" }}>
          {new Date(text).toLocaleDateString("ru-RU")}
        </Text>
      ),
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount: number) => (
        <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
          {amount.toLocaleString("ru-RU")} ₽
        </Text>
      ),
    },
    {
      title: "Подписка",
      dataIndex: "subscriptionTitle",
      key: "subscriptionTitle",
      width: 200,
      render: (text: string, record: any) => {
        const levelInfo = getLevelInfo(record.level);
        return (
          <Tag icon={levelInfo.icon} color={levelInfo.color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Пользователь",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (text: string, record: any) => (
        <Text
          style={{ color: "#1890ff", cursor: "pointer" }}
          onClick={() => navigate(`/profile/${record.userId}`)}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Статус",
      key: "isActive",
      width: 120,
      render: (record: any) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Активна" : "Неактивна"}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "40px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <Title level={4} type="danger">
              Произошла ошибка при загрузке данных
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

  if (subscriptions.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          <WalletOutlined /> Доходы от подписок
        </Title>
        <CardDummy
          title="У вас пока нет дохода от подписок"
          subtitle="Начните получать доход, привлекая подписчиков на Ваш контент"
          buttonText="На главную"
          navigateTo="/"
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      {contextHolder}
      <Modal
        visible={isWithdrawModalVisible}
        onCancel={handleWithdrawClose}
        footer={null}
        centered
        title="Вывод средств"
      >
        <div style={{ padding: "8px 0", fontSize: 16, textAlign: "center" }}>
          Чтобы вывести деньги, напишите нам на почту:
          <br />
          <strong style={{ color: "#1890ff", userSelect: "all" }}>
            {EMAIL}
          </strong>
          <TooltipAntd title="Скопировать почту">
            <CopyOutlined
              onClick={handleCopyEmail}
              style={{
                marginLeft: 8,
                color: "#1890ff",
                cursor: "pointer",
                fontSize: 16,
              }}
            />
          </TooltipAntd>
        </div>
      </Modal>

      <Title level={2} style={{ marginBottom: 24 }}>
        <WalletOutlined /> Доходы от подписок
      </Title>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Общий доход"
              value={totalIncome}
              precision={0}
              valueStyle={{ color: "#52c41a" }}
              prefix={<RiseOutlined />}
              suffix="₽"
            />
            <Button
              type="primary"
              block
              style={{ marginTop: 16, background: "#52c41a" }}
              onClick={showWithdrawModal}
            >
              Вывести деньги
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Текущий месяц"
              value={currentMonthIncome}
              precision={0}
              valueStyle={{ color: "#1890ff" }}
              prefix={<CalendarOutlined />}
              suffix="₽"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Активных подписок"
              value={activeSubscriptionsCount}
              valueStyle={{ color: "#722ed1" }}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="История транзакций" bordered={false}>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
          bordered
          size="middle"
          rowClassName={() => "hover-row"}
          style={{
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        />
      </Card>
    </div>
  );
};
