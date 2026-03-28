import { Inject, Injectable } from "@nestjs/common";
import { queueProvider } from "src/redis/queue.provider";

@Injectable()
export class BotService {
    async sendMessage(from: string, text: string): Promise<void> {
        //enfileira a mensagem para envio
        console.log('BotService.sendMessage called:', { from, text });
        await queueProvider.add('send-message', { 
            from,
            text
        },{
            attempts: 3, // Tenta enviar a mensagem até 3 vezes em caso de falha
            backoff: {
                type: 'exponential',
                delay: 2000, // Tempo inicial de espera entre as tentativas (2 segundo)
            },
        });
    }

    async sendTemplate(from: string): Promise<void> {
        await queueProvider.add('send-template', { 
            from,
        },{
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });
    }
}