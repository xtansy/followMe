import "./styles.scss";

import { useState } from "react";

import { CreateSubscriptionModal } from "..";
import { CrownFilled } from "@ant-design/icons";
import { Button } from "antd";

export const CreateSubscriptionWidget = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
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
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        onCreate={(subscription) => {
          console.log("Создана подписка:", subscription);
          setIsOpen(false);
        }}
      />
    </>
  );
};
