// whatsapp.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private readonly token = process.env.WHATSAPP_ACCESS_TOKEN;
  private readonly phoneNumberId = process.env.PHONE_NUMBER_ID;

  async sendMessage(to: string, message: string) {
    const url = `https://graph.facebook.com/v22.0/${this.phoneNumberId}/messages`;
    const cleanedTo = to.replace(/\D/g, '');

    const body = {
      messaging_product: "whatsapp",
      to: cleanedTo,
      type: "text",
      text: {
        body: message,
      },
    };

    console.log('Sending WhatsApp message:', { to: cleanedTo, message });
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.error) {
      console.error('WhatsApp API error:', data.error);
    } else {
      console.log('WhatsApp message sent successfully:', data);
    }
    return data;
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