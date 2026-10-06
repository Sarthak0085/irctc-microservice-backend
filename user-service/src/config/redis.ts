import { Redis, RedisOptions } from "ioredis";
import { config } from "./index.js";
import { logger } from "../utils/logger.js";

export class RedisClient {
    private static instance: Redis | null = null;
    private static isConnected = false;

    constructor() {}


    public static getInstance() {
        if(!RedisClient.instance){
            const redisUrl = config.REDIS_URL;

            const options: RedisOptions = {
                retryStrategy: (times: number) => {
                    const delay = Math.min(times*50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
            } 

            RedisClient.instance = new Redis(redisUrl!, options);


            RedisClient.instance.on('connect', () =>{
               RedisClient.isConnected = true;
               logger.info("Connected to Redis");
          })

          RedisClient.instance.on('error', (error) =>{
               RedisClient.isConnected = false;
               logger.error("Redis connection error", error);
          })

          RedisClient.instance.on('close', () =>{
               RedisClient.isConnected = false;
               logger.warn("Redis connection closed");
          })

          RedisClient.instance.on('reconnecting', () =>{
               logger.warn("Reconnecting to Redis...");
          })

          RedisClient.instance.on('ready', () =>{
               logger.warn("Redis client is ready");
          })

          RedisClient.instance.on('end', () =>{
               RedisClient.isConnected = false;
               logger.warn("Redis connection ended");
          })
        }

        return RedisClient.instance;
    }

    public static async closeConnection(){
          if(RedisClient.instance){
               try{
                    await RedisClient.instance.quit();
                    logger.info("Redis connection closed");
               }catch(error){
                    logger.error("Error closing Redis connection: ", error);
               }
          }
     }

     public static isReady(){
          return RedisClient.isConnected;
     }
}

export const redis = RedisClient.getInstance();