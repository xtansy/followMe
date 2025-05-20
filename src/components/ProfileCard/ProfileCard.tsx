import { FC } from "react";
import { Avatar, Button, Typography, Space, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface IProfileCardProps {
  isOwnProfile?: boolean;
  username: string;
  onSubscribe?: () => void;
  isSubscribed?: boolean;
  postsLength: number;
}

export const ProfileCard: FC<IProfileCardProps> = ({
  isOwnProfile = false,
  onSubscribe,
  isSubscribed = false,
  username = "Username",
  postsLength = 2,
}) => {
  return (
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
          {username}
        </Title>
        <Text type="secondary">@{username.toLowerCase()}</Text>

        {!isOwnProfile && (
          <Space>
            <Button
              type={isSubscribed ? "default" : "primary"}
              onClick={() => onSubscribe?.()}
              style={{ margin: "16px 0", width: "100%" }}
            >
              {isSubscribed ? "Отписаться" : "Подписаться"}
            </Button>

            <Button>Отслеживать</Button>
          </Space>
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
              {postsLength}
            </Title>
            <Text type="secondary">Постов</Text>
          </div>
        </Space>
      </Space>
    </Card>
  );
};
