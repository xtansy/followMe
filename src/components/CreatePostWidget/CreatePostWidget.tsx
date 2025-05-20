import { FC, useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { CreatePostModal } from "..";

import { type IPostParams } from "../../shared/api";
import { ISubscription } from "../../shared/types";

interface ICreatePostWidgetProps {
  onSubmit: (values: IPostParams) => void;
  subscriptions: ISubscription[];
}

export const CreatePostWidget: FC<ICreatePostWidgetProps> = ({
  onSubmit,
  subscriptions,
}) => {
  const [createPostVisible, setCreatePostVisible] = useState(false);

  return (
    <>
      <Button
        size="large"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setCreatePostVisible(true)}
      >
        Создать пост
      </Button>
      <CreatePostModal
        subscriptions={subscriptions}
        visible={createPostVisible}
        onCancel={() => setCreatePostVisible(false)}
        onSubmit={onSubmit}
      />
    </>
  );
};
