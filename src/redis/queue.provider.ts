import {Redis} from 'ioredis';
import {Injectable} from '@nestjs/common';

@Injectable()
export class QueueProvider {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async addToQueue(queueName: string, data: any) {
    await this.redis.lpush(queueName, JSON.stringify(data));
  }

  async getFromQueue(queueName: string): Promise<any> {
    const data = await this.redis.rpop(queueName);
    return data ? JSON.parse(data) : null;
  }
}