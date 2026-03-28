import { Injectable } from "@nestjs/common";
import {redisProvider} from "../../redis/redis.provider";

@Injectable()
export class BotStateService {
    private readonly redisClient = redisProvider;

    private getStateKey(userId: string): string {
        return `bot_state:${userId}`;
    }
    
    async setState(userId: string, state: string): Promise<void> { 
        await this.redisClient.set(this.getStateKey(userId), state, 'EX', 3600); // Expira em 1 hora
    }
    
    async getState(userId: string): Promise<string | null> {
        return await this.redisClient.get(this.getStateKey(userId));
    }

    async clearState(userId: string): Promise<void> {
        await this.redisClient.del(this.getStateKey(userId));
    }
}
