import "./Utils/dotenv.js";
import express from "express";
import { DBConnect } from "./DB/db.connection.js";
import userRouter from "./Modules/Users/user.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import axios from "axios";
import  MongoStore  from "rate-limit-mongo";

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

async function getCountryCode(ip) {
  const response = await axios.get(`https://ipapi.co/${ip}/json/`);
  return response.data;
}


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:async function(req) {
    const {country_code} = await getCountryCode(req.headers['x-forwarded-for']);
    console.log(country_code)

    // india 1 requesst egy 50 requests us 100 requests saudi 20 requests 
    if(country_code === 'EG') return 50;
    if(country_code === 'SA') return 20;
    if(country_code === 'US') return 10;
    if(country_code === 'IN') return 10;
    if(country_code === 'BR') return 6;
    return 5;
    
  } ,
  requestPropertyName: "rateLimit",
  statusCode: 429,
  handler: (req, res /*, next*/) => {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
  },
  legacyHeaders: false,
  keyGenerator: (req /*, res*/) => {
    const ip = ipKeyGenerator(req.headers['x-forwarded-for']);
    console.log(`the key generator is ${ip}-${req.path}`);
    return `${ip}-${req.path}`;
  },
  store:new MongoStore({
    uri: process.env.MONGO_URL,
    collectionName: "rateLimits",
    expireTimeMs: 15 * 60 * 1000,
  })
});

app.get("/test", limiter, (req, res) => {
  console.log(req.rateLimit);
  res.send("This is a rate limited endpoint.");
});

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
