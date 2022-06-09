import mongoose from "mongoose";
import { connectDB } from "../lib/db";
let User;
try {
  connectDB();
  const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: [true, "Please add first name"] },
    lastname: { type: String, required: [true, "Please add last name"] },
    username: { type: String, required: [true, "Please add a username"] },
    password: { type: String, required: [true, "Please add a password"] },
    email: {
      type: String,
      required: [true, "Please add a valid email account"],
    },
    isAdmin: { type: Boolean, default: false },
  });
  User = mongoose.models.User || mongoose.model("User", UserSchema);
} catch (err) {
  console.log(err.message || err.toString());
}

export default User;
