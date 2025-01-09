import dotenv from "dotenv";
import Redis from "ioredis";
dotenv.config();
const redis = new Redis(process.env.UPSTASH_REDIS_URL);
await redis.set("foo", "bar");

export default redis;
