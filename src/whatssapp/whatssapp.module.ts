import { Module } from '@nestjs/common';
import { WhatsappService } from './whatssapp.service';
import { WhatsappController } from './whatssapp.controller';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  providers: [WhatsappService],
  controllers: [WhatsappController],
  imports: [WebhookModule]
})
export class WhatssappModule {}
