import { redisClient } from "../../DB/Connections/index.js";

export const isTokenBlackListed = async ({ tokenId }) => {
  const result = await redisClient.hGetAll(`blacklistedToken:${tokenId}`);

  if (Object.keys(result).length === 0) {
    return false;
  }
  return true;
};
