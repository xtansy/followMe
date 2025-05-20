import "./styles.scss";

import { FC, useState } from "react";

import { CreateSubscriptionModal } from "..";
import { CrownFilled } from "@ant-design/icons";
import { Button, message } from "antd";
import { type ISubscription } from "../../shared/types";
import { ISubscriptionParams } from "../../shared/api";

interface ICreateSubscriptionWidgetProps {
  mostExpensiveSubscription: ISubscription;
  onSubmit: (subscription: ISubscriptionParams) => Promise<any>;
}

export const CreateSubscriptionWidget: FC<ICreateSubscriptionWidgetProps> = ({
  mostExpensiveSubscription,
  onSubmit,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmitDecorator = (subscription: ISubscriptionParams) => {
    onSubmit(subscription)
      .then(() => messageApi.success("Успех!"))
      .catch(() => messageApi.error("Неудача!"))
      .finally(() => {
        setIsOpen(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Button
        style={{ marginBottom: "7px" }}
        className="subscribe-button"
        size="large"
        type="primary"
        icon={<CrownFilled />}
        onClick={() => setIsOpen(true)}
      >
        Создать подписку
      </Button>

      <CreateSubscriptionModal
        mostExpensiveSubscription={mostExpensiveSubscription}
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        onCreate={onSubmitDecorator}
      />
    </>
  );
};
