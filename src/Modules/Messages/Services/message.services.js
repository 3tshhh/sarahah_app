import { Message } from "../../../DB/Models/index.js";
import {User} from "../../../DB/Models/index.js";

export const sendMessageService = async (req, res) => {
  const { content } = req.body;
  const { receiverId } = req.params;
  

  const user = await User.findById(receiverId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const message = new Message({
    content,
    receiverId,
  });
  await message.save();

  return res.status(201).json({ message: "message sent", data: message });
};

export const getMessagesService = async (req, res) => {
  const {_id } = req.user;
  const messages = await Message.find({
    receiverId: _id,
  }).populate([{
    path:'receiverId',
    select:'firstName lastName',
  }]
  )
  return res
    .status(200)
    .json({ message: "messages retrieved", messages });
};


export const makeMessagePublicService = async (req, res, next) => {
  const { messageId } = req.params;
  const { _id } = req.user;

  const message = await Message.findOne({ _id: messageId, receiverId: _id });
  if (!message) {
    return next(new Error("Message not found"));
  }
  message.isPublic = true;
  await message.save();
  res.status(200).json({ message: "Message is now public", message });
};

export const makeMessagePrivateService = async (req, res, next) => {
  const { messageId } = req.params;
  const { _id } = req.user;

  const message = await Message.findOne({ _id: messageId, receiverId: _id });
  if (!message) {
    return next(new Error("Message not found"));
  }
  message.isPublic = false;
  await message.save();
  res.status(200).json({ message: "Message is now private", message });
}

export const getPublicMessagesService = async (req, res, next) => {
  const messages = await Message.find({ isPublic: true });
  res.status(200).json({ message: "Public messages retrieved", messages });
}