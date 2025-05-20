import { FC } from "react";
import { Typography, Button, Card, Image, Avatar } from "antd";
import {
  HeartFilled,
  LockFilled,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { type IPost } from "../../shared/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru"; // или другой язык по необходимости

dayjs.extend(relativeTime);
dayjs.locale("ru"); // установите нужную локаль

const { Text, Title } = Typography;

interface IPostProps {
  post: IPost;
  onLike?: (id: string) => void;
  isAuthenticated?: boolean;
}

const AuthorHeader: FC<{
  username: string;
  avatar: string;
  publishDate: string;
}> = ({ username, avatar, publishDate }) => {
  const formattedDate = dayjs(publishDate).format("D MMMM YYYY в HH:mm");
  const relativeDate = dayjs(publishDate).fromNow();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 8,
        padding: "10px 24px 0",
      }}
    >
      <Avatar
        src={avatar}
        icon={!avatar && <UserOutlined />}
        size="large"
        style={{ marginRight: 12 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text strong>{username}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <span title={formattedDate}>{relativeDate}</span>
        </Text>
      </div>
    </div>
  );
};

const LockedPost: FC<IPostProps> = ({ post }) => (
  <Card
    className="post-card"
    style={{ marginBottom: 24 }}
    cover={
      <>
        <AuthorHeader
          username={post.user.username}
          avatar={post.user.avatarFileId}
          publishDate={post.publishDate}
        />
        <div
          style={{
            height: 250,
            background: "linear-gradient(135deg, #f0f2f5 0%, #d9d9d9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <LockFilled style={{ fontSize: 48, color: "#bfbfbf" }} />
            <Title level={4} style={{ marginTop: 16, color: "#8c8c8c" }}>
              {post.title}
            </Title>
          </div>
        </div>
      </>
    }
  >
    <div style={{ padding: 16 }}>
      <Text type="secondary" strong>
        Для просмотра требуется подписка
      </Text>
    </div>
  </Card>
);

const OpenPost: FC<IPostProps> = ({ post, onLike, isAuthenticated }) => (
  <Card
    className="post-card"
    style={{ marginBottom: 24 }}
    cover={
      <>
        <AuthorHeader
          username={post.user.username}
          avatar={post.user.avatarFileId}
          publishDate={post.publishDate}
        />
        <Image
          height={250}
          alt="post image"
          src={post.files[0]}
          preview={false}
          style={{ objectFit: "cover", borderRadius: "8px 8px 0 0" }}
        />
      </>
    }
  >
    <Title level={4}>{post.title}</Title>
    <Text>{post.availableBody}</Text>
    {isAuthenticated && (
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={
            post.liked ? (
              <HeartFilled style={{ color: "#ff4d4f" }} />
            ) : (
              <HeartOutlined />
            )
          }
          onClick={() => onLike?.(post.id)}
        >
          {post.likesCount}
        </Button>
      </div>
    )}
  </Card>
);

export const Post: FC<IPostProps> = ({
  post,
  onLike,
  isAuthenticated = true,
}) => {
  return post.fullContent ? (
    <OpenPost post={post} onLike={onLike} isAuthenticated={isAuthenticated} />
  ) : (
    <LockedPost post={post} isAuthenticated={isAuthenticated} />
  );
};
