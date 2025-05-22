import { FC, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
  Button,
  Alert,
} from "antd";

import { type ISubscription } from "../../shared/types";
import { convertNumberToPrice, convertPriceToNumber } from "../../shared/lib";

const { Title, Text } = Typography;

interface ICreateSubscriptionModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: ISubscription) => void;
  mostExpensiveSubscription: ISubscription;
}

export const CreateSubscriptionModal: FC<ICreateSubscriptionModalProps> = ({
  visible,
  mostExpensiveSubscription,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const price = convertNumberToPrice(values.price);
      onCreate({
        ...values,
        price,
        level: mostExpensiveSubscription.level + 1,
      });
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
        initialValues={{
          price: convertPriceToNumber(mostExpensiveSubscription.price) + 1,
        }}
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
          rules={[
            { required: true, message: "Укажите цену подписки" },
            () => ({
              validator(_, value) {
                if (value === undefined || value === null) {
                  return Promise.reject(new Error("Поле не может быть пустым"));
                }
                if (typeof value !== "number" || isNaN(value)) {
                  return Promise.reject(
                    new Error("Введите корректное числовое значение")
                  );
                }
                if (
                  value < convertPriceToNumber(mostExpensiveSubscription.price)
                ) {
                  return Promise.reject(
                    new Error("Цена должна быть выше предыдущей подписки")
                  );
                }
                if (value > 1_000_000) {
                  return Promise.reject(new Error("Слишком большая сумма"));
                }
                const decimalPart = value.toString().split(".")[1];
                if (decimalPart && decimalPart.length > 2) {
                  return Promise.reject(
                    new Error("Максимум 2 знака после запятой")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber<number>
            min={1}
            max={1_000_000}
            step={10}
            precision={2}
            style={{ width: "100%" }}
            placeholder="Например, 299 или 299.99"
            formatter={(value) => {
              if (value == null) return "";
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }}
            parser={(value) => {
              if (typeof value !== "string") return 0;
              const clean = value.replace(/\s/g, "").replace(",", ".");
              const normalized = clean.replace(/^0+(?!\.)/, "") || "0";
              return parseFloat(normalized);
            }}
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "Tab",
                "ArrowLeft",
                "ArrowRight",
                "Delete",
                "Home",
                "End",
                ".",
                ",", // разрешаем разделитель
              ];
              const isNumber = /^[0-9]$/.test(e.key);
              if (!isNumber && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Alert
          message={
            <Text>
              Уровень новой подписки будет{" "}
              <Text strong>{mostExpensiveSubscription.level + 1}</Text> (выше,
              чем "<Text strong>{mostExpensiveSubscription.title}</Text>" с
              уровнем <Text strong>{mostExpensiveSubscription.level}</Text>)
            </Text>
          }
          type="info"
          showIcon
        />
      </Form>
    </Modal>
  );
};
