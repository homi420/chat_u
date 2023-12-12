const mongoose = require("mongoose");
let isConnected = false;
const mongoUri = process.env.MONGO_URI;
const connectToDb = async () => {
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
module.exports = connectToDb;
