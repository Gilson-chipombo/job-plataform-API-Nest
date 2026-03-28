import { Module } from '@nestjs/common';
import '../Bot/bot.worker';
import { WebhookController } from './webhook.controller';
import { BotService } from '../Bot/bot.service';
import { WhatsappService } from '../whatssapp.service';

@Module({
  providers: [BotService, WhatsappService],
  controllers: [WebhookController],
})
export class WebhookModule {}
