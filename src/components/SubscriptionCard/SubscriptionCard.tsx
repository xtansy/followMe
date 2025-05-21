import { FC, useState } from "react";
import { CrownFilled } from "@ant-design/icons";
import { Button, Typography, Card } from "antd";

import { ConfirmPayModal } from "..";
import { type ISubscription } from "../../shared/types";
import { convertPriceToNumber } from "../../shared/lib";

const { Text } = Typography;

const getColor = (level: number): string => {
  if (level >= 0 && level <= 1) {
    return "#d4af37";
  }

  if (level >= 2 && level <= 3) {
    return "#e67e22";
  }

  return "#8e44ad"; // > 3
};

interface ISubscriptionCardProps extends ISubscription {
  isSubscribed?: boolean;
  channelName: string;
  isOwnProfile?: boolean;
  userId: string;
}

export const SubscriptionCard: FC<ISubscriptionCardProps> = ({
  isSubscribed = true,
  title,
  description,
  price,
  level,
  channelName,
  isOwnProfile = false,
  userId,
}) => {
  const [isVisibleConfirm, setIsVisibleConfirm] = useState<boolean>(false);

  const onConfirm = () => {
    setIsVisibleConfirm(false);
  };

  return (
    <Card
      type="inner"
      title={title}
      extra={<CrownFilled style={{ color: getColor(level) }} />}
    >
      <Text>{description}</Text>
      {!isOwnProfile && level !== 0 && (
        <Button
          onClick={() => setIsVisibleConfirm(true)}
          type="primary"
          block
          style={{ marginTop: 12 }}
          disabled={isSubscribed}
        >
          {isSubscribed
            ? "Уже подписаны"
            : `Подписаться — ${convertPriceToNumber(price)}₽`}
        </Button>
      )}
      <ConfirmPayModal
        userId={userId}
        visible={isVisibleConfirm}
        channelName={channelName}
        onCancel={() => setIsVisibleConfirm(false)}
        onConfirm={onConfirm}
        subscription={{ title, description, price, level }}
      />
    </Card>
  );
};
