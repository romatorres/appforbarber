import * as React from 'react';

interface EmployeeInviteEmailProps {
  employeeName: string;
  companyName: string;
  temporaryPassword: string;
  loginUrl: string;
}

export const EmployeeInviteEmail: React.FC<EmployeeInviteEmailProps> = ({
  employeeName,
  companyName,
  temporaryPassword,
  loginUrl,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Convite para acessar o sistema</title>
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2563eb', marginBottom: '10px' }}>
            🎉 Bem-vindo ao App For Barber!
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Você foi convidado para acessar o sistema
          </p>
        </div>

        {/* Content */}
        <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Olá <strong>{employeeName}</strong>,
          </p>
          
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Você foi cadastrado como funcionário da empresa <strong>{companyName}</strong> 
            e agora tem acesso ao nosso sistema de gestão.
          </p>

          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Com o sistema você poderá:
          </p>

          <ul style={{ fontSize: '16px', marginBottom: '20px', paddingLeft: '20px' }}>
            <li>Visualizar seus agendamentos</li>
            <li>Gerenciar sua agenda</li>
            <li>Acompanhar suas comissões</li>
            <li>Atualizar suas informações</li>
          </ul>
        </div>

        {/* Credentials */}
        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#92400e', marginTop: '0', marginBottom: '15px' }}>
            🔐 Suas credenciais de acesso:
          </h3>
          
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '6px', fontFamily: 'monospace' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Email:</strong> {/* O email será inserido automaticamente */}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Senha temporária:</strong> <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{temporaryPassword}</code>
            </p>
          </div>

          <p style={{ fontSize: '14px', color: '#92400e', marginTop: '15px', marginBottom: '0' }}>
            ⚠️ <strong>Importante:</strong> Altere sua senha no primeiro acesso por segurança.
          </p>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a 
            href={loginUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Acessar Sistema
          </a>
        </div>

        {/* Instructions */}
        <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
          <h3 style={{ color: '#475569', marginTop: '0', marginBottom: '15px' }}>
            📋 Como fazer o primeiro acesso:
          </h3>
          
          <ol style={{ fontSize: '14px', color: '#64748b', paddingLeft: '20px' }}>
            <li>Clique no botão "Acessar Sistema" acima</li>
            <li>Digite seu email e a senha temporária</li>
            <li>Você será solicitado a criar uma nova senha</li>
            <li>Pronto! Agora você pode usar o sistema</li>
          </ol>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>
            Este convite foi enviado por <strong>{companyName}</strong>
          </p>
          
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            Se você não esperava este email, pode ignorá-lo com segurança.
          </p>
          
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '15px' }}>
            © 2024 App For Barber - Sistema de Gestão para Barbearias e Salões
          </p>
        </div>
      </div>
    </body>
  </html>
);

interface SystemAccessGrantedEmailProps {
  employeeName: string;
  companyName: string;
  loginUrl: string;
}

export const SystemAccessGrantedEmail: React.FC<SystemAccessGrantedEmailProps> = ({
  employeeName,
  companyName,
  loginUrl,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Acesso ao sistema concedido</title>
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#059669', marginBottom: '10px' }}>
            🎉 Acesso Concedido!
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Você agora tem acesso ao sistema
          </p>
        </div>

        {/* Content */}
        <div style={{ backgroundColor: '#f0fdf4', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Olá <strong>{employeeName}</strong>,
          </p>
          
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Ótimas notícias! Você agora tem acesso ao sistema da <strong>{companyName}</strong>.
          </p>

          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Você pode fazer login usando seu email cadastrado e a senha que você já possui.
          </p>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a 
            href={loginUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#059669',
              color: '#ffffff',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Fazer Login
          </a>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>
            Acesso concedido por <strong>{companyName}</strong>
          </p>
          
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '15px' }}>
            © 2024 App For Barber - Sistema de Gestão para Barbearias e Salões
          </p>
        </div>
      </div>
    </body>
  </html>
);

interface SystemAccessRevokedEmailProps {
  employeeName: string;
  companyName: string;
}

export const SystemAccessRevokedEmail: React.FC<SystemAccessRevokedEmailProps> = ({
  employeeName,
  companyName,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Acesso ao sistema removido</title>
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#dc2626', marginBottom: '10px' }}>
            🔒 Acesso Removido
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Seu acesso ao sistema foi removido
          </p>
        </div>

        {/* Content */}
        <div style={{ backgroundColor: '#fef2f2', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Olá <strong>{employeeName}</strong>,
          </p>
          
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Informamos que seu acesso ao sistema da <strong>{companyName}</strong> foi removido.
          </p>

          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            Você não poderá mais fazer login no sistema. Se acredita que isso foi um erro, 
            entre em contato com seu supervisor.
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>
            Alteração realizada por <strong>{companyName}</strong>
          </p>
          
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '15px' }}>
            © 2024 App For Barber - Sistema de Gestão para Barbearias e Salões
          </p>
        </div>
      </div>
    </body>
  </html>
);