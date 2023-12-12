import { configDotenv } from "dotenv";
import mongoose from "mongoose";
let isConnected = false;
// require("dotenv").config();
configDotenv();
const mongoUri = process.env.MONGO_URI;

export const connectToDb = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("Mongodb already connected!");
    return;
  } else {
    try {
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log("connected to the db");
    } catch (error) {
      console.log(error);
    }
  }
};
