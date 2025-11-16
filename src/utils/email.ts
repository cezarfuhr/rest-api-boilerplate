import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/env';
import { logger } from './logger';

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      if (!config.smtp.user || !config.smtp.password) {
        logger.warn('SMTP credentials not configured. Email service will not work.');
        return;
      }

      this.transporter = nodemailer.createTransporter({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.password,
        },
      });

      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize email service');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('Email service not configured. Skipping email send.');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${config.smtp.fromName}" <${config.smtp.from}>`,
        to,
        subject,
        html,
      });

      logger.info({ messageId: info.messageId, to }, 'Email sent successfully');
      return true;
    } catch (error) {
      logger.error({ error, to, subject }, 'Failed to send email');
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${config.urls.frontend}/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo ao ${config.smtp.fromName}!</h1>
            </div>
            <div class="content">
              <p>Olá ${name},</p>
              <p>Obrigado por se registrar! Para completar seu cadastro, por favor verifique seu endereço de email clicando no botão abaixo:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verificar Email</a>
              </center>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p>Este link expira em 24 horas.</p>
              <p>Se você não criou esta conta, por favor ignore este email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${config.smtp.fromName}. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, 'Verifique seu email', html);
  }

  async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${config.urls.frontend}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Redefinir Senha</h1>
            </div>
            <div class="content">
              <p>Olá ${name},</p>
              <p>Você solicitou a redefinição de senha para sua conta. Clique no botão abaixo para criar uma nova senha:</p>
              <center>
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </center>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p>Este link expira em 1 hora.</p>
              <div class="warning">
                <strong>⚠️ Atenção:</strong> Se você não solicitou esta redefinição de senha, por favor ignore este email. Sua senha permanecerá inalterada.
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${config.smtp.fromName}. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, 'Redefinir sua senha', html);
  }

  async sendPasswordChangedEmail(to: string, name: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Senha Alterada</h1>
            </div>
            <div class="content">
              <p>Olá ${name},</p>
              <div class="success">
                <strong>✓ Sucesso!</strong> Sua senha foi alterada com sucesso.
              </div>
              <p>Se você não realizou esta alteração, entre em contato conosco imediatamente.</p>
              <p>Data e hora: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${config.smtp.fromName}. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(to, 'Sua senha foi alterada', html);
  }
}

export const emailService = new EmailService();
