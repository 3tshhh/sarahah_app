import { Router } from "express";
import * as services from "./Services/message.services.js";
import { authenticateMiddleware } from "../../Middlewares/authentication.middleware.js";

const messageRouter = Router();

messageRouter.post("/send-message/:receiverId", services.sendMessageService);
messageRouter.get("/", authenticateMiddleware ,services.getMessagesService);
messageRouter.put("/make-public/:messageId", authenticateMiddleware ,services.makeMessagePublicService);
messageRouter.put("/make-private/:messageId", authenticateMiddleware ,services.makeMessagePrivateService);
messageRouter.get('/get-public', services.getPublicMessagesService);

export { messageRouter };
