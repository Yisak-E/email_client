/**
 * Global type definitions for window.electronAPI
 * This file ensures TypeScript is aware of the IPC API exposed by the preload script
 */

declare global {
  interface Window {
    electronAPI: {
      // IMAP/Fetch Email functions
      connectImap: (config: ImapConfig) => Promise<{ success: boolean; message: string }>;
      disconnectImap: () => Promise<void>;
      listFolders: () => Promise<string[]>;
      fetchEmails: (options?: FetchEmailsOptions) => Promise<FetchEmailsResult>;
      getEmail: (folder: string, uid: number) => Promise<Email>;
      deleteEmail: (folder: string, uid: number) => Promise<void>;
      moveEmail: (folder: string, uid: number, targetFolder: string) => Promise<void>;
      
      // SMTP/Nodemailer functions
      configureSMTP: (config: SmtpConfig) => Promise<void>;
      sendEmail: (mailOptions: MailOptions) => Promise<SendEmailResult>;
      
      // Utility functions
      parseEmail: (emailData: any) => Promise<ParsedEmail>;
      
      // Settings
      getSettings: () => Promise<AppSettings>;
      getAutoConfig: () => Promise<AutoConfigResult>;
      saveSettings: (settings: AppSettings) => Promise<void>;
      
      // Folder operations
      getFolders: () => Promise<string[]>;
    };
  }
}

/**
 * IMAP Configuration Interface
 */
export interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * SMTP Configuration Interface
 */
export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Mail sending options
 */
export interface MailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

/**
 * Email attachment
 */
export interface Attachment {
  filename: string;
  path?: string;
  content?: Buffer | string;
  encoding?: string;
  contentType?: string;
}

/**
 * Envelope information from IMAP
 */
export interface Envelope {
  date?: Date;
  subject?: string;
  from?: { name?: string; address?: string }[];
  sender?: { name?: string; address?: string }[];
  replyTo?: { name?: string; address?: string }[];
  to?: { name?: string; address?: string }[];
  cc?: { name?: string; address?: string }[];
  bcc?: { name?: string; address?: string }[];
  inReplyTo?: string;
  messageId?: string;
}

/**
 * Email message from IMAP
 */
export interface Email {
  uid: number;
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  date?: Date;
  attachments?: Attachment[];
  envelope?: Envelope;
}

/**
 * Parsed email from mailparser
 */
export interface ParsedEmail {
  uid?: number;
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  date?: Date;
  attachments?: Attachment[];
}

/**
 * Fetch emails request options
 */
export interface FetchEmailsOptions {
  folder?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch emails response
 */
export interface FetchEmailsResult {
  emails: Email[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Send email response
 */
export interface SendEmailResult {
  success: boolean;
  message?: string;
  messageId?: string;
  response?: string;
}

/**
 * Application settings
 */
export interface AppSettings {
  [key: string]: any;
  // Add specific settings as needed
  imapProvider?: 'gmail' | 'outlook' | 'custom';
  autoFetchInterval?: number;  // milliseconds
  prefetchSize?: number;
  enableNotifications?: boolean;
}

export interface AutoConfigResult {
  provider: 'gmail' | 'outlook';
  hasGmailCredentials: boolean;
  gmail: {
    imap: ImapConfig;
    smtp: SmtpConfig;
  };
}

export {};
