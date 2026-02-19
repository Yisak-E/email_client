/**
 * Environment configuration loader for Electron main process
 * Loads credentials from .env file and provides typed access
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env file
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

export interface ImapCredentials {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SmtpCredentials {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface AppConfig {
  gmail: {
    imap: ImapCredentials;
    smtp: SmtpCredentials;
  };
  outlook: {
    imap: ImapCredentials;
    smtp: SmtpCredentials;
  };
  app: {
    name: string;
    version: string;
    logLevel: string;
  };
}

/**
 * Parse environment variables and return typed config
 */
function getConfig(): AppConfig {
  return {
    gmail: {
      imap: {
        host: process.env.VITE_GMAIL_IMAP_HOST || 'imap.gmail.com',
        port: parseInt(process.env.VITE_GMAIL_IMAP_PORT || '993', 10),
        secure: process.env.VITE_GMAIL_IMAP_SECURE === 'true',
        auth: {
          user: process.env.VITE_GMAIL_IMAP_USER || '',
          pass: process.env.VITE_GMAIL_IMAP_PASS || '',
        },
      },
      smtp: {
        host: process.env.VITE_GMAIL_SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.VITE_GMAIL_SMTP_PORT || '587', 10),
        secure: process.env.VITE_GMAIL_SMTP_SECURE === 'false',
        auth: {
          user: process.env.VITE_GMAIL_SMTP_USER || '',
          pass: process.env.VITE_GMAIL_SMTP_PASS || '',
        },
      },
    },
    outlook: {
      imap: {
        host: process.env.VITE_OUTLOOK_IMAP_HOST || 'imap-mail.outlook.com',
        port: parseInt(process.env.VITE_OUTLOOK_IMAP_PORT || '993', 10),
        secure: process.env.VITE_OUTLOOK_IMAP_SECURE === 'true',
        auth: {
          user: process.env.VITE_OUTLOOK_IMAP_USER || '',
          pass: process.env.VITE_OUTLOOK_IMAP_PASS || '',
        },
      },
      smtp: {
        host: process.env.VITE_OUTLOOK_SMTP_HOST || 'smtp-mail.outlook.com',
        port: parseInt(process.env.VITE_OUTLOOK_SMTP_PORT || '587', 10),
        secure: process.env.VITE_OUTLOOK_SMTP_SECURE === 'false',
        auth: {
          user: process.env.VITE_OUTLOOK_SMTP_USER || '',
          pass: process.env.VITE_OUTLOOK_SMTP_PASS || '',
        },
      },
    },
    app: {
      name: process.env.VITE_APP_NAME || 'Email Client',
      version: process.env.VITE_APP_VERSION || '1.0.0',
      logLevel: process.env.VITE_LOG_LEVEL || 'info',
    },
  };
}

// Validate credentials
function validateCredentials(provider: 'gmail' | 'outlook', type: 'imap' | 'smtp'): boolean {
  const config = getConfig();
  const creds = config[provider][type];
  
  if (!creds.auth.user || !creds.auth.pass) {
    console.warn(`⚠️ Warning: ${provider} ${type.toUpperCase()} credentials not configured`);
    return false;
  }
  
  return true;
}

// Singleton for config instance
let configInstance: AppConfig | null = null;

export function getEmailConfig(): AppConfig {
  if (!configInstance) {
    configInstance = getConfig();
  }
  return configInstance;
}

export function validateAllCredentials(): { gmail: boolean; outlook: boolean } {
  return {
    gmail: validateCredentials('gmail', 'imap') && validateCredentials('gmail', 'smtp'),
    outlook: validateCredentials('outlook', 'imap') && validateCredentials('outlook', 'smtp'),
  };
}

export default getEmailConfig();
