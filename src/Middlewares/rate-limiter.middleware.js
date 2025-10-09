import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import MongoStore from "rate-limit-mongo";

const windowMs = 5 * 60 * 1000;
export const limiter = rateLimit({
  windowMs,
  max:async function(req) {
    return 50;
    
  } ,
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
  store:new MongoStore({
    uri: process.env.MONGO_URL,
    collectionName: "rateLimits",
    expireTimeMs: windowMs,
  })
});
