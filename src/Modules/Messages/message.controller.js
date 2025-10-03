import { Router } from "express";
import * as services from "./Services/message.services.js";
import { authenticateMiddleware } from "../../Middlewares/authentication.middleware.js";

const messageRouter = Router();

messageRouter.post("/send-message/:receiverId", services.sendMessageService);
messageRouter.get("/", authenticateMiddleware ,services.getMessagesService);

export { messageRouter };
