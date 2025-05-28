import { FC, useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { CreatePostModal } from "..";

import { type IPostParams } from "../../shared/api";
import { ISubscription } from "../../shared/types";

interface ICreatePostWidgetProps {
  onSubmit: (values: IPostParams) => void;
  subscriptions: ISubscription[];
  isLoading?: boolean;
}

export const CreatePostWidget: FC<ICreatePostWidgetProps> = ({
  onSubmit,
  subscriptions,
  isLoading = false,
}) => {
  const [createPostVisible, setCreatePostVisible] = useState(false);

  const onSubmitDecorator = (values: IPostParams) => {
    onSubmit(values);
    setCreatePostVisible(false);
  };

  return (
    <>
      <Button
        size="large"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setCreatePostVisible(true)}
        loading={isLoading}
      >
        Создать пост
      </Button>
      <CreatePostModal
        subscriptions={subscriptions}
        visible={createPostVisible}
        onCancel={() => setCreatePostVisible(false)}
        onSubmit={onSubmitDecorator}
      />
    </>
  );
};
