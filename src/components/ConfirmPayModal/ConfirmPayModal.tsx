import { FC, useState } from "react";
import { Modal, Typography, Button, Descriptions } from "antd";

import { type ISubscription } from "../../shared/types";

const { Title } = Typography;

interface ConfirmPayModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  channelName: string;
  subscription: ISubscription;
}

export const ConfirmPayModal: FC<ConfirmPayModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  channelName,
  subscription,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm?.();
    }, 2_000);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="pay" type="primary" loading={loading} onClick={handlePay}>
          Оплатить {subscription.price} ₽
        </Button>,
      ]}
      width={500}
      centered
      title={<Title level={4}>Подтверждение подписки</Title>}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Канал">{channelName}</Descriptions.Item>
        <Descriptions.Item label="Подписка">
          {subscription.title}
        </Descriptions.Item>
        <Descriptions.Item label="Описание">
          {subscription.description}
        </Descriptions.Item>
        <Descriptions.Item label="Уровень доступа">
          Уровень: {subscription.level}
        </Descriptions.Item>
        <Descriptions.Item label="Цена">
          {subscription.price} ₽ / месяц
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
