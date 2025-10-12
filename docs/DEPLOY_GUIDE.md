# 🚀 Guia de Deploy - App For Barber

## 📋 Pré-requisitos

### **1. Domínio Configurado**
- ✅ Domínio: `appforbarber.com.br`
- ✅ DNS configurado no Resend
- ✅ Certificado SSL ativo

### **2. Serviços Externos**
- ✅ Conta Resend com domínio verificado
- ✅ Banco PostgreSQL (Neon, Supabase, etc.)
- ✅ Google OAuth configurado

---

## 🌐 Configuração do Domínio no Resend

### **Passo 1: Adicionar Domínio**
1. Acesse [resend.com/domains](https://resend.com/domains)
2. Clique em "Add Domain"
3. Digite: `appforbarber.com.br`

### **Passo 2: Configurar DNS**
Adicione os seguintes registros no seu provedor de DNS:

```dns
# Verificação do domínio
Type: TXT
Name: @
Value: resend-domain-verification=xxxxx

# MX Record para recebimento
Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

# SPF Record
Type: TXT
Name: @
Value: "v=spf1 include:amazonses.com ~all"

# DKIM Record
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.amazonses.com
```

### **Passo 3: Aguardar Verificação**
- Tempo: 15 minutos a 24 horas
- Status: Verificar em [resend.com/domains](https://resend.com/domains)

---

## ⚙️ Variáveis de Ambiente

### **Desenvolvimento (.env.local)**
```env
# Database
DATABASE_URL="postgresql://..."

# Next.js
NEXT_PUBLIC_URL="http://localhost:3000"

# Better Auth
BETTER_AUTH_SECRET="dev-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Resend (Desenvolvimento)
RESEND_API_KEY="re_dev_key"
RESEND_FROM_EMAIL="noreply@appforbarber.com.br"
RESEND_REPLY_TO="contato@appforbarber.com.br"
RESEND_TEST_MODE="false"
```

### **Produção (.env.production)**
```env
# Database
DATABASE_URL="postgresql://production-url"

# Next.js
NEXT_PUBLIC_URL="https://appforbarber.com.br"

# Better Auth
BETTER_AUTH_SECRET="production-secret-key-256-bits"
BETTER_AUTH_URL="https://appforbarber.com.br"

# Resend (Produção)
RESEND_API_KEY="re_production_key"
RESEND_FROM_EMAIL="noreply@appforbarber.com.br"
RESEND_REPLY_TO="contato@appforbarber.com.br"
RESEND_TEST_MODE="false"
```

---

## 🔧 Deploy na Vercel

### **1. Conectar Repositório**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel --prod
```

### **2. Configurar Variáveis**
No dashboard da Vercel:
1. Vá em Settings > Environment Variables
2. Adicione todas as variáveis de produção
3. Marque "Production" environment

### **3. Configurar Domínio**
1. Vá em Settings > Domains
2. Adicione: `appforbarber.com.br`
3. Configure DNS do domínio para apontar para Vercel

---

## 🧪 Testes Pós-Deploy

### **1. Verificar Domínio de Email**
```bash
curl https://appforbarber.com.br/api/verify-domain
```

### **2. Testar Envio de Email**
1. Acesse: `https://appforbarber.com.br/admin/test-email`
2. Clique em "Verificar Domínio"
3. Envie email de teste

### **3. Testar Funcionários**
1. Crie funcionário com convite
2. Verifique se email chegou
3. Teste controle de acesso

---

## 📊 Monitoramento

### **Logs do Resend**
- Dashboard: [resend.com/logs](https://resend.com/logs)
- Métricas de entrega
- Bounces e complaints

### **Logs da Vercel**
- Dashboard: [vercel.com](https://vercel.com)
- Function logs
- Performance metrics

---

## 🚨 Troubleshooting

### **Email não chega**
1. Verificar status do domínio no Resend
2. Verificar logs de envio
3. Verificar spam/lixo eletrônico
4. Verificar configuração DNS

### **Erro de autenticação**
1. Verificar API key do Resend
2. Verificar variáveis de ambiente
3. Verificar permissões da API key

### **Erro de domínio**
1. Aguardar propagação DNS (24h)
2. Verificar registros DNS
3. Contatar suporte do Resend

---

## ✅ Checklist de Deploy

- [ ] Domínio configurado no Resend
- [ ] DNS records adicionados
- [ ] Domínio verificado (status: verified)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado na Vercel
- [ ] Domínio personalizado configurado
- [ ] SSL ativo
- [ ] Teste de email funcionando
- [ ] Teste de funcionários funcionando
- [ ] Monitoramento configurado

---

## 📞 Suporte

### **Resend**
- Docs: [resend.com/docs](https://resend.com/docs)
- Support: [resend.com/support](https://resend.com/support)

### **Vercel**
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)

---

*Guia atualizado em: 12/10/2025*  
*Versão: 1.0.0*