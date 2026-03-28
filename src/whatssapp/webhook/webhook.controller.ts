import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { BotService } from '../Bot/bot.service';


@Controller('webhook')
export class WebhookController {
    private readonly token = process.env.WHATSAPP_ACCESS_TOKEN;
    constructor(private readonly botService: BotService){}




    @Get()
     verify(
         @Query('hub.mode') mode: string,
         @Query('hub.verify_token') token: string,
         @Query('hub.challenge') challenge: string,
         @Res() res: Response,
     ){
         if (mode === 'subscribe' && token === this.token)
             return res.status(200).send(challenge);
         return res.sendStatus(403);
     }

     @Post()
     async receive(@Body() body: any){
         try {
            
             console.log(JSON.stringify(body));
             const entry = body.entry?.[0];
             const changes = entry?.changes?.[0];
             const message = changes?.value?.messages?.[0];

             if (!message) return 'EVENT_RECEIVED';

             const from = message.from; //user number
             const text =  message.text?.body;
             
             console.log('Webhook received message:', { from, text, messageType: message.type, fullMessage: message });

             if (!text) {
                 console.log('No text in message, skipping');
                 return 'EVENT_RECEIVED';
             }

             await this.botService.sendMessage(from, text);
            
             return 'EVENT_RECEIVED';

         } catch (error) {
             console.error(error);
             return 'ERROR';
         }
     }
}
