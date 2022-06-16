// import { applySession, withSession } from "next-session";
import { getSession } from "next-auth/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Col, Form, Input, Popconfirm, Row, Select, Table } from "ui";
import withLayout from "../components/globalLayout";
import Student from "../models/Student";

const { Option } = Select;

function Students({ user, students }) {
  console.log(user, students, "Data log in students page");
  const [studentDataSource, setStudentDataSource] = useState([]);

  useEffect(() => {
    setStudentDataSource(students);
    return () => {
      setStudentDataSource([]);
    };
  }, [user, students]);

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

  function EditableTable({ students }) {
    let columns = [
      {
        title: "First Name",
        dataIndex: "firstname",
        key: "firstname",
        width: "20%",
        editable: true,
      },
      {
        title: "Last Name",
        dataIndex: "lastname",
        key: "lastname",
        width: "20%",
        editable: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "20%",
        editable: true,
      },
      {
        title: "Matric No.",
        dataIndex: "matric_no",
        key: "matric_no",
        width: "20%",
        editable: true,
      },
      {
        title: "Semester",
        dataIndex: "semester",
        key: "semester",
        width: "10%",
        editable: true,
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: "10%",
        render: (_, record) =>
          dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>Remove</a>
            </Popconfirm>
          ) : null,
      },
    ];
    console.log(students, "Props log");
    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(5);

    useEffect(() => {
      setDataSource(
        students?.map((student, i) => {
          return {
            key: i.toString(),
            firstname: student?.firstname,
            lastname: student?.lastname,
            email: student?.email,
            matric_no: student?.matric_no,
            semester: student?.semester,
          };
        })
      );
    }, [students]);

    const handleDelete = (key) => {
      // const dataSource = [...dataSource];
      setDataSource(dataSource.filter((item) => item.key !== key));
    };
    const handleAdd = () => {
      // const { count, dataSource } = this.state;
      const newData = {
        key: count,
        firstname: `Enter first name`,
        lastname: `Enter last name`,
        email: "Enter email",
        matric_no: `Enter matric no.`,
        semester: `1st(Spring)`,
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
          key: col.key,
          title: col.title,
          handleSave: handleSave,
        }),
      };
    });
    return (
      <div>
        <Button onClick={handleAdd}>Add Student</Button>

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
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ margin: 0, padding: 0, width: "100%", height: "100%" }}
      >
        <Col span={24}>
          <h1>Add Students</h1>
        </Col>
        <Col span={24}>
          <EditableTable students={studentDataSource} />
        </Col>

        <Col span={24}>
          <Button
            onClick={async (e) => {
              setLoading(true);
            }}
            loading={loading}
            type="link"
            size="large"
            block
            style={{ backgroundColor: "#40a9ff", color: "#FFF" }}
          >
            Update
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default withLayout(Students);

export async function getServerSideProps(ctx) {
  try {
    // await applySession(req, res, sessionOptions);
    const session = await getSession(ctx);
    console.log("USER SESSION from server side props", session);

    const { user } = session;
    const students = await Student.find({});
    console.log(students, "students logs");

    // if (!req?.session?.user) return { props: {} };
    return {
      props: { user, students: JSON.parse(JSON.stringify(students)) },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
}
