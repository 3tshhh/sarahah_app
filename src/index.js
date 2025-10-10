import "./config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as DB from "./DB/Connections/index.js";
import * as controllers from "./Modules/controller.index.js";
import { corsOptions } from "./Utils/index.js";
import {
  errorMiddleware,
} from "./Middlewares/index.js";
import "./Cron-jobs/index.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";

const app = express();
await DB.MongoConnect();
await DB.redisConnect();
app.use(express.json());

app.use(cors(corsOptions));
app.use(helmet());

const windowMs = 5 * 60 * 1000;
app.use(rateLimit({
  windowMs,
  max:async (req) => 50 ,
  requestPropertyName: "rateLimit",
  statusCode: 429,
  handler: ( res ) => {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
  },
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.headers['x-forwarded-for']);
    return `${ip}-${req.path}`;
  },
  store: new RedisStore({
    sendCommand:(...args)=>DB.redisClient.sendCommand(args)
  })
}));



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