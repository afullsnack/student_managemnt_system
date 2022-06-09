
import { useRouter } from "next/router";
import { useState } from "react";
import { Menu } from "ui";

export default function Navigation() {
  const router = useRouter();
  const [url, setUrl] = useState(router.asPath);
  return (
    <Menu
      mode="vertical"
      theme="dark"
      defaultSelectedKeys={["/dashboard"]}
      selectedKeys={[url]}
      onSelect={({ item, key, selected }) => {
        // console.info(item, key, selected);
        setUrl(key);
        router.push(key);
      }}
    >
      <Menu.Item key="/dashboard">Dashboard</Menu.Item>
      <Menu.Item key="/students">Student Data</Menu.Item>
      <Menu.Item key="/courses">Manage Marks and attendance</Menu.Item>
      {/* <Menu.Item key="/classes">Classes</Menu.Item> */}
      <Menu.Item key="/semester_pred">Semester Predictions</Menu.Item>
      <Menu.Item key="/category_pred">category Predictions</Menu.Item>
      {/* <Menu.Item key="/grading">Grading Info</Menu.Item> */}
    </Menu>
  );
}
