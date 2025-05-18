import { FC, useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

interface ILoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: FC<ILoginModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      console.log("Login data:", values);
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success("Вход выполнен успешно!");
      onSuccess();
    } catch {
      message.error("Ошибка входа. Проверьте данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Вход"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      bodyStyle={{ padding: "24px" }}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Введите логин" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Логин"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Пароль"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{ marginTop: 16 }}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
