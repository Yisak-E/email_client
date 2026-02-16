import nodemailer, { Transporter } from 'nodemailer';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from?: string;
}

interface MailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
  replyTo?: string;
}

let transporter: Transporter | null = null;
let smtpConfig: SmtpConfig | null = null;

export async function configureSMTP(config: SmtpConfig) {
  try {
    smtpConfig = config;
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    return { success: true, message: 'SMTP configured and verified' };
  } catch (error) {
    console.error('❌ SMTP configuration failed:', error);
    throw error;
  }
}

export async function sendEmail(mailOptions: MailOptions) {
  if (!transporter) {
    throw new Error('SMTP not configured. Please configure SMTP first.');
  }

  try {
    const from = smtpConfig?.from || smtpConfig?.auth.user;

    const info = await transporter.sendMail({
      from,
      to: mailOptions.to,
      cc: mailOptions.cc,
      bcc: mailOptions.bcc,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      attachments: mailOptions.attachments,
      replyTo: mailOptions.replyTo,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

export function isConfigured() {
  return transporter !== null;
}

export function getSmtpConfig() {
  return smtpConfig;
}
