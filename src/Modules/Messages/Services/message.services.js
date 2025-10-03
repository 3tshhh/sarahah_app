import { Message } from "../../../DB/Models/index.js";
import {User} from "../../../DB/Models/index.js";

export const sendMessageService = async (req, res) => {
  const { content } = req.body;
  const { receiverId } = req.params;
  // console.log(receiverId);
  

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
  // console.log(_id);
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
