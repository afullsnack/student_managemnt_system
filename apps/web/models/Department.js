import mongoose from "mongoose";
import { connectDB } from "../lib/db";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let Department;
try {
  connectDB();
  const DepartmentSchema = new Schema({
    name: { type: String, require: [true, "A department name is required"] },
    hod: {
      title: { type: String },
      name: { type: String },
    },
    faculty: { type: ObjectId, ref: "Faculty" },
  });
  Department =
    mongoose.models.Department ||
    mongoose.model("Department", DepartmentSchema);
} catch (err) {
  console.log(err.message || err.toString());
}

export default Department;
