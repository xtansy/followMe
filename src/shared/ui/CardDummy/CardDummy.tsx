import { Card, Typography, Button } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router";
const { Title, Text } = Typography;

interface ICardDummyProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  navigateTo?: string;
}

export const CardDummy: FC<ICardDummyProps> = ({
  title,
  subtitle,
  buttonText,
  navigateTo,
}) => {
  const navigate = useNavigate();
  return (
    <Card bordered={false} style={{ textAlign: "center" }}>
      <Title level={4} type="secondary">
        {title}
      </Title>
      <Text type="secondary">{subtitle}</Text>
      {buttonText && navigateTo && (
        <div style={{ marginTop: 16 }}>
          <Button
            onClick={() => navigate(navigateTo)}
            type="primary"
            size="large"
          >
            {buttonText}
          </Button>
        </div>
      )}
    </Card>
  );
};
