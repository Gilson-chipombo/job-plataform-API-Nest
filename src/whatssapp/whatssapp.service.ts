// whatsapp.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private readonly token = process.env.WHATSAPP_ACCESS_TOKEN;
  private readonly phoneNumberId = process.env.PHONE_NUMBER_ID;

  async sendMessage(to: string, message: string) {
    const url = `https://graph.facebook.com/v22.0/${this.phoneNumberId}/messages`;

    const body = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: message,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.json();
  }

  async sendTemplate(to: string) {
    const url = `https://graph.facebook.com/v22.0/${this.phoneNumberId}/messages`;

    const body = {
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ''), // limpa número
        type: "template",
        template: {
        name: "hello_world",
        language: {
            code: "en_US",
        },
        },
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("WhatsApp response:", data);

    return data;
    }
}