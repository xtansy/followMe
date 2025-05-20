import { FC, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
} from "antd";

import { type ISubscription } from "../../shared/types";

const { Title } = Typography;
const { Option } = Select;

interface ICreateSubscriptionModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: ISubscription) => void;
}

export const CreateSubscriptionModal: FC<ICreateSubscriptionModalProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      onCreate(values);
      form.resetFields();
    } catch (err) {
      console.error("Ошибка валидации:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="create"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Создать
        </Button>,
      ]}
      title={<Title level={4}>Создание подписки</Title>}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{ level: 0, price: 0 }}
      >
        <Form.Item
          label="Название уровня"
          name="title"
          rules={[{ required: true, message: "Введите название уровня" }]}
        >
          <Input placeholder="Например, 'Премиум подписка'" />
        </Form.Item>

        <Form.Item
          label="Описание"
          name="description"
          rules={[{ required: true, message: "Введите описание уровня" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Что получает пользователь, оформив эту подписку?"
          />
        </Form.Item>

        <Form.Item
          label="Цена (₽/мес)"
          name="price"
          rules={[{ required: true, message: "Укажите цену подписки" }]}
        >
          <InputNumber
            min={0}
            step={10}
            style={{ width: "100%" }}
            placeholder="Например, 299"
          />
        </Form.Item>

        <Form.Item
          label="Уровень доступа"
          name="level"
          rules={[{ required: true, message: "Выберите уровень доступа" }]}
        >
          <Select>
            <Option value={0}>Для всех</Option>
            <Option value={1}>Базовый уровень</Option>
            <Option value={2}>Премиум уровень</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
