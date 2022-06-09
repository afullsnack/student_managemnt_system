import { UserAddOutlined } from "@ant-design/icons";
import { Button, Card, CardProps } from "antd";
import * as React from "react";
import "./styles.css";

export const MyButton = () => {

  const [number, setNumber] = React.useState(0);
  React.useEffect(() => {
    console.log("Use effect test for react");
  }, [number]);
  return <Button icon={<UserAddOutlined />} size="large" type="primary" onClick={(e) => {
    console.log(e.target, "<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>");
    console.log(number);
    setNumber(num => num + 1);
  }}>Increase Number {number}</Button>;
};

export const _Card = (props: JSX.IntrinsicAttributes & CardProps) => <Card {...props} />