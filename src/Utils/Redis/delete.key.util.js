import { redisClient } from "../../DB/Connections/index.js";

export const deleteRedisKey = async (key) => {
    return await redisClient.del(key);
};