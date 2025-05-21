import { FC, useState } from "react";
import { Avatar, Button, Typography, Space, Card, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { follow, unfollow } from "../../shared/api";
const { Title, Text } = Typography;

interface IProfileCardProps {
  isOwnProfile?: boolean;
  username: string;
  postsLength: number;
  subscriptionsCount: number;
  followersCount: number;
  isFollowed?: boolean;
  userId: string;
}

export const ProfileCard: FC<IProfileCardProps> = ({
  isOwnProfile = false,
  username = "Username",
  postsLength = 2,
  subscriptionsCount,
  followersCount,
  isFollowed = false,
  userId,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [following, setFollowing] = useState(isFollowed);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const handleFollowToggle = async () => {
    setLoadingFollow(true);
    try {
      if (following) {
        await unfollow({ userId });
        messageApi.success(`Вы больше не отслеживаете ${username}`);
      } else {
        await follow({ userId });
        messageApi.success(`Вы отслеживаете ${username}`);
      }
      setFollowing(!following);
    } catch {
      messageApi.error("Произошла ошибка");
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <Card
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        borderRadius: 12,
        position: "sticky",
        top: 32,
      }}
    >
      {contextHolder}
      <Space direction="vertical" align="center" style={{ width: "100%" }}>
        <Avatar
          size={128}
          icon={<UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Title level={4} style={{ marginBottom: 0 }}>
          {username}
        </Title>

        {!isOwnProfile && (
          <Space>
            <Button
              type={following ? "default" : "dashed"}
              onClick={handleFollowToggle}
              loading={loadingFollow}
              style={{ width: 130 }}
            >
              {following ? "Не отслеживать" : "Отслеживать"}
            </Button>
          </Space>
        )}

        <Space split={<div style={{ width: 1, background: "#f0f0f0" }} />}>
          <div style={{ textAlign: "center" }}>
            <Title level={5} style={{ margin: 0 }}>
              {subscriptionsCount}
            </Title>
            <Text type="secondary">Подписок</Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Title level={5} style={{ margin: 0 }}>
              {followersCount}
            </Title>
            <Text type="secondary">Отслеживают</Text>
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
