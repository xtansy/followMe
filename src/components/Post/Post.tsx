import "./styles.scss";

import { FC } from "react";
import { Typography, Button, Card, Image } from "antd";
import { type IPost } from "../../shared/types";
import { HeartFilled, LockFilled, HeartOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface IPostProps {
  post: IPost;
  onLike?: (id: string) => void;
}

const LockedPost: FC<IPostProps> = ({ post }) => (
  <Card
    className="post-card"
    style={{
      marginBottom: 24,
    }}
    cover={
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
    }
  >
    <div style={{ padding: 16 }}>
      <Text type="secondary" strong>
        Для просмотра требуется подписка
      </Text>
    </div>
  </Card>
);

const OpenPost: FC<IPostProps> = ({ post, onLike }) => (
  <Card
    className="post-card"
    style={{ marginBottom: 24 }}
    cover={
      <Image
        height={250}
        alt="post image"
        src={post.files[0]}
        preview={false}
        style={{ objectFit: "cover", borderRadius: "12px" }}
      />
    }
  >
    <Title level={4}>{post.title}</Title>
    <Text>{post.availableBody}</Text>
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
  </Card>
);

export const Post: FC<IPostProps> = ({ post, onLike }) => {
  return post.fullContent ? (
    <OpenPost post={post} onLike={onLike} />
  ) : (
    <LockedPost post={post} />
  );
};
