import { Avatar, Spin, message, theme } from "antd";
import { FC, useEffect, useState } from "react";
import { getAvatar } from "../../shared/api";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { useToken } = theme;

interface IAvatarUserProps {
  avatarFileId: string;
  size?: number;
  showBorder?: boolean;
}

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
`;

export const AvatarUser: FC<IAvatarUserProps> = ({
  avatarFileId,
  size = 128,
  showBorder = true,
}) => {
  const { token } = useToken();
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let blobUrl: string | null = null;

    const fetchAvatar = async () => {
      try {
        setLoading(true);
        const url = await getAvatar(avatarFileId);
        blobUrl = url;
        setAvatarUrl(url);
      } catch {
        messageApi.error("Не удалось загрузить аватар");
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (avatarFileId) {
      fetchAvatar();
    } else {
      setLoading(false);
      setAvatarUrl(null);
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [avatarFileId, messageApi]);

  return (
    <>
      <AvatarContainer>
        <Avatar
          size={size}
          icon={!avatarUrl && <UserOutlined />}
          src={avatarUrl || undefined}
          style={{
            marginBottom: 8,
            border: showBorder ? `2px solid ${token.colorPrimary}` : "none",
            boxShadow: showBorder ? token.boxShadow : "none",
            transition: "all 0.3s ease",
          }}
        />
        {loading && (
          <LoadingOverlay>
            <Spin size="small" />
          </LoadingOverlay>
        )}
      </AvatarContainer>
      {contextHolder}
    </>
  );
};
