import { signOut } from "next-auth/client";
import { useState } from "react";
import { Button, Image, Layout, LeftOutlined, RightOutlined } from "ui";
import styles from "../styles/Home.module.css";
import Navigation from "./navigation";

const { Header, Content, Footer, Sider } = Layout;

export default function withLayout(BaseComp) {
  function Page(props) {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <Layout className={styles.full_view}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src="/hcub-png-white.png" width={60} preview={false} />
            <h3 style={{ color: "white", marginLeft: 20 }}>Admin</h3>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}
            danger
          >
            Logout
          </Button>
        </Header>
        <Layout
          style={{
            height: "calc(100vh - 68px)",
            minHeight: "calc(100vh - 68px)",
            overflowY: "scroll",
          }}
        >
          <Sider
            style={{ height: "100%", position: "fixed", left: 0, top: 64 }}
            collapsible
            collapsed={collapsed}
            onCollapse={(cols, type) => setCollapsed(cols)}
            collapsedWidth={0}
            trigger={collapsed ? <RightOutlined /> : <LeftOutlined />}
            zeroWidthTriggerStyle={{ top: 10 }}
          >
            <Navigation />
          </Sider>
          <Content
            style={{
              marginLeft: collapsed ? 0 : 200,
              paddingLeft: 40,
              paddingTop: 20,
              paddingBottom: 30,
              paddingRight: 20,
              transition: "all 1s ease 0",
            }}
          >
            <BaseComp {...props} />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return Page;
}
