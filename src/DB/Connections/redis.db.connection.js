import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});
export const redisConnect = async () => {
  try {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error(error);
  }
};

export { redisClient };