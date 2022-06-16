// import Button from "ui/button";
import { getSession } from "next-auth/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Col, Form, Input, message, Popconfirm, Row, Select, Table } from "ui";
import withLayout from "../components/globalLayout";
import Course from "../models/Course";
import Student from "../models/Student";

// import { connectDB } from "../lib/db";
// connectDB();

// import React, { , useState,  } from "react";
// import { Table, Input, Button, Popconfirm, Form } from 'antd';

const { Option } = Select;
const EditableContext = createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input size="small" ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

function EditableTableAtt({ courses, students }) {
  // console.log(courses, students, "Data");
  let columns = [
    {
      title: "Code",
      dataIndex: "code",
      width: "20%",
      editable: false,
    },
    {
      title: "Course",
      dataIndex: "course",
      width: "50%",
      editable: false,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      width: "10%",
      editable: false,
    },
    {
      title: "Attended",
      dataIndex: "attended",
      width: "5%",
      editable: true,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "5%",
      editable: false,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "10%",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to update?"
            onConfirm={() => handleUpdate(record.key, record)}
          >
            <a>Update</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      code: "MTH101",
      course: "Elementary Mathematics (Algebra and Trigonometry)",
      semester: "1s(Spring)",
      attended: "23",
      total: "10",
    },
    {
      key: "1",
      code: "PHY101",
      course: "Elementary Physics",
      semester: "1s(Spring)",
      attended: "12",
      total: "10",
    },
    {
      key: "3",
      code: "RSM101",
      course: "Research Methodology",
      semester: "1s(Spring)",
      attended: "21",
      total: "10",
    },
  ]);
  const [count, setCount] = useState(0);
  const [level, setLevel] = useState("100");
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});

  useEffect(async () => {
    // Set initial student data
    const getInitialStudentData = async () => {
      return await Promise.all(
        students.filter((stud) => stud?.currentLevel === level)
      );
    };
    setStudentList(students.filter((stud) => stud?.currentLevel === level));
    setSelectedStudent(
      students.filter((stud) => stud?.currentLevel === level)[0]
    );

    console.log(
      students.filter((stud) => stud?.currentLevel === level),
      "Student"
    );
  }, [courses, students]);
  // DataSource effect
  useEffect(() => {
    if (courses?.length)
      setDataSource(
        courses?.map((course, i) => {
          if (course?.students.some((id) => id === studentList[0]?._id))
            return {
              key: i.toString(),
              code: course?.code,
              course: course?.title,
              semester: course?.semester,
              attended: course?.attendance[0]?.score.toString(),
              total: "10",
            };
        })
      );
    setCount(5);
  }, [studentList, level]);

  const handleUpdate = async (key, record) => {
    message.info(key);
    console.log(record, "Record");
    return;
    // const dataSource = [...dataSource];
    // setDataSource(dataSource.filter((item) => item.key !== key));
    // TODO: Update score to db
    // const udpateDB = await Course.updateOne(
    //   { code: record?.code },
    //   { $set: { "attendance.$[e].score": Number(record?.attended) } },
    //   { arrayFilters: [{ "e.student": selectedStudent?._id }] }
    // );
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Student name`,
      course: "Course title",
      semester: `1st(Spring)`,
      attended: `1`,
      total: `12`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <h1>Level</h1>
        <Select
          style={{ width: "100%", marginBottom: 20 }}
          defaultActiveFirstOption={true}
          defaultValue={level}
          placeholder="Students Levels"
          onChange={async (value) => {
            setLevel(value);
            setStudentList(
              students.filter((stud) => stud?.currentLevel === value)
            );
            setSelectedStudent(
              students.filter((stud) => stud?.currentLevel === value)[0]
            );
          }}
        >
          <Option key="100" value="100">
            100
          </Option>
          <Option key="200" value="200">
            200
          </Option>
          <Option key="300" value="300">
            300
          </Option>
          <Option key="400" value="400">
            400
          </Option>
        </Select>
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
            setDataSource(
              courses?.map((course, i) => {
                if (course?.students.some((id) => id === value))
                  return {
                    key: i.toString(),
                    code: course?.code,
                    course: course?.title,
                    semester: course?.semester,
                    attended: course?.attendance[0]?.score.toString(),
                    total: "10",
                  };
              })
            );
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

      <Col span={24}>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </Col>
    </Row>
  );
}

// Marks table
function EditableTableMarks({ courses, students }) {
  let columns = [
    {
      title: "Code",
      dataIndex: "code",
      width: "20%",
      editable: false,
    },
    {
      title: "Course",
      dataIndex: "course",
      width: "50%",
      editable: false,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      width: "10%",
      editable: false,
    },
    {
      title: "Mark",
      dataIndex: "mark",
      width: "5%",
      editable: true,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "5%",
      editable: false,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "10%",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleUpdate(record.key, record)}
          >
            <a>Update</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      code: "MTH101",
      course: "Elementary Mathematics (Algebra and Trigonometry)",
      semester: "1s(Spring)",
      mark: "23",
      total: "60",
    },
    {
      key: "1",
      code: "PHY101",
      course: "Elementary Physics",
      semester: "1s(Spring)",
      mark: "12",
      total: "60",
    },
    {
      key: "3",
      code: "RSM101",
      course: "Research Methodology",
      semester: "1s(Spring)",
      mark: "21",
      total: "60",
    },
  ]);
  const [count, setCount] = useState(0);
  const [level, setLevel] = useState("100");
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});

  useEffect(async () => {
    // Set initial student data
    const getInitialStudentData = async () => {
      return await Promise.all(
        students.filter((stud) => stud?.currentLevel === level)
      );
    };
    setStudentList(students.filter((stud) => stud?.currentLevel === level));
    setSelectedStudent(
      students.filter((stud) => stud?.currentLevel === level)[0]
    );

    console.log(
      students.filter((stud) => stud?.currentLevel === level),
      "Student"
    );
  }, [courses, students]);
  // DataSource effect
  useEffect(() => {
    if (courses?.length)
      setDataSource(
        courses?.map((course, i) => {
          if (course?.students.some((id) => id === studentList[0]?._id))
            return {
              key: i.toString(),
              code: course?.code,
              course: course?.title,
              semester: course?.semester,
              mark: course?.marks[0]?.score.toString(),
              total: "60",
            };
        })
      );
    setCount(5);
  }, [studentList, level]);

  const handleUpdate = (key, record) => {
    message.info(key);
    // const dataSource = [...dataSource];
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Student name`,
      course: "Course title",
      semester: `1st(Spring)`,
      attended: `1`,
      total: `12`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <h1>Level</h1>
        <Select
          style={{ width: "100%", marginBottom: 20 }}
          defaultActiveFirstOption={true}
          defaultValue={level}
          placeholder="Students Levels"
          onChange={async (value) => {
            setLevel(value);
            setStudentList(
              students.filter((stud) => stud?.currentLevel === value)
            );
            setSelectedStudent(
              students.filter((stud) => stud?.currentLevel === value)[0]
            );
          }}
        >
          <Option key="100" value="100">
            100
          </Option>
          <Option key="200" value="200">
            200
          </Option>
          <Option key="300" value="300">
            300
          </Option>
          <Option key="400" value="400">
            400
          </Option>
        </Select>
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
            setDataSource(
              courses?.map((course, i) => {
                if (course?.students.some((id) => id === value))
                  return {
                    key: i.toString(),
                    code: course?.code,
                    course: course?.title,
                    semester: course?.semester,
                    attended: course?.marks[0]?.score.toString(),
                    total: "60",
                  };
              })
            );
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

      <Col span={24}>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </Col>
    </Row>
  );
}

function Courses({ user, students, courses }) {
  return (
    <>
      <Row gutter={[8, 32]} style={{ margin: 0, padding: 0, width: "100%" }}>
        <Col span={24}>
          <h1>Manage Attendance and Marks</h1>
        </Col>
        <Col span={24}>
          <h2>Attendance</h2>
          <EditableTableAtt courses={courses} students={students} />
        </Col>
        <Col span={24}>
          <h2>Marks (Both Test and Exams Total)</h2>
          <EditableTableMarks courses={courses} students={students} />
        </Col>
      </Row>
    </>
  );
}

export default withLayout(Courses);

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
