import { FC, useState } from "react";
import {
  Button,
  Typography,
  Space,
  Card,
  message,
  Upload,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { follow, unfollow, postAvatar, getUser } from "../../shared/api";
import type { UploadChangeParam } from "antd/es/upload";
import { AvatarUser } from "../AvatarUser/AvatarUser";

const { Title, Text } = Typography;

interface IProfileCardProps {
  isOwnProfile?: boolean;
  username: string;
  postsLength: number;
  subscriptionsCount: number;
  followersCount: number;
  isFollowed?: boolean;
  userId: string;
  avatarFileId?: string;
}

export const ProfileCard: FC<IProfileCardProps> = ({
  isOwnProfile = false,
  username = "Username",
  postsLength = 0,
  subscriptionsCount = 0,
  followersCount = 0,
  isFollowed = false,
  userId,
  avatarFileId = "",
}) => {
  const [currentAvatarFileId, setCurrentAvatarFileId] =
    useState<string>(avatarFileId);
  const [messageApi, contextHolder] = message.useMessage();
  const [following, setFollowing] = useState(isFollowed);
  const [loadingFollow, setLoadingFollow] = useState(false);
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
    const file = info.fileList[0]?.originFileObj;
    if (!file) return;

    setUploadingAvatar(true);

    try {
      await postAvatar({ file });
      const { avatarFileId: newAvatarFileId } = await getUser(userId);
      setCurrentAvatarFileId(newAvatarFileId);
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
        <AvatarUser
          avatarFileId={currentAvatarFileId}
          size={128}
          showBorder={true}
        />

        {isOwnProfile && (
          <Upload
            showUploadList={false}
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleAvatarUpload}
            disabled={uploadingAvatar}
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
          <Button
            type={following ? "default" : "primary"}
            onClick={handleFollowToggle}
            loading={loadingFollow}
            style={{ width: 130 }}
          >
            {following ? "Отписаться" : "Подписаться"}
          </Button>
        )}

        <Space split={<Divider type="vertical" />} size="middle">
          <div style={{ textAlign: "center" }}>
            <Title level={5} style={{ margin: 0 }}>
              {subscriptionsCount}
            </Title>
            <Text type="secondary">Подписки</Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Title level={5} style={{ margin: 0 }}>
              {followersCount}
            </Title>
            <Text type="secondary">Подписчики</Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Title level={5} style={{ margin: 0 }}>
              {postsLength}
            </Title>
            <Text type="secondary">Посты</Text>
          </div>
        </Space>
      </Space>
    </Card>
  );
};
