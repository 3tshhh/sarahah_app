import * as redis from "../../DB/Models/index.js";
import { deleteRedisKey } from "./delete.key.util.js";
import * as redisGet from "./get.key.util.js";

export const isTokenBlackListed = async (tokenId) => {
  return await redisGet.doesKeyExist(
    redis.BlackListedTokenRedisModel.key(tokenId)
  );
};

export const getOTPFromRedis = async (key, type) => {
  return await redisGet.getRedisKey(
    redis.OTPRedisModel.key(key, type)
  );
};

export const deleteOTPFromRedis = async (key, type) => {
  return await deleteRedisKey(
    redis.OTPRedisModel.key(key, type)
  );
};
