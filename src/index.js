import "./Utils/dotenv.js";
import express from "express";
import { DBConnect } from "./DB/db.connection.js";
import userRouter from "./Modules/Users/users.controller.js";



const app = express();
DBConnect();

app.use(express.json());

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
