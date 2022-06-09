// import Button from "ui/button";
import withLayout from "components/globalLayout.js";
import { applySession } from "next-session";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Col, Form, Input, Popconfirm, Row, Select, Table } from "ui";
import { sessionOptions } from "../lib/config";
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
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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

class EditableTableAtt extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        editable: true,
      },
      {
        title: "Course",
        dataIndex: "course",
        width: "50%",
        editable: true,
      },
      {
        title: "Semester",
        dataIndex: "semester",
        width: "10%",
        editable: true,
      },
      {
        title: "Attended",
        dataIndex: "attended",
        width: "5%",
        editable: true,
      },
      {
        title: "Total Lectures",
        dataIndex: "total",
        width: "5%",
        editable: true,
      },
      {
        title: "Action",
        dataIndex: "action",
        width: "10%",
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>Remove</a>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state =
      props.courses != null
        ? {
            dataSource: [
              props?.courses?.map((course, i) => {
                return {
                  key: i.toString(),
                  name: course?.code,
                  title: course?.title,
                  unit: course?.ccu,
                };
              }),
            ],
            count: 5,
          }
        : {
            dataSource: [
              {
                key: "0",
                name: "Student name",
                course: "Elementary Mathematics (Algebra and Trigonometry)",
                semester: "1s(Spring)",
                attended: "23",
                total: "28",
              },
              {
                key: "1",
                name: "Student name",
                course: "Elementary Physics",
                semester: "1s(Spring)",
                attended: "12",
                total: "28",
              },
              {
                key: "3",
                name: "Student name",
                course: "Research Methodology",
                semester: "1s(Spring)",
                attended: "21",
                total: "32",
              },
            ],
            count: 3,
          };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Student name`,
      course: "Course title",
      semester: `1st(Spring)`,
      attended: `1`,
      total: `12`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
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
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
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

        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

// Marks table
class EditableTableMarks extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        editable: true,
      },
      {
        title: "Course",
        dataIndex: "course",
        width: "50%",
        editable: true,
      },
      {
        title: "Semester",
        dataIndex: "semester",
        width: "10%",
        editable: true,
      },
      {
        title: "Marks",
        dataIndex: "marks",
        width: "5%",
        editable: true,
      },
      {
        title: "Total Marks",
        dataIndex: "total",
        width: "5%",
        editable: true,
      },
      {
        title: "Action",
        dataIndex: "action",
        width: "10%",
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>Remove</a>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state =
      props.courses != null
        ? {
            dataSource: [
              props?.courses?.map((course, i) => {
                return {
                  key: i.toString(),
                  name: course?.code,
                  title: course?.title,
                  unit: course?.ccu,
                };
              }),
            ],
            count: 5,
          }
        : {
            dataSource: [
              {
                key: "0",
                name: "Student name",
                course: "Elementary Mathematics (Algebra and Trigonometry)",
                semester: "1s(Spring)",
                marks: "32",
                total: "60",
              },
              {
                key: "1",
                name: "Student name",
                course: "Elementary Physics",
                semester: "1s(Spring)",
                marks: "21",
                total: "60",
              },
              {
                key: "3",
                name: "Student name",
                course: "Research Methodology",
                semester: "1s(Spring)",
                marks: "43",
                total: "60",
              },
            ],
            count: 3,
          };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Student name`,
      course: "Course title",
      semester: `1st(Spring)`,
      marks: `0`,
      total: `60`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
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
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
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

        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

function Courses({ user, status, courses }) {
  console.log("user session", user);
  console.log("Student status", status);
  status = user != null || user != undefined ? JSON.parse(status) : null;
  user = user != null || user != undefined ? JSON.parse(user) : null;
  courses =
    courses != null || courses != undefined ? JSON.parse(courses) : null;
  console.log("Courses", courses);
  return (
    <>
      <Row gutter={8} style={{ margin: 0, padding: 0, width: "100%" }}>
        <Col span={24}>
          <h1>Manage Attendance and Marks</h1>
        </Col>
        <Col span={24}>
          <h2>Attendance</h2>
          {status == "no_data" ? (
            <p>
              You need to add your student info before you can add courses. Go
              to <a href="/students">Student Info</a>
            </p>
          ) : (
            <EditableTableAtt courses={courses} />
          )}
        </Col>
        <Col span={24}>
          <h2>Marks (Both Test and Exams Total)</h2>
          {status == "no_data" ? (
            <p>
              You need to add your student info before you can add courses. Go
              to <a href="/students">Student Info</a>
            </p>
          ) : (
            <EditableTableMarks courses={courses} />
          )}
        </Col>
      </Row>
    </>
  );
}

export default withLayout(Courses);

export async function getServerSideProps({ req, res }) {
  try {
    await applySession(req, res, sessionOptions);
    console.log("USER SESSION from server side props", req?.session?.user);
    let user = JSON.stringify(req?.session?.user);
    var courses;

    // check is the student has set their data and that it matches their account
    let studentCount = await Student.count();
    const getStatus = async () => {
      if (studentCount <= 0 || studentCount == null) {
        return "no_data";
      } else {
        var data = await Student.findOne({ email: req?.session?.user?.email });
        courses = await Course.find({
          level: data?.currentLevel,
          semester: data?.semester,
        });
        return data != null ? "yes_data" : "no_data";
      }
    };
    let status = await getStatus();
    console.log(status);
    status = JSON.stringify(status);
    courses = courses ? JSON.stringify(courses) : null;

    // if (!user) return { props: {} };
    return {
      props: { user, status, courses },
    };
  } catch (e) {
    return {
      props: {},
    };
  }
}
