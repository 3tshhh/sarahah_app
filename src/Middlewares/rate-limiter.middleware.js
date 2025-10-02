import rateLimit from "express-rate-limit";
import { getCountryCode } from "../Utils/index.js";
import MongoStore from "rate-limit-mongo";

export const limiter = rateLimit({
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
