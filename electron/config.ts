/**
 * Environment configuration loader for Electron main process
 * Loads credentials from .env file and provides typed access
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { getEnvValue, parseBoolean } from './utils/envUtils';

function loadEnvFile() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../../.env'),
  ];

  const existingPath = envPaths.find((candidate) => fs.existsSync(candidate));
  if (existingPath) {
    dotenv.config({ path: existingPath });
  }
}

loadEnvFile();



export interface ImapCredentials {
  host: string;
  port: number;
  secure: boolean;
  rejectUnauthorized: boolean;
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
  const gmailImapUser = getEnvValue('VITE_GMAIL_IMAP_USER', 'GMAIL_IMAP_USER');
  const gmailImapPass = getEnvValue('VITE_GMAIL_IMAP_PASS', 'GMAIL_IMAP_PASS');
  const gmailSmtpUser = getEnvValue('VITE_GMAIL_SMTP_USER', 'GMAIL_SMTP_USER');
  const gmailSmtpPass = getEnvValue('VITE_GMAIL_SMTP_PASS', 'GMAIL_SMTP_PASS');

  const resolvedGmailUser = gmailImapUser || gmailSmtpUser;
  const resolvedGmailPass = gmailImapPass || gmailSmtpPass;

  return {
    gmail: {
      imap: {
        host: getEnvValue('VITE_GMAIL_IMAP_HOST', 'GMAIL_IMAP_HOST', 'imap.gmail.com'),
        port: parseInt(getEnvValue('VITE_GMAIL_IMAP_PORT', 'GMAIL_IMAP_PORT', '993'), 10),
        secure: parseBoolean(getEnvValue('VITE_GMAIL_IMAP_SECURE', 'GMAIL_IMAP_SECURE', 'true'), true),
        rejectUnauthorized: parseBoolean(
          getEnvValue('VITE_GMAIL_IMAP_REJECT_UNAUTHORIZED', 'GMAIL_IMAP_REJECT_UNAUTHORIZED', 'true'),
          true
        ),
        auth: {
          user: resolvedGmailUser,
          pass: resolvedGmailPass,
        },
      },
      smtp: {
        host: getEnvValue('VITE_GMAIL_SMTP_HOST', 'GMAIL_SMTP_HOST', 'smtp.gmail.com'),
        port: parseInt(getEnvValue('VITE_GMAIL_SMTP_PORT', 'GMAIL_SMTP_PORT', '587'), 10),
        secure: parseBoolean(getEnvValue('VITE_GMAIL_SMTP_SECURE', 'GMAIL_SMTP_SECURE', 'false'), false),
        auth: {
          user: resolvedGmailUser,
          pass: resolvedGmailPass,
        },
      },
    },
    outlook: {
      imap: {
        host: getEnvValue('VITE_OUTLOOK_IMAP_HOST', 'OUTLOOK_IMAP_HOST', 'imap-mail.outlook.com'),
        port: parseInt(getEnvValue('VITE_OUTLOOK_IMAP_PORT', 'OUTLOOK_IMAP_PORT', '993'), 10),
        secure: parseBoolean(getEnvValue('VITE_OUTLOOK_IMAP_SECURE', 'OUTLOOK_IMAP_SECURE', 'true'), true),
        rejectUnauthorized: parseBoolean(
          getEnvValue('VITE_OUTLOOK_IMAP_REJECT_UNAUTHORIZED', 'OUTLOOK_IMAP_REJECT_UNAUTHORIZED', 'true'),
          true
        ),
        auth: {
          user: getEnvValue('VITE_OUTLOOK_IMAP_USER', 'OUTLOOK_IMAP_USER'),
          pass: getEnvValue('VITE_OUTLOOK_IMAP_PASS', 'OUTLOOK_IMAP_PASS'),
        },
      },
      smtp: {
        host: getEnvValue('VITE_OUTLOOK_SMTP_HOST', 'OUTLOOK_SMTP_HOST', 'smtp-mail.outlook.com'),
        port: parseInt(getEnvValue('VITE_OUTLOOK_SMTP_PORT', 'OUTLOOK_SMTP_PORT', '587'), 10),
        secure: parseBoolean(getEnvValue('VITE_OUTLOOK_SMTP_SECURE', 'OUTLOOK_SMTP_SECURE', 'false'), false),
        auth: {
          user: getEnvValue('VITE_OUTLOOK_SMTP_USER', 'OUTLOOK_SMTP_USER'),
          pass: getEnvValue('VITE_OUTLOOK_SMTP_PASS', 'OUTLOOK_SMTP_PASS'),
        },
      },
    },
    app: {
      name: getEnvValue('VITE_APP_NAME', 'APP_NAME', 'Email Client'),
      version: getEnvValue('VITE_APP_VERSION', 'APP_VERSION', '1.0.0'),
      logLevel: getEnvValue('VITE_LOG_LEVEL', 'LOG_LEVEL', 'info'),
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
