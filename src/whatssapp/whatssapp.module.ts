import { Module } from '@nestjs/common';
import { WhatsappService } from './whatssapp.service';
import { WhatsappController } from './whatssapp.controller';

@Module({
  providers: [WhatsappService],
  controllers: [WhatsappController]
})
export class WhatssappModule {}
