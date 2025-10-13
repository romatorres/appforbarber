# 📧 Sistema de Email Reutilizável - Guia Completo

## 📋 Visão Geral

O sistema de email com Resend foi desenvolvido de forma modular e pode ser facilmente reutilizado em qualquer parte da aplicação. Este guia mostra como expandir e usar o sistema para diferentes funcionalidades.

---

## 🏗️ Arquitetura Atual

### **1. Configuração Base (`src/lib/resend.ts`)**
```typescript
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
    from: process.env.RESEND_FROM_EMAIL || 'noreply@appforbarber.com',
    replyTo: process.env.RESEND_REPLY_TO || 'support@appforbarber.com',
} as const;
```

### **2. Serviço Base (`src/services/email-service.ts`)**
- ✅ **Classe EmailService** com métodos específicos para funcionários
- ✅ **Templates HTML** profissionais e responsivos
- ✅ **Modo teste** para desenvolvimento
- ✅ **Função auxiliar** `prepareEmailForSending()` reutilizável

---

## 🚀 Como Criar Novos Serviços de Email

### **Passo 1: Criar Novo Serviço**

Crie um arquivo em `src/services/` seguindo o padrão:

```typescript
// src/services/appointment-email-service.ts
import { resend, EMAIL_CONFIG } from '@/lib/resend';

// Interfaces para parâmetros
export interface SendAppointmentConfirmationParams {
  to: string;
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  companyName: string;
}

// Verificar modo teste (copiar do email-service.ts)
const isTestMode = process.env.RESEND_TEST_MODE === 'true';
const testEmail = 'seu-email@teste.com';

// Função auxiliar (copiar do email-service.ts)
function prepareEmailForSending(to: string, subject: string, html: string, text: string, recipientName?: string) {
  if (!isTestMode) {
    return { to: [to], subject, html, text };
  }

  const testSubject = `[TESTE] ${subject}`;
  const testHtml = `
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #92400e;">🧪 MODO TESTE</h3>
      <p><strong>Destinatário original:</strong> ${to}</p>
      ${recipientName ? `<p><strong>Nome:</strong> ${recipientName}</p>` : ''}
    </div>
    ${html}
  `;
  
  return { 
    to: [testEmail], 
    subject: testSubject, 
    html: testHtml, 
    text: `[TESTE] Para: ${to}\n\n${text}` 
  };
}

export class AppointmentEmailService {
  static async sendConfirmation(params: SendAppointmentConfirmationParams) {
    try {
      const emailHtml = `
        <!-- Seu template HTML aqui -->
      `;
      
      const emailText = `
        Versão texto do email
      `;

      const emailData = prepareEmailForSending(
        params.to,
        `Agendamento Confirmado - ${params.companyName}`,
        emailHtml,
        emailText,
        params.customerName
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
        console.error('Erro ao enviar confirmação:', error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      return { success: false, error: 'Erro inesperado' };
    }
  }
}
```

### **Passo 2: Usar no Componente/API**

```typescript
// Em uma API route ou componente
import { AppointmentEmailService } from '@/services/appointment-email-service';

// Enviar email
const result = await AppointmentEmailService.sendConfirmation({
  to: 'cliente@email.com',
  customerName: 'João Silva',
  serviceName: 'Corte de Cabelo',
  appointmentDate: '15/10/2024',
  companyName: 'Barbearia do João'
});

if (result.success) {
  console.log('Email enviado!', result.messageId);
} else {
  console.error('Erro:', result.error);
}
```

---

## 📧 Templates de Email Reutilizáveis

### **Template Base HTML**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb;">🎉 Título do Email</h1>
  </div>
  
  <!-- Conteúdo Principal -->
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <p>Olá <strong>{{nome}}</strong>,</p>
    <p>Conteúdo principal do email...</p>
    
    <!-- Informações Destacadas -->
    <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">📋 Detalhes:</h3>
      <p><strong>Campo:</strong> {{valor}}</p>
    </div>
  </div>
  
  <!-- Call to Action -->
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="{{link}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
      Botão de Ação
    </a>
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; color: #64748b; font-size: 12px;">
    © 2024 {{empresa}} - Sistema de Gestão
  </div>
</div>
```

### **Cores por Tipo de Email**
```css
/* Confirmação/Sucesso */
color: #059669; /* Verde */
background: #f0fdf4;

/* Aviso/Lembrete */
color: #f59e0b; /* Amarelo */
background: #fffbeb;

/* Erro/Cancelamento */
color: #dc2626; /* Vermelho */
background: #fef2f2;

/* Informação */
color: #2563eb; /* Azul */
background: #f0f9ff;
```

---

## 🎯 Casos de Uso Sugeridos

### **1. Sistema de Agendamentos**
```typescript
// Confirmação de agendamento
AppointmentEmailService.sendConfirmation()

