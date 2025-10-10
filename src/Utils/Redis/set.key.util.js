import { redisClient } from "../../DB/Connections/index.js";

export const setRedisKey = async (key, value, ttl= null)=>{
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    if(ttl){
        await redisClient.setEx(key.toString(), ttl, stringValue);
    }else{
        await redisClient.set(key, stringValue);
    }
    return true;
}