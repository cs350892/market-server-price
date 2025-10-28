import mongoose from "mongoose";
import { config } from "./index.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });
    mongoose.connection.on("error", (err) => {
      console.error(`Error in connecting to database. ${err}`);
    });
    await mongoose.connect(config.mongoUri);
  } catch (error) {
    console.error("Failed to connect to database.", error);
    process.exit(1);
  }
};

export default connectDB;