import { FC, useEffect, useState } from "react";
import { Typography, Button, Card, Image, Avatar, Spin, Space } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { ISubscription, type IPost } from "../../shared/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import { getPostFiles } from "../../shared/api";
import { useNavigate } from "react-router";
import { convertPriceToNumber } from "../../shared/lib";
import { ConfirmPayModal } from "../ConfirmPayModal/ConfirmPayModal";

dayjs.extend(relativeTime);
dayjs.locale("ru");

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
  userId: string;
}> = ({ username, publishDate, userId }) => {
  const navigate = useNavigate();
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
        onClick={() => navigate(`/profile/${userId}`)}
        // src={avatar}
        icon={<UserOutlined />}
        size="large"
        style={{ marginRight: 12, cursor: "pointer" }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/profile/${userId}`)}
          strong
        >
          {username}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <span title={formattedDate}>{relativeDate}</span>
        </Text>
      </div>
    </div>
  );
};

interface PostLockedMessageProps {
  subscription: ISubscription;
  channelName: string;
  onSubscriptionConfirmed?: () => void;
  post: IPost;
}

export const PostLockedMessage: FC<PostLockedMessageProps> = ({
  subscription,
  channelName,
  onSubscriptionConfirmed,
  post,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        className="post-card"
        style={{}}
        cover={
          <AuthorHeader
            userId={post.user.userId}
            username={post.user.username}
            avatar={post.user.avatarFileId}
            publishDate={post.publishDate}
          />
        }
      >
        <div
          style={{
            padding: 24,
            textAlign: "center",
            background: "#fafafa",
            borderTop: "1px dashed #d9d9d9",
          }}
        >
          <Space direction="vertical" size="middle">
            <LockOutlined style={{ fontSize: 48, color: "#999" }} />
            <Title level={4} style={{ marginBottom: 0 }}>
              {post.title}
            </Title>
            <Text>
              Чтобы разблокировать этот пост, нужно оформить подписку <br />
              <Text strong>«{subscription.title}»</Text> за{" "}
              <Text strong>
                {convertPriceToNumber(subscription.price)} ₽ / мес
              </Text>
              .
            </Text>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Оформить подписку
            </Button>
          </Space>
        </div>
      </Card>

      <ConfirmPayModal
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => {
          setModalOpen(false);
          onSubscriptionConfirmed?.();
        }}
        channelName={channelName}
        subscription={subscription}
      />
    </>
  );
};

const OpenPost: FC<IPostProps> = ({ post, onLike, isAuthenticated }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let currentUrls: string[] = [];

    const loadFiles = async () => {
      try {
        setLoading(true);
        const urls = await getPostFiles(post.files);
        setImageUrls(urls);
        currentUrls = urls;
      } finally {
        setLoading(false);
      }
    };

    if (post.files.length > 0) {
      loadFiles();
    }

    return () => {
      currentUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [post.files]);

  if (loading) return <Spin />;

  return (
    <Card
      className="post-card"
      cover={
        <>
          <AuthorHeader
            userId={post.user.userId}
            username={post.user.username}
            avatar={post.user.avatarFileId}
            publishDate={post.publishDate}
          />
          {imageUrls.length > 0 ? (
            <Image.PreviewGroup>
              {imageUrls.map((url, index) => (
                <Image
                  key={post.files[index].fileId}
                  height={250}
                  alt="post image"
                  src={url}
                  style={{ objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                  preview={{
                    mask: <span>Просмотр</span>,
                  }}
                />
              ))}
            </Image.PreviewGroup>
          ) : null}
        </>
      }
    >
      <Title level={4}>{post.title}</Title>
      <Text>{post.availableBody}</Text>
      {isAuthenticated && (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
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
};

export const Post: FC<IPostProps> = ({
  post,
  onLike,
  isAuthenticated = true,
}) => {
  return post.fullContent ? (
    <OpenPost post={post} onLike={onLike} isAuthenticated={isAuthenticated} />
  ) : (
    <PostLockedMessage
      post={post}
      subscription={post.subscription}
      channelName={post.user.username}
    />
  );
};
