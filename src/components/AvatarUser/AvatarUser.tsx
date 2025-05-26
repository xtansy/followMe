import { Avatar, Spin, theme } from "antd";
import { FC, useEffect, useState } from "react";
import { getAvatar } from "../../shared/api";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { useToken } = theme;

interface IAvatarUserProps {
  avatarFileId?: string | null;
  size?: "large" | "small" | "default" | number;
  showBorder?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
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
  onClick,
  style,
}) => {
  const { token } = useToken();
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let blobUrl: string | null = null;

    const fetchAvatar = async (fileId: string) => {
      try {
        setLoading(true);
        const url = await getAvatar(fileId);
        blobUrl = url;
        setAvatarUrl(url);
      } catch {
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (avatarFileId) {
      fetchAvatar(avatarFileId);
    } else {
      setLoading(false);
      setAvatarUrl(null);
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [avatarFileId]);

  return (
    <>
      <AvatarContainer>
        <Avatar
          onClick={onClick}
          size={size}
          icon={!avatarUrl && <UserOutlined />}
          src={avatarUrl || undefined}
          style={
            style || {
              cursor: onClick ? "pointer" : "default",
              border: showBorder ? `2px solid ${token.colorPrimary}` : "none",
              boxShadow: showBorder ? token.boxShadow : "none",
              transition: "all 0.3s ease",
            }
          }
        />
        {loading && (
          <LoadingOverlay>
            <Spin size="small" />
          </LoadingOverlay>
        )}
      </AvatarContainer>
    </>
  );
};
