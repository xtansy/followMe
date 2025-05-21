import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  RiseOutlined,
  UserSwitchOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const { Title, Text } = Typography;

interface Transaction {
  id: string;
  date: string;
  amount: number;
  user: string;
  subscriptionTitle: string;
  level: number;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-03-15",
    amount: 1500,
    user: "Анна Петрова",
    subscriptionTitle: "Премиум",
    level: 2,
  },
  {
    id: "2",
    date: "2024-03-14",
    amount: 500,
    level: 4,
    user: "Иван Сидоров",
    subscriptionTitle: "Гигаподписка",
  },
  {
    id: "3",
    date: "2024-03-13",
    amount: 2500,
    level: 4,
    user: "Мария Иванова",
    subscriptionTitle: "VIP",
  },
  {
    id: "4",
    date: "2024-03-12",
    amount: 1500,
    level: 1,
    user: "Алексей Смирнов",
    subscriptionTitle: "Базовый+",
  },
];

const monthlyData = [
  { month: "Янв", income: 45000 },
  { month: "Фев", income: 52000 },
  { month: "Мар", income: 48000 },
  { month: "Апр", income: 0 },
  { month: "Май", income: 0 },
  { month: "Июн", income: 0 },
];

const getLevelInfo = (level: number) => {
  if (level >= 0 && level <= 1) {
    return { color: "blue" };
  }

  if (level >= 2 && level <= 3) {
    return { color: "gold" };
  }

  return { color: "purple" };
};

export const Income = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const columns = [
    {
      title: "Дата",
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
      render: (text: string, order: Transaction) => {
        return (
          <div>
            <div>
              <Tag color={getLevelInfo(order.level).color}>{text}</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Пользователь",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (text: string) => (
        <Text style={{ color: "#1890ff" }}>{text}</Text>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <WalletOutlined /> Доходы от подписок
      </Title>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Общий доход"
              value={112_400}
              precision={0}
              valueStyle={{ color: "#52c41a" }}
              prefix={<RiseOutlined />}
              suffix="₽"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Текущий месяц"
              value={32_500}
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
              value={45}
              valueStyle={{ color: "#722ed1" }}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <span>
            <BarChartOutlined /> График доходов
          </span>
        }
        bordered={false}
        style={{ marginBottom: 24 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                boxShadow: "0 3px 6px -4px rgba(0,0,0,0.12)",
              }}
            />
            <Bar
              dataKey="income"
              fill="#1890ff"
              name="Доход"
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

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

      <style>{`
        .hover-row:hover td {
          background-color: #fafafa !important;
          transition: background-color 0.3s ease;
        }
        .ant-table-thead > tr > th {
          background-color: #f8f9fa !important;
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
};
