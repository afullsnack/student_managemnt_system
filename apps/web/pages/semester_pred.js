// import {
//   ArrowRightOutlined,
//   DatabaseOutlined,
//   OrderedListOutlined,
//   SnippetsOutlined,
// } from "@ant-design/icons";
// import { applySession } from "next-session";
import { getSession } from "next-auth/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Select } from "ui";
import withLayout from "../components/globalLayout";
import Course from "../models/Course";
import Student from "../models/Student";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const { Option } = Select;
function SemesterPred({ students, courses }) {
  const router = useRouter();
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [semester, setSemester] = useState("3");

  // Chart data
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(async () => {
    // Set initial student data
    setStudentList(students);
    setSelectedStudent(students[0]);
  }, [courses, students]);

  useEffect(() => {
    // Chart data load
    setOptions({
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: courses?.map((elem) => {
          if (elem?.students.some((val) => val === selectedStudent?._id))
            return elem?.code;
        }),
      },
    });
    setSeries([
      {
        name: "Mark",
        data: courses.map((elem) => {
          if (elem?.students.some((val) => val === selectedStudent?._id))
            return elem?.marks?.map((mark) => {
              if (mark?.student === selectedStudent?._id) return mark?.score;
            })[0];
        }),
      },
      {
        name: "Attendance",
        data: courses.map((elem) => {
          if (elem?.students.some((val) => val === selectedStudent?._id))
            return elem?.attendance?.map((attend) => {
              if (attend?.student === selectedStudent?._id)
                return attend?.score;
            })[0];
        }),
      },
    ]);
  }, [selectedStudent, courses]);

  return (
    <>
      <Row gutter={[8, 8]} style={{ marign: 0, padding: 0, width: "100%" }}>
        <Col span={24}>
          <h1>Predictions for a Semester</h1>
        </Col>
        <Col span={12}>
          <h1>Students</h1>
          <Select
            style={{ width: "100%", marginBottom: 20 }}
            defaultActiveFirstOption={true}
            value={selectedStudent?._id}
            onChange={(value) => {
              studentList.map((stud) => {
                if (stud?._id === value) setSelectedStudent(stud);
                return;
              });
            }}
            placeholder="Students to pick from"
          >
            {studentList?.map((stud) => (
              <Option key={stud?._id} value={stud?._id}>
                {stud?.firstname} {stud?.lastname}
              </Option>
            ))}
            {/* <Option key="2">Student name 2</Option>
          <Option key="3">Student name 3</Option>
          <Option key="4">Student name 4</Option> */}
          </Select>
        </Col>
        <Col span={12}>
          <h1>Semester</h1>
          <Select
            style={{ width: "100%", marginBottom: 20 }}
            defaultActiveFirstOption={true}
            value={semester}
            onChange={(value) => {
              setSemester(value);
            }}
          >
            <Option key="1">1st (Spring)</Option>
            <Option key="2">2nd (Winter)</Option>
            <Option key="3">3rd (Fall)</Option>
          </Select>
        </Col>
        <Col span={24}>
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
      </Row>
    </>
  );
}

export default withLayout(SemesterPred);

export async function getServerSideProps(ctx) {
  try {
    const session = await getSession(ctx);
    console.log("USER SESSION from server side props", session);
    const { user } = session;

    // check is the student has set their data and that it matches their account
    const studentCount = await Student.count();
    console.log(studentCount);

    const students = await Student.find({}).populate("courses").exec();
    const courses = await Course.find({}).populate().exec();
    console.log(students, courses, "students logs");

    return {
      props: {
        user,
        students: JSON.parse(JSON.stringify(students)),
        courses: JSON.parse(JSON.stringify(courses)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
}
