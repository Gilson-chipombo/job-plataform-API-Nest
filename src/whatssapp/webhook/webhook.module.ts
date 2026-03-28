import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { BotService } from '../bot.service';
import { WhatsappService } from '../whatssapp.service';

@Module({
  providers: [WebhookService, BotService, WhatsappService],
  controllers: [WebhookController]
})
export class WebhookModule {}
