import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { BotService } from '../bot.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly botService: BotService){}

    @Get()
    verify(
        @Query('hub.mode') mode: string,
        @Query('hub.verify_token') token: string,
        @Query('hub.challenge') challenge: string,
        @Res() res: Response,
    ){
        if (mode === 'subscribe' && token === 'meu_token_seguro')
            return res.status(200).send(challenge);
        return res.sendStatus(403);
    }

    @Post()
    async receive(@Body() body: any){
        try {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const message = changes?.value?.messages?.[0];

            if (!message) return 'EVENT_RECEIVED';

            const from = message.from; //user number
            const text =  message.txt?.body;

            await this.botService.handleMessage(from, text);
            
            return 'EVENT_RECEIVED';

        } catch (error) {
            console.error(error);
            return 'ERROR';
        }
    }
}
