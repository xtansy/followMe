import { FC, ReactNode } from "react";
import { Outlet } from "react-router";
import { Layout as LayoutAnt } from "antd";

const { Content } = LayoutAnt;

interface LayoutProps {
  header: ReactNode;
  footer?: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ header, footer }) => {
  return (
    <LayoutAnt
      style={{
        background: "none",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: 1300,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {header}

      <Content style={{ flex: 1, padding: "24px 0" }}>
        <Outlet />
      </Content>

      {footer && (
        <LayoutAnt.Footer style={{ padding: "24px 0", marginTop: "auto" }}>
          {footer}
        </LayoutAnt.Footer>
      )}
    </LayoutAnt>
  );
};
