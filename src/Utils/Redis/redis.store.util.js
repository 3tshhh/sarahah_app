import { redisClient } from "../../DB/Connections/index.js";

export const BlackListToken = async ({ tokenId, expirationDate, userId }) => {
  console.log(tokenId);

  const result = await redisClient.hSet(
    `blacklistedToken:${tokenId}`,
    "$",
    JSON.stringify({ tokenId, userId })
  );
  const expiration = await redisClient.expireAt(
    `blacklistedToken:${tokenId}`,
    expirationDate
  );
};
