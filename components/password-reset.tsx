import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { ShoppingBag } from 'lucide-react';

interface ResetPasswordEmailTemplateProps {
    username?: string;
    updatedDate?: Date;
    resetPasswordLink?: string
}

export const ResetPasswordEmailTemplate = ({
  username,
  resetPasswordLink,
}: ResetPasswordEmailTemplateProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Confirm your email to complete your reset password 
      </Preview>
      <Container style={container}>
        <ShoppingBag size={32} style={logo} />
        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
            Someone recently requested a password change for your account. If this was you, you can set a new password here:
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={resetPasswordLink} target="_blank">
            Reset password
          </Button>
                </Section>
                <Text style={paragraph}>
            If you don't want to change your password or didn't request this, just ignore and delete this message.
        </Text>
                
        <Text style={paragraph}>
          Best regards,
          <br />
          <strong>The Developer Team</strong>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
            © 2025 E-commerce. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

ResetPasswordEmailTemplate.PreviewProps = {
  username: 'May',
  resetPasswordLink: 'https://example.com/reset-password',
} as ResetPasswordEmailTemplateProps;

export default ResetPasswordEmailTemplate;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
