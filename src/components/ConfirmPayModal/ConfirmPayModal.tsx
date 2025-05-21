import { FC, useState } from "react";
import { Modal, Typography, Button, Descriptions } from "antd";

import { type ISubscription } from "../../shared/types";
import { convertPriceToNumber } from "../../shared/lib";
import { subscribe } from "../../shared/api";

const { Title } = Typography;

interface ConfirmPayModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  channelName: string;
  subscription: ISubscription;
  userId: string;
}

export const ConfirmPayModal: FC<ConfirmPayModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  channelName,
  subscription,
  userId,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    subscribe({ hostId: userId, level: subscription.level })
      .then(({ paymentLink }) => {
        window.location.href = paymentLink;
        onConfirm?.();
      })
      .finally(() => setLoading(false));
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
          Оплатить {convertPriceToNumber(subscription.price)} ₽
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
          {convertPriceToNumber(subscription.price)} ₽ / месяц
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
