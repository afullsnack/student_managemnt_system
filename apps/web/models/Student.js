import mongoose from "mongoose";
import { connectDB } from "../lib/db";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let Student;

try {
  connectDB();
  const StudentSchema = new Schema({
    matric_no: { type: String, required: [true, "Your matric no is required"] },
    firstname: { type: String, required: [true, "Please add first name"] },
    lastname: { type: String, required: [true, "Please add last name"] },
    currentLevel: {
      type: String,
      required: [true, "Add a study level"],
    },
    semester: {
      type: String,
      required: [true, "Add a study semester"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter a unique email address"],
    },
    phone: { type: String, required: true },
    courses: { type: String, required: false },
    faculty: { type: String, required: false },
    department: { type: String, required: false },
    programme: {
      type: String,
      enum: ["B.Sc", "M.Sc", "B.Eng", "Diploma"],
      default: "B.Sc",
    },
    country: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
  });
  Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);
} catch (err) {
  console.log(err.message || err.toString());
}

export default Student;
