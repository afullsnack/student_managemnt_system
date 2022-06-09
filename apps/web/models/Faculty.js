import mongoose from "mongoose";
import { connectDB } from "../lib/db";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let Faculty;
try {
  connectDB();
  const FacultySchema = new Schema({
    name: { type: String, require: [true, "A faculty name is required"] },
    dean: {
      title: { type: String },
      name: { type: String },
    },
    departments: { type: [ObjectId], ref: "Department" },
  });
  Faculty = mongoose.model("Faculty", FacultySchema);
} catch (err) {
  console.log(err.message || err.toString());
}

export default Faculty;
