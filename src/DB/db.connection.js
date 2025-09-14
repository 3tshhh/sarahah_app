import mongoose from "mongoose";

export const DBConnect = async () => {
  try {    
    await mongoose.connect("mongodb://127.0.0.1:27017/SarahahApp?authSource=admin");
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error(error);
  }
};
