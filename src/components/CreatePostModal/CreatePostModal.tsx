import { FC, useState } from "react";
import { Modal, Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import { type IPostParams } from "../../shared/api";
import { ISubscription } from "../../shared/types";

const { TextArea } = Input;
const { Option } = Select;

interface ICreatePostModalProps {
  visible: boolean;
  subscriptions: ISubscription[];
  onCancel: () => void;
  onSubmit: (values: IPostParams) => void;
}

export const CreatePostModal: FC<ICreatePostModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  subscriptions,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("Можно загружать только изображения!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      messageApi.error("Изображение должно быть меньше 5MB!");
    }
    return isImage && isLt5M;
  };

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setFileList(info.fileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const files: File[] = fileList
        .map((file) => file.originFileObj)
        .filter(Boolean) as File[];

      onSubmit({
        ...values,
        files,
      });

      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Создать новый пост"
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
          Опубликовать
        </Button>,
      ]}
      width={700}
      centered
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Заголовок"
          rules={[{ required: true, message: "Введите заголовок" }]}
        >
          <Input placeholder="Введите заголовок" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
          rules={[{ required: true, message: "Введите описание" }]}
        >
          <TextArea rows={4} placeholder="Введите описание" />
        </Form.Item>

        <Form.Item
          name="requiredLevel"
          label="Уровень доступа"
          initialValue={0}
        >
          <Select>
            {subscriptions.map((item) => (
              <Option value={item.level}>{item.title}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Изображения">
          <Upload
            multiple
            beforeUpload={(file) => {
              return beforeUpload(file) ? false : Upload.LIST_IGNORE;
            }}
            onChange={handleChange}
            fileList={fileList}
            accept="image/*"
            showUploadList={{
              showPreviewIcon: false,
              showRemoveIcon: true,
            }}
          >
            <Button icon={<UploadOutlined />}>Загрузить изображения</Button>
          </Upload>
          <div style={{ marginTop: 8, color: "rgba(0, 0, 0, 0.45)" }}>
            Максимальный размер файла: 5MB
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
