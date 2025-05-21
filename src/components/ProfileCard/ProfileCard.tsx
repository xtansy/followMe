import { FC, useState } from "react";
import { Avatar, Button, Typography, Space, Card, message, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { follow, unfollow } from "../../shared/api";
import type { UploadChangeParam } from "antd/es/upload";

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  const handleAvatarUpload = async (info: UploadChangeParam) => {
    const latestFile = info.fileList[info.fileList.length - 1];
    const file = latestFile?.originFileObj;

    if (!file) return;

    setUploadingAvatar(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      messageApi.success("Аватар обновлён!");
    } catch {
      messageApi.error("Ошибка при загрузке аватара");
    } finally {
      setUploadingAvatar(false);
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
          icon={!avatarUrl && <UserOutlined />}
          src={avatarUrl || undefined}
          style={{ marginBottom: 8 }}
        />

        {isOwnProfile && (
          <Upload
            showUploadList={false}
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleAvatarUpload}
          >
            <Button
              icon={<UploadOutlined />}
              size="small"
              loading={uploadingAvatar}
            >
              Изменить аватар
            </Button>
          </Upload>
        )}

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
