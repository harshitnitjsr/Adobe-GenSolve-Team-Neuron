import mongoose from "mongoose";

export async function connect() {
  console.log(process.env.MONGO_URL);
  try {
    mongoose.connect(process.env.MONGO_URL!);
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    mongoose.connection.off("error", (err) => {
      console.log("mongodb connection error", err);
      process.exit();
    });
  } catch (error) {
    console.log("something went wrong");
    console.log(error);
  }
}
