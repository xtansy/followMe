import {
  Layout,
  Typography,
  Button,
  Space,
  Avatar,
  Dropdown,
  Menu,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { LoginModal, RegisterModal } from "..";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header: HeaderAnt } = Layout;
const { Title } = Typography;

export const Header = () => {
  const navigate = useNavigate();
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile/1")}>
        <Space>
          <UserOutlined />
          Мой профиль
        </Space>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        onClick={handleLogout}
        style={{ color: "#ff4d4f" }}
      >
        <Space>
          <LogoutOutlined />
          Выйти
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderAnt
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: "0 35px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        onSuccess={() => {
          setLoginVisible(false);
          setIsLoggedIn(true);
        }}
      />
      <RegisterModal
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
        onSuccess={() => {
          setRegisterVisible(false);
          setIsLoggedIn(true);
        }}
      />

      <Title
        onClick={() => navigate("/")}
        level={3}
        style={{ margin: 0, color: "#1890ff", cursor: "pointer" }}
      >
        FollowMe
      </Title>

      <Space>
        {isLoggedIn ? (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              type="link"
              style={{
                padding: "0 8px",
                height: 32,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Avatar size="small" icon={<UserOutlined />} />
              <span style={{ color: "#1890ff" }}>Мой профиль</span>
            </Button>
          </Dropdown>
        ) : (
          <>
            <Button type="primary" onClick={() => setLoginVisible(true)}>
              Вход
            </Button>
            <Button onClick={() => setRegisterVisible(true)}>
              Регистрация
            </Button>
          </>
        )}
      </Space>
    </HeaderAnt>
  );
};
