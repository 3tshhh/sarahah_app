import { redisClient } from "../../DB/Connections/index.js";

export const getRedisKey = async (key) => {
  const value = await redisClient.get(key);
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const doesKeyExist = async (key) => {
  return await redisClient.exists(key);
};
