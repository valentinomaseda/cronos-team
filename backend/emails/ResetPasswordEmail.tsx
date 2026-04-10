import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  nombre: string;
  resetUrl: string;
}

export const ResetPasswordEmail = ({
  nombre,
  resetUrl,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Recupera tu contraseña en Adrenalina Extrema</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>
            ADRENALINA EXTREMA
          </Heading>
        </Section>
        
        <Section style={content}>
          <Heading style={h2}>
            Recuperación de Contraseña
          </Heading>
          
          <Text style={text}>
            Hola {nombre},
          </Text>
          
          <Text style={text}>
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, puedes ignorar este email de forma segura.
          </Text>
          
          <Text style={text}>
            Para crear una nueva contraseña, haz clic en el botón de abajo:
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              RESTABLECER CONTRASEÑA
            </Button>
          </Section>
          
          <Text style={text}>
            O copia y pega este enlace en tu navegador:
          </Text>
          <Link href={resetUrl} style={link}>
            {resetUrl}
          </Link>
          
          <Section style={warningBox}>
            <Text style={warningText}>
              ⚠️ Este enlace expirará en 1 hora por seguridad.
            </Text>
          </Section>
          
          <Text style={footerText}>
            Si no solicitaste restablecer tu contraseña, ignora este email. Tu contraseña permanecerá sin cambios.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            © 2026 Adrenalina Extrema. Todos los derechos reservados.
          </Text>
          <Text style={footerText}>
            Por tu seguridad, nunca compartas este enlace con nadie.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

ResetPasswordEmail.PreviewProps = {
  nombre: 'Juan Pérez',
  resetUrl: 'https://adrenalina-extrema.com/reset-password?token=xyz789',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

// Estilos inline para máxima compatibilidad con clientes de email
const main = {
  backgroundColor: '#0a0e1a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#00BFFF',
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#0a0e1a',
  fontSize: '32px',
  fontWeight: '900',
  margin: '0',
  padding: '0',
  letterSpacing: '2px',
};

const content = {
  backgroundColor: '#1a2942',
  padding: '40px 30px',
  margin: '0',
};

const h2 = {
  color: '#F3F4F6',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 20px',
};

const text = {
  color: '#F3F4F6',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const footerText = {
  color: '#9CA3AF',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#00BFFF',
  borderRadius: '8px',
  color: '#0a0e1a',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
  letterSpacing: '1px',
};

const link = {
  color: '#00BFFF',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const warningBox = {
  backgroundColor: '#1E40AF',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const warningText = {
  color: '#F3F4F6',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px 30px',
};
