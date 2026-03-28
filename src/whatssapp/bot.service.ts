import { Inject, Injectable } from "@nestjs/common";
import { WhatsappService } from "./whatssapp.service";
import { stat } from "fs";

@Injectable()
export class BotService {
    private userState = new Map<string, string>();

    constructor(private readonly whatsappService: WhatsappService){}

    async handleMessage(from: string, text: string){
        const state = this.userState.get(from);

        if (!state){
            this.userState.set(from, 'menu');
            const message = `👋 Bem-vindo!\n\n1 Consultar saldo\n2 Ver serviços`;
            return this.whatsappService.sendMessage(from, message);
        }

        if (state === 'menu'){

            if (text === '1'){
                this.userState.set(from, 'saldo');
                return this.whatsappService.sendMessage(
                    from,
                    `💰 Seu saldo é: 10.000 Kz`
                )
            }

            if (text === '2'){
                return this.whatsappService.sendMessage(
                    from,
                    `📦 Serviços disponíveis:\n- Internet\n- Recargas`
                );
            }

            return this.whatsappService.sendMessage(
                from,
                `❌ Opção inválida\n\n1 Consultar saldo\n2 Ver serviços`
            );
        }
    }
}