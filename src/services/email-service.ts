import { resend, EMAIL_CONFIG } from '@/lib/resend';

export interface SendEmployeeInviteParams {
  to: string;
  employeeName: string;
  companyName: string;
  temporaryPassword: string;
}

export interface SendSystemAccessParams {
  to: string;
  employeeName: string;
  companyName: string;
}

// Verificar se está em modo de teste (conta não verificada)
const isTestMode = process.env.RESEND_TEST_MODE === 'true';
const testEmail = 'romatorres12@gmail.com'; // Email verificado na conta Resend

// Função auxiliar para preparar email em modo teste
function prepareEmailForSending(to: string, subject: string, html: string, text: string, employeeName?: string) {
  if (!isTestMode) {
    return { to: [to], subject, html, text };
  }

  // Em modo teste, enviar para email verificado com informações do destinatário original
  const testSubject = `[TESTE] ${subject}`;
  const testHtml = `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0; font-size: 16px;">🧪 MODO TESTE - RESEND</h3>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Destinatário original:</strong> ${to}</p>
            ${employeeName ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Funcionário:</strong> ${employeeName}</p>` : ''}
            <p style="margin: 5px 0; font-size: 12px; color: #92400e;">Este email está sendo enviado para seu email verificado porque sua conta Resend ainda não tem domínio verificado.</p>
        </div>
        ${html}
    `;

  const testText = `
[MODO TESTE - RESEND]
Destinatário original: ${to}
${employeeName ? `Funcionário: ${employeeName}` : ''}

Este email está sendo enviado para seu email verificado porque sua conta Resend ainda não tem domínio verificado.

---

