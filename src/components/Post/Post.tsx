import {
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  LockOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Input,
  List,
  Popconfirm,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  API_URL,
  IFileUrl,
  createComment,
  deleteComment,
  deleteMyPost,
  getPostFiles,
} from "../../shared/api";
import { convertPriceToNumber } from "../../shared/lib";
import { ISubscription, type IPost } from "../../shared/types";
import { useStore } from "../../store/context";
import { AvatarUser } from "../AvatarUser/AvatarUser";
import { ConfirmPayModal } from "../ConfirmPayModal/ConfirmPayModal";
import { EditPostModal } from "../EditPostModal/EditPostModal";

dayjs.extend(relativeTime);
dayjs.locale("ru");

const { Text, Title } = Typography;
const { TextArea } = Input;

interface IPostProps {
  post: IPost;
  onLike?: (id: string) => void;
  isAuthenticated?: boolean;
  onDeletePost?: (id: string) => void;
  onCommentAdded?: (postId: string, newComment: IPost["comments"][0]) => void;
  onCommentDeleted?: (postId: string, commentId: string) => void;
}

const AuthorHeader: FC<{
  username: string;
  publishDate: string;
  userId: string;
  avatarFileId: string;
}> = ({ username, publishDate, userId, avatarFileId }) => {
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
      <div style={{ marginRight: 12, cursor: "pointer" }}>
        <AvatarUser
          size="large"
          onClick={() => navigate(`/profile/${userId}`)}
          avatarFileId={avatarFileId}
        />
      </div>

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
            avatarFileId={post.user.avatarFileId}
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
        userId={post.user.userId}
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

export const OpenPost: FC<IPostProps> = observer(
  ({
    post,
    onLike,
    isAuthenticated,
    onDeletePost,
    onCommentAdded,
    onCommentDeleted,
  }) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [editingPost, setEditingPost] = useState<IPost | null>(null);
    const { userStore } = useStore();
    const isOwnPost = userStore.userId === post.user.userId;

    const [fileUrls, setFileUrls] = useState<IFileUrl[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
      let currentUrls: IFileUrl[] = [];

      const loadFiles = async () => {
        try {
          console.log(post.files)
          setLoading(true);
          const urls = post.files.map(file => ({
            url: file.fileId,
            mimeType: file.contentType
          }));
           setFileUrls(urls);
           currentUrls = urls;
        } finally {
          setLoading(false);
        }
      };

      if (post.files.length > 0) {
        loadFiles();
      }

      return () => {
        currentUrls.forEach((file) => URL.revokeObjectURL(file.url));
      };
    }, [post.files]);

    const handleDelete = async () => {
      try {
        onDeletePost?.(post.id);
        await deleteMyPost(post.id);
        messageApi.success("Пост удалён");
      } catch {
        messageApi.error("Не удалось удалить пост");
      }
    };

    const handleAddComment = async () => {
      if (!newComment.trim() || !userStore.userId) return;

      try {
        setCommentLoading(true);
        const newPostObj = await createComment({
          postId: post.id,
          message: newComment,
          userId: userStore.userId,
        });

        onCommentAdded?.(post.id, newPostObj);
        setNewComment("");
        messageApi.success("Комментарий добавлен");
      } catch {
        messageApi.error("Не удалось добавить комментарий");
      } finally {
        setCommentLoading(false);
      }
    };

    const handleDeleteComment = async (index: number) => {
      try {
        const comment = post.comments[index];
        await deleteComment({
          postId: post.id,
          commentId: comment.id,
        });

        onCommentDeleted?.(post.id, comment.id);

        messageApi.success("Комментарий удалён");
      } catch {
        messageApi.error("Не удалось удалить комментарий");
      }
    };

    const renderPostMedia = () => {
      if (fileUrls.length === 1) {
        const file = fileUrls[0];

        return file.mimeType.startsWith("video") ? (
          <video
            src={API_URL+"/api/files/"+file.url}
            controls
            style={{
              width: "100%",
              maxHeight: 400,
              borderRadius: "8px 8px 0 0",
              objectFit: "cover",
            }}
          />
        ) : (
          <Image
            src={file.url}
            alt="post image"
            preview={{ mask: <span>Просмотр</span> }}
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: "8px 8px 0 0",
            }}
          />
        );
      }

      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              fileUrls.length === 2
                ? "1fr 1fr"
                : fileUrls.length === 3
                ? "1fr 1fr 1fr"
                : "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8,
            padding: 8,
            paddingTop: 0,
          }}
        >
          {fileUrls.map((file, index) =>
            file.mimeType.startsWith("video") ? (
              <video
                key={post.files[index].fileId}
                src={file.url}
                controls
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <Image
                key={post.files[index].fileId}
                src={file.url}
                alt={`post image ${index + 1}`}
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
                preview={{ mask: <span>Просмотр</span> }}
              />
            )
          )}
        </div>
      );
    };

    if (loading) return <Spin />;

    return (
      <Card
        className="post-card"
        style={{ position: "relative" }}
        cover={
          <>
            <AuthorHeader
              userId={post.user.userId}
              username={post.user.username}
              avatarFileId={post.user.avatarFileId}
              publishDate={post.publishDate}
            />
            {fileUrls.length > 0 && (
              <Image.PreviewGroup>{renderPostMedia()}</Image.PreviewGroup>
            )}
          </>
        }
      >
        {contextHolder}
        {isOwnPost && (
          <>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditingPost(post)}
              style={{ position: "absolute", top: 12, right: 48 }}
            />
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              style={{ position: "absolute", top: 12, right: 12 }}
            />
          </>
        )}
        {editingPost && (
          <EditPostModal
            subscriptions={[]}
            visible={!!editingPost}
            post={editingPost}
            onCancel={() => setEditingPost(null)}
            onSuccess={() => {
              setEditingPost(null);
            }}
          />
        )}
        {isOwnPost && (
          <Popconfirm
            title="Удалить пост?"
            description="Вы уверены, что хотите удалить этот пост?"
            onConfirm={handleDelete}
            okText="Да"
            cancelText="Отмена"
          >
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              style={{ position: "absolute", top: 12, right: 12 }}
            />
          </Popconfirm>
        )}

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

        <div style={{ marginTop: 24 }}>
          <Title level={5}>Комментарии ({post.comments?.length || 0})</Title>

          {isAuthenticated && (
            <div style={{ marginBottom: 16 }}>
              <TextArea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Написать комментарий..."
                style={{ marginBottom: 8 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleAddComment}
                loading={commentLoading}
                disabled={!newComment.trim()}
              >
                Отправить
              </Button>
            </div>
          )}

          {post.comments.length > 0 && (
            <List
              dataSource={post.comments}
              renderItem={(comment, index) => (
                <List.Item
                  style={{ padding: "12px 0", alignItems: "flex-start" }}
                  actions={[
                    userStore.userId === comment.userInfo.userId && (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteComment(index)}
                      />
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <AvatarUser
                        onClick={() =>
                          navigate(`/profile/${comment.userInfo.userId}`)
                        }
                        size="default"
                        avatarFileId={comment.userInfo.avatarFileId}
                      />
                    }
                    title={<Text strong>{comment.userInfo.username}</Text>}
                    description={
                      <>
                        <Text>{comment.message}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(comment.createdAt).fromNow()}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Card>
    );
  }
);

export const Post: FC<IPostProps> = ({
  post,
  onLike,
  isAuthenticated = true,
  onDeletePost,
  onCommentAdded,
  onCommentDeleted,
}) => {
  return post.fullContent ? (
    <OpenPost
      onCommentAdded={onCommentAdded}
      onCommentDeleted={onCommentDeleted}
      onDeletePost={onDeletePost}
      post={post}
      onLike={onLike}
      isAuthenticated={isAuthenticated}
    />
  ) : (
    <PostLockedMessage
      post={post}
      subscription={post.subscription}
      channelName={post.user.username}
    />
  );
};
