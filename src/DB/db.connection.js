import mongoose from "mongoose";

export const DBConnect = async () => {
  try {    
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error(error);
  }
};
