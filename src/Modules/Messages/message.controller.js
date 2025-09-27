import { Router } from "express";
import * as services from "./Services/message.services.js";

const messageRouter = Router();

messageRouter.post("/send-message/:receiverId", services.sendMessageService);
messageRouter.get('/',services.getMessagesService)

export default messageRouter;
