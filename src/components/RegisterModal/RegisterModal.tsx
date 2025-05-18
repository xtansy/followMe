import { FC, useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

interface IRegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterModal: FC<IRegisterModalProps> = ({
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
      console.log("Register data:", values);
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success("Регистрация прошла успешно!");
      onSuccess();
    } catch {
      message.error("Ошибка регистрации. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject("Пароли не совпадают");
    },
  });

  return (
    <Modal
      title="Регистрация"
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
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 6, message: "Минимум 6 символов" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Пароль"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Подтвердите пароль" },
            validatePassword,
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Подтвердите пароль"
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
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
