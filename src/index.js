import "./Utils/dotenv.js";
import express from "express";
import { DBConnect } from "./DB/db.connection.js";
import userRouter from "./Modules/Users/user.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import cors from "cors";
import helmet from "helmet";

const app = express();
DBConnect();

app.use(express.json());

const whitelist = process.env.WHITE_LISTED_ORIGINS;

const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(helmet());

app.use("/message", messageRouter);
app.use("/users", userRouter);

app.use("/", (req, res) => {
  res.json({ message: "not found" });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "something broke!", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
