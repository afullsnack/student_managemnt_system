// import { applySession } from "next-session";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  ArrowRightOutlined,
  Card,
  Col,
  DatabaseOutlined,
  OrderedListOutlined,
  Row,
  SnippetsOutlined,
  Table,
} from "ui";
import withLayout from "../components/globalLayout.js";
import style from "../styles/Home.module.css";

function Dashboard() {
  const router = useRouter();
  const [session, loading] = useSession();
  console.log(session, loading, "Session data");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Matric No.",
      dataIndex: "matric",
      key: "matric",
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const GradingCard = React.forwardRef(({ onClick, href }, ref) => {
    return (
      <a href={href} onClick={onClick} ref={ref}>
        <Card title="Grades" extra={<SnippetsOutlined />} hoverable>
          <Card.Meta
            title="Grading info"
            description={
              <span className={style.dashboard_primary_span}>
                View grading info <ArrowRightOutlined />{" "}
              </span>
            }
          />
        </Card>
      </a>
    );
  });
  const CourseCard = React.forwardRef(({ onClick, href }, ref) => {
    return (
      <a href={href} onClick={onClick} ref={ref}>
        <Card title="Courses" extra={<OrderedListOutlined />} hoverable>
          <Card.Meta
            title="Current Courses"
            description={
              <span className={style.dashboard_primary_span}>
                View current courses <ArrowRightOutlined />{" "}
              </span>
            }
          />
        </Card>
      </a>
    );
  });
  const StudentCard = React.forwardRef(({ onClick, href }, ref) => {
    return (
      <a href={href} onClick={onClick} ref={ref}>
        <Card title="My Data" extra={<DatabaseOutlined />} hoverable>
          <Card.Meta
            title="Edit Data"
            description={
              <span className={style.dashboard_primary_span}>
                Edit student data <ArrowRightOutlined />{" "}
              </span>
            }
          />
        </Card>
      </a>
    );
  });

  useEffect(async () => {
    return () => {};
  }, []);

  return (
    <>
      <Row gutter={[8, 8]} style={{ marign: 0, padding: 0, width: "100%" }}>
        <Col span={8}>
          <h1>List of Students</h1>
        </Col>
        <Col span={24}>
          <Table columns={columns} dataSource={[]} />
        </Col>
      </Row>
    </>
  );
}

export default withLayout(Dashboard);

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
