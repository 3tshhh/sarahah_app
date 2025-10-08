import "./config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { DBConnect } from "./DB/db.connection.js";
import * as controllers from "./Modules/controller.index.js";
import { corsOptions } from "./Utils/index.js";
import { errorMiddleware, limiter } from "./Middlewares/index.js";
import "./Cron-jobs/index.js";

const app = express();
DBConnect();

app.use(express.json());

app.use(cors(corsOptions));
app.use(helmet());
// app.use(limiter);

app.use("/message", controllers.messageRouter);
app.use("/users", controllers.userRouter, controllers.authRouter);

app.use("/", (req, res) => {
  //log the request url
  console.log(`Request URL: ${req.url}`);
  res.send("Congratulations! Your server is running successfully.");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// git add . && git commit -m "test resetPassword" && git push origin