import mongoose from "mongoose";
// require('dotenv').config();

export async function connectDB() {
  // try {
  // let connection = {};
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.log(err);
  });

  db.once("open", () => {
    console.log("DB Connected");
  });

  // if (connection.isConnected) return;
  // connection.isConnected =
  // let Notes = db.collection("notes");
  // console.log(connection.isConnected);
  // console.table(db);
  // console.log(db.models);
  return db;
  // } catch (err) {
  //   console.log(err.message || err.toString());
  // }
}
