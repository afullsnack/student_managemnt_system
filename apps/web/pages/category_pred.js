// import {
//   ArrowRightOutlined,
//   DatabaseOutlined,
//   OrderedListOutlined,
//   SnippetsOutlined,
// } from "@ant-design/icons";
import withLayout from "components/globalLayout.js";
// import { applySession } from "next-session";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Col, Row, Select } from "ui";
// import style from "../styles/Home.module.css";

const { Option } = Select;
function CategoryPred() {
  const router = useRouter();
  const [session, loading] = useSession();
  console.log(session, loading, "Session data");

  useEffect(async () => {
    return () => {};
  }, []);

  return (
    <>
      <Row gutter={[8, 8]} style={{ marign: 0, padding: 0, width: "100%" }}>
        <Col span={8}>
          <h1>Predictions for a Category</h1>
        </Col>
        <Col span={24}>
          <h1>Students</h1>
          <Select
            style={{ width: "100%", marginBottom: 20 }}
            defaultActiveFirstOption={true}
            defaultValue="1"
          >
            <Option key="1">Student name</Option>
            <Option key="2">Student name 2</Option>
            <Option key="3">Student name 3</Option>
            <Option key="4">Student name 4</Option>
          </Select>
          <br />
          <h1>Subjects</h1>
          <Select
            style={{ width: "100%", marginBottom: 20 }}
            defaultActiveFirstOption={true}
            defaultValue="1"
          >
            <Option key="1">
              Elementary Mathematics (Algebra and Trigonometry)
            </Option>
            <Option key="2">Elementary Physics</Option>
            <Option key="3">Research Methodology</Option>
          </Select>
        </Col>
      </Row>
    </>
  );
}

export default withLayout(CategoryPred);

// export async function getServerSideProps({ req, res }) {
//   const session = await getSession();
//   console.log("USER SESSION from server side props", session);

//   // let user = JSON.stringify(req?.session?.user);
//   // console.warn(user, "Stringified user");

//   // if (!req?.session?.user) return { props: {} };
//   return {
//     props: { user: session?.user },
//   };
// }
