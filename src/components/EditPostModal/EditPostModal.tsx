import { FC, useEffect, useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { editPost } from "../../shared/api";
import { IPost, ISubscription } from "../../shared/types";

const { TextArea } = Input;
const { Option } = Select;

interface IEditPostModalProps {
  visible: boolean;
  post: IPost;
  subscriptions: ISubscription[];
  onCancel: () => void;
  onSuccess: (postId: string, description: string) => void;
}

export const EditPostModal: FC<IEditPostModalProps> = ({
  visible,
  post,
  onCancel,
  onSuccess,
  subscriptions,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && post) {
      form.setFieldsValue({
        title: post.title,
        description: post.availableBody,
        requiredLevel: post.subscription.level,
      });
    }
  }, [visible, post, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await editPost({
        postId: post.id,
        description: values.description,
      });

      messageApi.success("Пост успешно обновлен");
      onSuccess(post.id, values.description);
      onCancel();
    } catch {
      messageApi.error("Не удалось обновить пост");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Редактировать пост"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Сохранить
        </Button>,
      ]}
      width={700}
      centered
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Заголовок">
          <Input placeholder="Введите заголовок" disabled />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
          rules={[{ required: true, message: "Введите описание" }]}
        >
          <TextArea rows={4} placeholder="Введите описание" />
        </Form.Item>

        <Form.Item name="requiredLevel" label="Уровень доступа">
          <Select disabled>
            {subscriptions.map((item) => (
              <Option value={item.title} key={item.level}>
                {item.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
