import { createClient } from "redis";

const redisClient = createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const setRedisItem = async (key: string, value: any) => {
  (await redisClient).set(key, value);
};

const getRedisItem = async (key: string) => {
  const resData = await (await redisClient).get(key);
  return resData;
};

const deleteRedisItem = async (key: string) => {
  (await redisClient).del(key);
};

export { setRedisItem, getRedisItem, deleteRedisItem };
