import mongoose from "mongoose";
import { connectDB } from "../lib/db";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let Lecturer;
try {
  const db = connectDB();
  const LecturerSchema = new Schema({
    name: { type: String },
    staff_type: {
      type: String,
      enum: ["permanent", "non-permanent", "teaching"],
      default: "permanent",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Adde lecturer email address"],
    },
  });
  Course = mongoose.model("Lecturer", LecturerSchema);
} catch (err) {
  console.log(err.message || err.toString());
}

export default Lecturer;
