// whatsapp.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatssapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send')
  async send(@Body() body: any) {
    const { to, message } = body;
    return this.whatsappService.sendMessage(to, message);
  }

  @Post('send-template')
  async sendTemplate(@Body() body: any) {
    const { to } = body;
    return this.whatsappService.sendTemplate(to);
  }
}