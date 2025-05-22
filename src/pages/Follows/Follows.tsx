import { useEffect, useState } from "react";
import { getMyFollows } from "../../shared/api";
import { useNavigate } from "react-router";
import { Card, Col, Row, Spin, Typography } from "antd";
import { type IUserInfo } from "../../shared/types";
import { CardDummy } from "../../shared/ui";
import { AvatarUser } from "../../components";

const { Text, Title } = Typography;

export const Follows = () => {
  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const follows = await getMyFollows();
        setUsers(follows);
      } catch (error) {
        console.error("Ошибка загрузки пользователей", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "100px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1300px", margin: "0 auto" }}>
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "32px", color: "#1890ff" }}
      >
        Отслеживаемые пользователи
      </Title>

      {users.length === 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CardDummy
            title="Вы еще никого не отслеживаете"
            subtitle="Подпишитесь на интересных авторов, чтобы получить доступ к эксклюзивному контенту"
            buttonText="К авторам"
            navigateTo="/users"
          />
        </div>
      )}

      <Row gutter={[24, 24]}>
        {users.map((user) => (
          <Col key={user.userId} xs={24} sm={12} md={8} lg={6}>
            <div
              style={{
                transform:
                  hoveredCard === user.userId ? "translateY(-5px)" : "none",
                transition: "all 0.3s ease",
                filter:
                  hoveredCard === user.userId
                    ? "drop-shadow(0 10px 20px rgba(24, 144, 255, 0.2))"
                    : "none",
              }}
              onMouseEnter={() => setHoveredCard(user.userId)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card
                hoverable
                onClick={() => navigate(`/profile/${user.userId}`)}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  border: "none",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div
                    style={{
                      height: "120px",
                      background:
                        "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      paddingBottom: "16px",
                    }}
                  >
                    <AvatarUser
                      avatarFileId={user.avatarFileId}
                      size={80}
                      style={{
                        border: "3px solid #fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        transition: "all 0.3s ease",
                        transform:
                          hoveredCard === user.userId ? "scale(1.1)" : "none",
                      }}
                    />
                  </div>
                }
              >
                <div style={{ textAlign: "center", marginBottom: 16, flex: 1 }}>
                  <Title
                    level={4}
                    style={{ marginBottom: 4, color: "#1890ff" }}
                  >
                    {user.username}
                  </Title>
                </div>

                <Row
                  justify="space-between"
                  style={{
                    textAlign: "center",
                    background: "#f9f9f9",
                    borderRadius: 8,
                    padding: "12px 4px",
                    marginTop: "auto",
                  }}
                >
                  <Col span={7}>
                    <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                      {user.subscriptionsCount}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Подписчики
                    </Text>
                  </Col>
                  <Col span={10}>
                    <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                      {user.followersCount}
                    </Text>
                    <br />
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, whiteSpace: "nowrap" }}
                    >
                      Отслеживают
                    </Text>
                  </Col>
                  <Col span={7}>
                    <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                      {user.publicationsCount}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Постов
                    </Text>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};
