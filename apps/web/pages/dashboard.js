// import { applySession } from "next-session";
import { getSession } from "next-auth/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "ui";
import withLayout from "../components/globalLayout";
import Student from "../models/Student";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function Dashboard({ user, students }) {
  console.log(user, students, "Data log");
  const router = useRouter();
  // const [session, loading] = useSession();
  // console.log(session, loading, "User Session data");
  const [studentDataSource, setStudentDataSource] = useState([]);
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Matric No.",
      dataIndex: "matric_no",
      key: "matric_no",
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
      render: () => (
        <Button
          size="small"
          type="ghost"
          onClick={() => router.push("/students")}
        >
          View
        </Button>
      ),
    },
  ];

  // const GradingCard = React.forwardRef(({ onClick, href }, ref) => {
  //   return (
  //     <a href={href} onClick={onClick} ref={ref}>
  //       <Card title="Grades" extra={<SnippetsOutlined />} hoverable>
  //         <Card.Meta
  //           title="Grading info"
  //           description={
  //             <span className={style.dashboard_primary_span}>
  //               View grading info <ArrowRightOutlined />{" "}
  //             </span>
  //           }
  //         />
  //       </Card>
  //     </a>
  //   );
  // });
  // const CourseCard = React.forwardRef(({ onClick, href }, ref) => {
  //   return (
  //     <a href={href} onClick={onClick} ref={ref}>
  //       <Card title="Courses" extra={<OrderedListOutlined />} hoverable>
  //         <Card.Meta
  //           title="Current Courses"
  //           description={
  //             <span className={style.dashboard_primary_span}>
  //               View current courses <ArrowRightOutlined />{" "}
  //             </span>
  //           }
  //         />
  //       </Card>
  //     </a>
  //   );
  // });
  // const StudentCard = React.forwardRef(({ onClick, href }, ref) => {
  //   return (
  //     <a href={href} onClick={onClick} ref={ref}>
  //       <Card title="My Data" extra={<DatabaseOutlined />} hoverable>
  //         <Card.Meta
  //           title="Edit Data"
  //           description={
  //             <span className={style.dashboard_primary_span}>
  //               Edit student data <ArrowRightOutlined />{" "}
  //             </span>
  //           }
  //         />
  //       </Card>
  //     </a>
  //   );
  // });

  useEffect(() => {
    setStudentDataSource(students);
    setOptions({
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    });
    setSeries([
      {
        name: "MTH101",
        data: [30, 40, 45, 50, 49, 60, 70, 92],
      },
      {
        name: "PHY101",
        data: [60, 10, 45, 90, 49, 15, 70, 92],
      },
    ]);
    return () => {};
  }, [students, user]);

  return (
    <>
      <Row gutter={[8, 8]} style={{ margin: 0, padding: 0, width: "100%" }}>
        <Col span={24} style={{ marginBottom: 20, marginTop: 10 }}>
          <h1>Data Summery</h1>
          <Card>
            <Chart
              options={options}
              series={series}
              type="bar"
              width="100%"
              height="300"
            />
          </Card>
        </Col>

        <Col span={24} style={{ marginBottom: 20, marginTop: 10 }}>
          <h1>List of Students</h1>
          <Table columns={columns} dataSource={studentDataSource} />
        </Col>
      </Row>
    </>
  );
}

export default withLayout(Dashboard);

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  console.log("USER SESSION from server side props", session);

  if (!session) {
    return { props: {} };
  }

  const { user } = session;
  // let user = JSON.stringify(session?.user);
  const students = await Student.find({});
  const studs = JSON.stringify(students);
  console.warn(user, students, "Stringified user");

  return {
    props: { user, students: JSON.parse(JSON.stringify(students)) },
  };
}
