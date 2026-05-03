import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      console.log(`Enviando email para: ${to}, Assunto: ${subject}`);
      
      const result = await this.transporter.sendMail({
        from: `"VagasAo" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: 'Veja este email em um cliente que suporta HTML',
      });
      
      console.log(`Email enviado com sucesso:`, result.messageId);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  async sendRegistrationConfirmation(
    email: string,
    fullName: string,
    activationLink: string,
  ): Promise<void> {
    const subject = 'Confirme o seu registo';
    const html = `
      <h2>Bem-vindo, ${fullName}!</h2>
      <p>Obrigado por se registar na nossa plataforma.</p>
      <p>Por favor, clique no link abaixo para confirmar o seu email:</p>
      <a href="${activationLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Confirmar Email
      </a>
      <p>Se não solicitou este registo, ignore este email.</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    const subject = 'Recuperação de Senha';
    const html = `
      <h2>Pedido de Recuperação de Senha</h2>
      <p>Recebemos um pedido para recuperar a sua senha.</p>
      <p>Clique no link abaixo para redefinir a sua senha:</p>
      <a href="${resetLink}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
        Redefinir Senha
      </a>
      <p>Este link expira em 24 horas.</p>
      <p>Se não solicitou isto, ignore este email.</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  async sendApplicationConfirmation(
    studentEmail: string,
    studentName: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    const subject = `Candidatura Confirmada: ${jobTitle}`;
    const html = `
      <h2>Candidatura Confirmada!</h2>
      <p>Olá, ${studentName}!</p>
      <p>A sua candidatura para a vaga de <strong>${jobTitle}</strong> na empresa <strong>${companyName}</strong> foi recebida com sucesso.</p>
      <p>A empresa analisará o seu perfil e entrará em contacto em breve.</p>
      <p>Boa sorte!</p>
    `;
    await this.sendEmail(studentEmail, subject, html);
  }

  async sendApplicationNotificationToCompany(
    companyEmail: string,
    companyName: string,
    studentName: string,
    jobTitle: string,
  ): Promise<void> {
    const subject = `Nova Candidatura: ${jobTitle}`;
    const html = `
      <h2>Nova Candidatura Recebida</h2>
      <p>Olá, ${companyName}!</p>
      <p>O candidato <strong>${studentName}</strong> aplicou-se para a vaga de <strong>${jobTitle}</strong>.</p>
      <p>Aceda ao dashboard para ver o perfil completo e o currículo do candidato.</p>
    `;
    await this.sendEmail(companyEmail, subject, html);
  }

  async sendApprovalEmail(
    email: string,
    name: string,
    userType: 'student' | 'company',
  ): Promise<void> {
    const subject = 'Conta Aprovada!';
    const userTypeLabel = userType === 'student' ? 'Estudante' : 'Empresa';
    const html = `
      <h2>Parabéns, ${name}!</h2>
      <p>A sua conta como ${userTypeLabel} foi aprovada com sucesso!</p>
      <p>Já pode aceder à plataforma com as suas credenciais.</p>
      <p>Bem-vindo!</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  async sendRejectionEmail(
    email: string,
    name: string,
    reason: string,
  ): Promise<void> {
    const subject = 'Actualização sobre o seu registo';
    const html = `
      <h2>Olá, ${name}!</h2>
      <p>Infelizmente, o seu registo foi rejeitado.</p>
      <p><strong>Motivo:</strong> ${reason}</p>
    `;
    await this.sendEmail(email, subject, html);
  }

  async sendApplicationApprovalEmail(
    studentEmail: string,
    studentName: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    const subject = `Candidatura Aprovada: ${jobTitle}`;
    const html = `
      <h2>Parabéns, ${studentName}!</h2>
      <p>A sua candidatura foi <strong>aprovada</strong>!</p>
      <p>A empresa <strong>${companyName}</strong> decidiu aprovar a sua candidatura para a vaga de <strong>${jobTitle}</strong>.</p>
      <p>A empresa entrará em contacto em breve com os próximos passos.</p>
      <p>Boa sorte!</p>
    `;
    await this.sendEmail(studentEmail, subject, html);
  }

  async sendApplicationRejectionEmail(
    studentEmail: string,
    studentName: string,
    jobTitle: string,
    companyName: string,
    reason: string,
  ): Promise<void> {
    const subject = `Actualização sobre a sua candidatura: ${jobTitle}`;
    const html = `
      <h2>Olá, ${studentName}!</h2>
      <p>Recebemos sua candidatura para a vaga de <strong>${jobTitle}</strong> na empresa <strong>${companyName}</strong>.</p>
      <p>Infelizmente, não foi selecionado nesta ocasião.</p>
      <p><strong>Motivo:</strong> ${reason}</p>
      <p>Continue acompanhando outras oportunidades na nossa plataforma. Boa sorte!</p>
    `;
    await this.sendEmail(studentEmail, subject, html);
  }
}
