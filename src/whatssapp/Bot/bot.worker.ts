import { Worker } from "bullmq";
import { redisProvider } from "src/redis/redis.provider";
import { WhatsappService } from "../whatssapp.service";
import { BotStateService } from "./bot.state.service";

const whatsappService = new WhatsappService();
const stateService = new BotStateService();

export const botWorker = new Worker('message-queue',
     async job => {
         const { from, text } = job.data;
         console.log('Worker received job:', { from, text, data: job.data });
       const state = await stateService.getState(from);
       console.log('User state:', { from, state, text });

       if (!state){
            await stateService.setState(from, 'menu');

            return whatsappService.sendMessage(
                from,
                '👋 Olá! Bem-vindo ao nosso serviço de atendimento via WhatsApp. Por favor, escolha uma opção:\n1. Falar com um atendente\n2. Ver nossos produtos\n3. Obter suporte técnico'
            );
       }
        
      // if (state === 'menu') {
            const trimmedText = text?.trim();
            console.log('Menu state - comparing:', { trimmedText, type: typeof trimmedText });
            if (trimmedText === '1') { 
                await stateService.setState(from, 'atendente');
                return whatsappService.sendMessage(from, 'Você escolheu falar com um atendente. Por favor, aguarde um momento enquanto conectamos você a um de nossos representantes.');
            } else if (text === '2') {
                await stateService.setState(from, 'produtos');
                return whatsappService.sendMessage(from, 'Aqui estão nossos produtos:\n- Produto A\n- Produto B\n- Produto C\nDigite o nome do produto para mais informações.');
            } else if (text === '3') {
                await stateService.setState(from, 'suporte');
                return whatsappService.sendMessage(from, 'Você escolheu obter suporte técnico. Por favor, descreva o problema que você está enfrentando e faremos o nosso melhor para ajudar.');
            } else {
                return whatsappService.sendMessage(from, 'Opção inválida. Por favor, escolha uma opção:\n1. Falar com um atendente\n2. Ver nossos produtos\n3. Obter suporte técnico');
            }
       //}

       if (state === 'produtos') {
            return whatsappService.sendMessage(from, `Você solicitou informações sobre o produto: ${text}. Em breve, um de nossos representantes entrará em contato para fornecer mais detalhes.`);
       }

       if (state === 'suporte') {
            return whatsappService.sendMessage(from, `Obrigado por descrever seu problema: "${text}". Nossa equipe de suporte técnico analisará sua solicitação e entrará em contato com você o mais breve possível para oferecer assistência.`);
       }

       return whatsappService.sendMessage(from, 'Desculpe, não entendi sua mensagem. Por favor, escolha uma opção:\n1. Falar com um atendente\n2. Ver nossos produtos\n3. Obter suporte técnico');

    }, {
    connection: redisProvider
});
