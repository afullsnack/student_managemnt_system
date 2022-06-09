import mongoose from "mongoose";
import { connectDB } from "../lib/db";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let Course;
try {
  const db = connectDB();
  const CourseSchema = new Schema({
    title: { type: String, required: [true, "Please enter the course title"] },
    code: {
      type: String,
      unique: true,
      required: [true, "Please enter the course code"],
    },
    ccu: { type: String, required: [true, "Add the course credit unit"] },
    level: { type: String, required: [true, "A study level is required"] },

    semester: {
      type: String,
    },
  });
  Course = mongoose.model("Course", CourseSchema);
} catch (err) {
  console.log(err.message || err.toString());
}

export default Course;
