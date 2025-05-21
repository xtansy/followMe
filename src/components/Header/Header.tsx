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
import {
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  EyeOutlined,
  HeartOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";

import { LoginModal, RegisterModal } from "..";
import { useStore } from "../../store/context";

const { Header: HeaderAnt } = Layout;
const { Title } = Typography;

export const Header = observer(() => {
  const { userStore } = useStore();

  const navigate = useNavigate();
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const handleLogout = () => {
    navigate("/");
    userStore.logout();
  };

  const onClickMyProfile = () => {
    navigate(`/profile/${userStore.userId}`);
  };

  const onClickUsers = () => {
    navigate("/users");
  };

  const onClickFollows = () => {
    navigate("/follows");
  };

  const onClickSubscriptions = () => {
    navigate("/subscriptions");
  };

  const onClickIncome = () => {
    navigate("/income");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={onClickMyProfile}>
        <Space>
          <UserOutlined />
          Мой профиль
        </Space>
      </Menu.Item>
      <Menu.Item key="income" onClick={onClickIncome}>
        <Space>
          <WalletOutlined />
          Мой доход
        </Space>
      </Menu.Item>
      <Menu.Item key="subscriptions" onClick={onClickSubscriptions}>
        <Space>
          <HeartOutlined />
          Мои подписки
        </Space>
      </Menu.Item>
      <Menu.Item key="tracked" onClick={onClickFollows}>
        <Space>
          <EyeOutlined />
          Отслеживаемое
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
        }}
      />
      <RegisterModal
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
        onSuccess={() => {
          setRegisterVisible(false);
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
        {userStore.isAuthenticated && (
          <Button
            type="text"
            icon={<TeamOutlined />}
            onClick={onClickUsers}
            style={{ color: "#1890ff" }}
          >
            Пользователи
          </Button>
        )}

        {userStore.isAuthenticated ? (
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
});
