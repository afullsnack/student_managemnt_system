// import Head from "next/head";
import { signIn, useSession } from "next-auth/client";
import { applySession } from "next-session";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Card, Col, Input, message, Row } from "ui";
import { sessionOptions, url } from "../lib/config";
import { createAccount } from "../lib/user";
import styles from "../styles/Home.module.css";
// import withLayout from "components/globalLayout.js";

function Home() {
  // connectDB();
  const [hasAccount, setHasAccount] = useState(true);
  const [session, loading] = useSession();
  return (
    <Row
      gutter={8}
      style={{ margin: 0, paddingTop: 150 }}
      className={styles.myrow}
    >
      <Col
        xxs={{ span: 0 }}
        xs={{ span: 0 }}
        sm={{ span: 3 }}
        lg={{ span: 6 }}
      ></Col>
      <Col
        xxs={{ span: 24 }}
        xs={{ span: 24 }}
        sm={{ span: 18 }}
        lg={{ span: 12 }}
      >
        <Card hoverable>
          {hasAccount && <LoginView />}
          {!hasAccount && <CreateAccountView />}
          {hasAccount && (
            <span style={{ fontSize: 12, marginTop: 20 }}>
              Don't have an account?
            </span>
          )}
          {!hasAccount && (
            <span style={{ fontSize: 12, marginTop: 20 }}>
              Already have an account?
            </span>
          )}
          <Button
            type="link"
            size="small"
            onClick={() => setHasAccount(!hasAccount)}
          >
            {hasAccount ? "create account" : "Login"}
          </Button>
        </Card>
      </Col>
      <Col
        xxs={{ span: 0 }}
        xs={{ span: 0 }}
        sm={{ span: 3 }}
        lg={{ span: 6 }}
      ></Col>
    </Row>
  );
}

function LoginView() {
  const router = useRouter();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Input
        type="text"
        placeholder="Username/Email"
        style={{ marginBottom: 20 }}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        style={{ marginBottom: 20 }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={async () => {
          setLoading(true);
          if (
            username == "" ||
            password == "" ||
            username == null ||
            password == null
          ) {
            console.assert(username, password, "Input the values correctly");
            message.error("Username and Password fields are required");
            return;
          }
          // submitLogin
          // const [data, error] = await login({ username, password });
          const data = await signIn("credentials", {
            username,
            password,
            callbackUrl: `${url}/dashboard`,
          });
          setLoading(false);
          console.log(data, "Data from next-auth credential login");
          // data !== null && console.log(data);
          // error !== null && console.error(error);
          // // console.log("User details: ", user);
          // data?.message == "No such users" || error
          //   ? message.warn("The login credentials don't exist try signing up")
          //   : router.push("/dashboard");
        }}
      >
        Login
      </Button>
    </>
  );
}

function CreateAccountView() {
  // initialized router
  const router = useRouter();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Row gutter={8}>
        <Col span={12}>
          <Input
            type="text"
            placeholder="First Name"
            style={{ marginBottom: 20 }}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Input
            type="text"
            placeholder="Last Name"
            style={{ marginBottom: 20 }}
            onChange={(e) => setLastname(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <Input
            type="text"
            placeholder="Username"
            style={{ marginBottom: 20 }}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <Input
            type="email"
            placeholder="Email"
            style={{ marginBottom: 20 }}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <Input
            type="password"
            placeholder="Password"
            style={{ marginBottom: 20 }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={async () => {
              setLoading(true);
              // check the values
              if (
                firstname == "undefined" ||
                lastname == "undefined" ||
                username == "undefined" ||
                email == "undefined" ||
                password == "undefined" ||
                firstname == null ||
                lastname == null ||
                username == null ||
                email == null ||
                password == null
              ) {
                console.assert(
                  firstname,
                  lastname,
                  username,
                  email,
                  password,
                  "Values must be set for the inputs"
                );
                message.error("You must enter a value for the inputs");
              }

              const [data, error] = await createAccount({
                firstname,
                lastname,
                username,
                email,
                password,
              });
              setLoading(false);
              data?.user
                ? message.success(data.message, "New user created")
                : message.error(data?.message);
              error !== null && console.error(error);
              // message.success("User created successfully, now login");
              data?.user
                ? router.push("/", "/login")
                : message.error("An error occured try again");
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  await applySession(req, res, sessionOptions);

  console.log(req?.session?.user);
  let user = JSON.stringify(req?.session?.user);

  if (!user) return { props: {} };
  return {
    props: { user },
  };
}

export default Home;