// Lembrete de agendamento
AppointmentEmailService.sendReminder()

// Cancelamento de agendamento
AppointmentEmailService.sendCancellation()
```

### **2. Sistema de Clientes**
```typescript
// Boas-vindas para novo cliente
CustomerEmailService.sendWelcome()

// Aniversário do cliente
CustomerEmailService.sendBirthday()

// Promoções personalizadas
CustomerEmailService.sendPromotion()
```

### **3. Sistema Financeiro**
```typescript
// Cobrança de mensalidade
BillingEmailService.sendInvoice()

// Lembrete de pagamento
BillingEmailService.sendPaymentReminder()

// Confirmação de pagamento
BillingEmailService.sendPaymentConfirmation()
```

### **4. Sistema de Relatórios**
```typescript
// Relatório mensal para admin
ReportEmailService.sendMonthlyReport()

// Relatório de comissões para funcionário
ReportEmailService.sendCommissionReport()
```

---

## ⚙️ Configurações Avançadas

### **Variáveis de Ambiente**
```env
# Resend Configuration
RESEND_API_KEY="re_sua_api_key"
RESEND_FROM_EMAIL="noreply@appforbarber.com.br"
RESEND_REPLY_TO="contato@appforbarber.com.br"

# Modo Teste (desenvolvimento)
RESEND_TEST_MODE="false"
RESEND_TEST_EMAIL="seu-email@teste.com"
```

### **Configurações por Ambiente**
```typescript
// Desenvolvimento
RESEND_TEST_MODE="true"  // Emails vão para seu email
RESEND_FROM_EMAIL="onboarding@resend.dev"

// Produção
RESEND_TEST_MODE="false" // Emails vão para destinatários reais
RESEND_FROM_EMAIL="noreply@appforbarber.com.br"
```

---

## 🛠️ Utilitários Reutilizáveis

### **Função de Template**
```typescript
// src/lib/email-templates.ts
export function createEmailTemplate(
  title: string,
  content: string,
  ctaText?: string,
  ctaLink?: string,
  color: string = '#2563eb'
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: ${color};">${title}</h1>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
        ${content}
      </div>
      ${ctaText && ctaLink ? `
        <div style="text-align: center; margin: 20px 0;">
          <a href="${ctaLink}" style="background: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
            ${ctaText}
          </a>
        </div>
      ` : ''}
    </div>
  `;
}
```

### **Função de Formatação de Data**
```typescript
// src/lib/email-utils.ts
export function formatDateForEmail(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTimeForEmail(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

---

## 🧪 Testes e Debug

### **Como Testar Emails**
1. **Modo Desenvolvimento:**
   ```env
   RESEND_TEST_MODE="true"
   RESEND_TEST_EMAIL="seu-email@gmail.com"
   ```

2. **Todos os emails** vão para seu email com banner de teste

3. **Verificar logs** no console para debug

### **Estrutura de Resposta**
```typescript
// Sucesso
{
  success: true,
  messageId: "abc123"
}

// Erro
{
  success: false,
  error: "Mensagem de erro"
}
```

---

## 📊 Monitoramento

### **Logs Recomendados**
```typescript
// Sempre logar envios
console.log('Email enviado:', {
  type: 'appointment_confirmation',
  to: email,
  messageId: result.messageId,
  timestamp: new Date().toISOString()
});

// Logar erros
console.error('Erro no email:', {
  type: 'appointment_confirmation',
  to: email,
  error: result.error,
  timestamp: new Date().toISOString()
});
```

### **Dashboard do Resend**
- Acesse [resend.com/logs](https://resend.com/logs)
- Monitore entregas, bounces e complaints
- Analise métricas de abertura (se configurado)

---

## 🚀 Próximos Passos

### **Funcionalidades Avançadas**
1. **Templates Dinâmicos** - Sistema de templates editáveis
2. **Agendamento de Emails** - Envios programados
3. **Segmentação** - Emails personalizados por grupo
4. **Analytics** - Métricas de abertura e cliques
5. **A/B Testing** - Testar diferentes templates

### **Integrações**
1. **Webhook do Resend** - Receber status de entrega
2. **Queue System** - Fila de emails para alta demanda
3. **Template Engine** - Handlebars ou similar
4. **Database Logging** - Histórico de emails enviados

---

## 📚 Referências

### **Documentação Oficial**
- [Resend Docs](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)

### **Arquivos do Sistema**
```
src/
├── lib/resend.ts                    # Configuração base
├── services/email-service.ts        # Serviço de funcionários
├── services/[novo]-email-service.ts # Novos serviços
└── lib/email-utils.ts              # Utilitários (opcional)
```

---

*Guia criado em: 13/10/2025*  
*Versão: 1.0.0*  
*Sistema base: Funcionários com Resend*