import "./config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as DB from "./DB/Connections/index.js";
import * as controllers from "./Modules/controller.index.js";
import { corsOptions, isTokenBlackListed } from "./Utils/index.js";
import {
  authenticateMiddleware,
  errorMiddleware,
  limiter,
} from "./Middlewares/index.js";
import "./Cron-jobs/index.js";

const app = express();
DB.MongoConnect();
DB.redisConnect();
app.use(express.json());

app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);



app.use("/message", controllers.messageRouter);
app.use("/users", controllers.userRouter, controllers.authRouter);

app.use("/", (req, res) => {
  res.send("Congratulations! Your server is running successfully.");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});