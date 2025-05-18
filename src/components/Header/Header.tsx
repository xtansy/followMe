import { Layout, Typography, Button, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { LoginModal, RegisterModal } from "..";

const { Header: HeaderAnt } = Layout;
const { Title } = Typography;

export const Header = () => {
  const navigate = useNavigate();
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
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
        onSuccess={() => setLoginVisible(false)}
      />
      <RegisterModal
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
        onSuccess={() => setRegisterVisible(false)}
      />
      <Title
        onClick={() => navigate("/")}
        level={3}
        style={{ margin: 0, color: "#1890ff", cursor: "pointer" }}
      >
        FollowMe
      </Title>
      <Space>
        <Button type="primary" onClick={() => setLoginVisible(true)}>
          Вход
        </Button>
        <Button onClick={() => setRegisterVisible(true)}>Регистрация</Button>
      </Space>
    </HeaderAnt>
  );
};
