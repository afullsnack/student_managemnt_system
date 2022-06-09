import "isomorphic-fetch";
import { url } from "./config";

// login user api call
export const login = async ({ username, password }) => {
  const { data, error } = await fetch(`${url}/api/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }).then((res) => res.json());

  console.assert(data == null, error);
  // console.assert(data.message == null, data.message);
  console.log("Data:", data);

  // return array with data as first if no error
  if (data?.message !== null) return [data, null];
  return [null, error];
};

// creates new users account api call
export const createAccount = async ({
  firstname,
  lastname,
  username,
  email,
  password,
}) => {
  // console.log("data", firstname, lastname, username, email, password);
  const { data, error } = await fetch(`${url}/api/signup`, {
    method: "POST",
    body: JSON.stringify({ firstname, lastname, username, email, password }),
  }).then((res) => res.json());

  console.assert(data == null, error);
  // console.assert(data?.message == null, data.message);
  /*
   *  return an array with data as
   *  first item if data and null as second
   */
  if (data?.message !== null) return [data, null];
  return [null, error];
};

export const updateStudentData = async ({
  matricNo,
  firstname,
  lastname,
  level,
  semester,
  email,
  phone,
  faculty,
  department,
  country,
  state,
  lga,
  programme,
}) => {
  const { data, error } = await fetch(`${url}/api/update`, {
    method: "POST",
    body: JSON.stringify({
      matricNo,
      firstname,
      lastname,
      level,
      semester,
      email,
      phone,
      faculty,
      department,
      country,
      state,
      lga,
      programme,
    }),
  }).then((res) => res.json());

  console.assert(data == null, error);
  // console.assert(data?.message == null, data.message);
  /*
   *  return an array with data as
   *  first item if data and null as second
   */
  if (data?.message !== null) return [data, null];
  return [null, error];
};

export const logout = () => {};
