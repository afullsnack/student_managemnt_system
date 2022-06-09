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

function Students({ user, student }) {
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

  class EditableTable extends React.Component {
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
          title: "Email",
          dataIndex: "email",
          width: "20%",
          editable: true,
        },
        {
          title: "Matric No.",
          dataIndex: "matric",
          width: "20%",
          editable: true,
        },
        {
          title: "Semester",
          dataIndex: "semester",
          width: "10%",
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
                  email: "student@hillcityuniversity.org",
                  matric: "1232/1344/4444",
                  semester: "1s(Spring)",
                },
                {
                  key: "1",
                  name: "Student name 2",
                  email: "student@hillcityuniversity.org",
                  matric: "1232/1344/9999",
                  semester: "1s(Spring)",
                },
                {
                  key: "3",
                  name: "Student name 3",
                  email: "student@hillcityuniversity.org",
                  matric: "1232/1344/0000",
                  semester: "1s(Spring)",
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
        name: `Enter name`,
        email: "Enter email",
        matric: `Enter matric`,
        semester: `1st(Spring)`,
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
          <Button onClick={this.handleAdd}>Add Student</Button>

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
          <EditableTable courses={null} />
        </Col>

        <Col span={24}>
          <Button
            onClick={async (e) => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
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

    let student = session?.user
      ? await Student.findOne({ email: session?.user?.email })
      : null;
    console.log(student, "student");

    let user = JSON.stringify(session.user);
    student = JSON.stringify(student);

    // if (!req?.session?.user) return { props: {} };
    return {
      props: { user, student },
    };
  } catch (e) {
    return {
      props: {},
    };
  }
}

// export const getServerSideProps = withSession(async function ({ req, res }) {
//   // Get the user's session based on the request
//   const user = req.session.get("user");

//   let student = user ? await Student.findOne({ email: user?.email }) : null;
//   console.log(student, "student");

//   // if (!user) {
//   //   return {
//   //     redirect: {
//   //       destination: "/login",
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   return {
//     props: { user },
//   };
// });
