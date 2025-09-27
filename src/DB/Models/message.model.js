import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Message = mongoose.model("Message", MessageSchema);