${text}
    `.trim();

  return {
    to: [testEmail],
    subject: testSubject,
    html: testHtml,
    text: testText
  };
}

export class EmailService {
  private static getLoginUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return `${baseUrl}/login`;
  }

  /**
   * Enviar convite para novo funcionário
   */
  static async sendEmployeeInvite({
    to,
    employeeName,
    companyName,
    temporaryPassword,
  }: SendEmployeeInviteParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const loginUrl = this.getLoginUrl();

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">🎉 Bem-vindo ao ${companyName}!</h1>
            <p style="color: #666; font-size: 16px;">Você foi convidado para acessar o sistema</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <p style="font-size: 16px; margin-bottom: 15px;">Olá <strong>${employeeName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 15px;">
              Você foi cadastrado como funcionário da <strong>${companyName}</strong> 
              e agora tem acesso ao nosso sistema de gestão.
            </p>

            <p style="font-size: 16px; margin-bottom: 20px;">Com o sistema você poderá:</p>
            <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
              <li>Visualizar seus agendamentos</li>
              <li>Gerenciar sua agenda</li>
              <li>Acompanhar suas comissões</li>
              <li>Atualizar suas informações</li>
            </ul>
          </div>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">🔐 Suas credenciais de acesso:</h3>
            
            <div style="background: #fff; padding: 15px; border-radius: 6px; font-family: monospace;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${to}</p>
              <p style="margin: 5px 0;"><strong>Senha temporária:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</code></p>
            </div>

            <p style="font-size: 14px; color: #92400e; margin-top: 15px; margin-bottom: 0;">
              ⚠️ <strong>Importante:</strong> Altere sua senha no primeiro acesso por segurança.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${loginUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
              Acessar Sistema
            </a>
          </div>

          <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="font-size: 14px; color: #64748b; margin-bottom: 10px;">
              Este convite foi enviado por <strong>${companyName}</strong>
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 15px;">
              © 2024 App For Barber - Sistema de Gestão para Barbearias e Salões
            </p>
          </div>
        </div>
      `;

      const emailText = `
Olá ${employeeName},

Você foi convidado para acessar o sistema da ${companyName}!

Suas credenciais:
- Email: ${to}
- Senha temporária: ${temporaryPassword}

Acesse: ${loginUrl}

Importante: Altere sua senha no primeiro acesso.

Atenciosamente,
Equipe ${companyName}
            `.trim();

      const emailData = prepareEmailForSending(
        to,
        `🎉 Bem-vindo ao ${companyName} - Acesso ao Sistema`,
        emailHtml,
        emailText,
        employeeName
      );

      console.log(`Enviando email ${isTestMode ? 'em modo teste' : 'normal'} para: ${emailData.to[0]}`);

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: emailData.to,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });

      if (error) {
        console.error('Erro ao enviar email de convite:', error);
        return { success: false, error: error.message };
      }

      console.log('Email de convite enviado:', { to: emailData.to[0], messageId: data?.id });
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Erro inesperado ao enviar email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Notificar que acesso ao sistema foi concedido
   */
  static async sendSystemAccessGranted({
    to,
    employeeName,
    companyName,
  }: SendSystemAccessParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const loginUrl = this.getLoginUrl();

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin-bottom: 10px;">🎉 Acesso Concedido!</h1>
            <p style="color: #666; font-size: 16px;">Você agora tem acesso ao sistema</p>
          </div>

          <div style="background: #f0fdf4; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <p style="font-size: 16px; margin-bottom: 15px;">Olá <strong>${employeeName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 15px;">
              Ótimas notícias! Você agora tem acesso ao sistema da <strong>${companyName}</strong>.
            </p>

            <p style="font-size: 16px; margin-bottom: 15px;">
              Você pode fazer login usando seu email cadastrado e a senha que você já possui.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${loginUrl}" style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
              Fazer Login
            </a>
          </div>

          <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="font-size: 14px; color: #64748b;">
              Acesso concedido por <strong>${companyName}</strong>
            </p>
          </div>
        </div>
      `;

      const emailText = `
Olá ${employeeName},

Ótimas notícias! Você agora tem acesso ao sistema da ${companyName}.

Você pode fazer login usando seu email e senha cadastrados.

Acesse: ${loginUrl}

Atenciosamente,
Equipe ${companyName}
            `.trim();

      const emailData = prepareEmailForSending(
        to,
        `🎉 Acesso Concedido - ${companyName}`,
        emailHtml,
        emailText,
        employeeName
      );

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: emailData.to,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });

      if (error) {
        console.error('Erro ao enviar email de acesso concedido:', error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Erro inesperado ao enviar email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Notificar que acesso ao sistema foi removido
   */
  static async sendSystemAccessRevoked({
    to,
    employeeName,
    companyName,
  }: SendSystemAccessParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin-bottom: 10px;">🔒 Acesso Removido</h1>
            <p style="color: #666; font-size: 16px;">Seu acesso ao sistema foi removido</p>
          </div>

          <div style="background: #fef2f2; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <p style="font-size: 16px; margin-bottom: 15px;">Olá <strong>${employeeName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 15px;">
              Informamos que seu acesso ao sistema da <strong>${companyName}</strong> foi removido.
            </p>

            <p style="font-size: 16px; margin-bottom: 15px;">
              Se acredita que isso foi um erro, entre em contato com seu supervisor.
            </p>
          </div>

          <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="font-size: 14px; color: #64748b;">
              Alteração realizada por <strong>${companyName}</strong>
            </p>
          </div>
        </div>
      `;

      const emailText = `
Olá ${employeeName},

Informamos que seu acesso ao sistema da ${companyName} foi removido.

Se acredita que isso foi um erro, entre em contato com seu supervisor.

Atenciosamente,
Equipe ${companyName}
            `.trim();

      const emailData = prepareEmailForSending(
        to,
        `🔒 Acesso Removido - ${companyName}`,
        emailHtml,
        emailText,
        employeeName
      );

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: emailData.to,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });

      if (error) {
        console.error('Erro ao enviar email de acesso removido:', error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Erro inesperado ao enviar email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Reenviar convite para funcionário
   */
  static async resendEmployeeInvite(params: SendEmployeeInviteParams) {
    return this.sendEmployeeInvite(params);
  }
}

// Função utilitária para gerar senha temporária
export function generateTemporaryPassword(length: number = 12): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
}