import { withSession } from "next-session";
import { sessionOptions } from "../../lib/config";
import Student from "../../models/Student";
import { connectDB } from "../../lib/db";
connectDB();
// const MongoStore = require("connect-mongo")(expressSession);
// var MongoDBStore = require("connect-mongodb-session")(expressSession);

// var store = new MongoDBStore({
//   uri: process.env.MONGODB_URI,
//   databaseName: process.env.MONGODB_DB,
//   collection: "mySessions",
// });

const handler = async (req, res) => {
  try {
    // const db = await connectToDatabase();
    if (req.method !== "POST")
      return res.json({ error: "Wrong http method used, use POST method" });

    // get req body data
    const {
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
    } = JSON.parse(req.body);

    // return the logged in user detail in the database
    let result = await Student({
      matric_no: matricNo,
      firstname,
      lastname,
      currentLevel: level,
      semester,
      email,
      phone,
      faculty,
      department,
      programme,
      country,
      state,
      lga,
    });
    result.save((err, res) => {
      err && console.log(err);
      res && console.log("Save result", res);
    });
    console.log("result", result);
    const student = JSON.parse(JSON.stringify(result));
    console.log("Student return", student);
    student
      ? res.json({ data: { student, message: "Student updated" } })
      : res.json({ data: { message: "Something went wrong" } });
  } catch (err) {
    console.log(err.message || err.toString());
    res.json({ error: err.message || err.toString() });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default handler;
// export default withSession(handler, sessionOptions);
