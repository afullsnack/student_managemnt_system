import { useState } from "react";
import { Layout, LeftOutlined, RightOutlined } from "ui";
import styles from "../styles/Home.module.css";
import Navigation from "./navigation";

const { Header, Content, Footer, Sider } = Layout;

export default function withLayout(BaseComp) {
  function Page(props) {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <Layout className={styles.full_view}>
        <Header>
          <h3 style={{ color: "white" }}>Admin</h3>
        </Header>
        <Layout
          style={{ height: "100%", minHeight: "100%", overflowY: "scroll" }}
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
