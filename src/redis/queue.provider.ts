import { Queue } from "bullmq";
import { redisProvider } from "./redis.provider";

export const queueProvider = new Queue('message-queue', {
  connection: redisProvider
});