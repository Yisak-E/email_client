/**
 * PRELOAD SCRIPT - IPC Bridge Layer (3-Layer Architecture)
 * 
 * Secure Communication Bridge between Main Process and Renderer
 * - Enforces contextIsolation: true
 * - Only exposes whitelisted APIs via contextBridge
 * - Prevents access to Node.js internals from renderer
 */

import { contextBridge, ipcRenderer } from 'electron';

// ============================================================
// Type Definitions - All Exposed to Renderer
// ============================================================

export interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  rejectUnauthorized?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
  }>;
}

export interface Email {
  uid: number;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  date: Date;
  attachments: any[];
}

export interface FetchEmailsResult {
  emails: Email[];
  total: number;
  limit: number;
  offset: number;
}

export interface AppSettings {
  imapProvider?: string;
  imapConfig?: ImapConfig;
  smtpConfig?: SmtpConfig;
}

export interface AutoConfigResult {
  provider: string;
  gmail: {
    imap: ImapConfig;
    smtp: SmtpConfig;
  };
  hasGmailCredentials: boolean;
}

export interface SendEmailResult {
  messageId: string;
}

// ============================================================
// ElectronAPI - Complete Whitelist of IPC Methods
// ============================================================

export interface ElectronAPI {
  // Window Controls
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  
  // IMAP Functions
  connectImap: (config: ImapConfig) => Promise<{ success: boolean; message: string }>;
  disconnectImap: () => Promise<void>;
  getFolders: () => Promise<string[]>;
  fetchEmails: (folder: string, limit?: number, offset?: number) => Promise<FetchEmailsResult>;
  getEmail: (folder: string, uid: number) => Promise<Email>;
  deleteEmail: (folder: string, uid: number) => Promise<{ success: boolean }>;
  moveEmail: (folder: string, uid: number, targetFolder: string) => Promise<{ success: boolean }>;
  
  // SMTP Functions
  configureSMTP: (config: SmtpConfig) => Promise<{ success: boolean; message: string }>;
  sendEmail: (mailOptions: MailOptions) => Promise<SendEmailResult>;
  
  // Attachment Functions
  downloadAttachment: (filename: string, content: string) => Promise<{ success: boolean; filepath?: string; error?: string }>;
  openDownloads: () => Promise<{ success: boolean; error?: string }>;
  
  // Settings Management
  getAutoConfig: () => Promise<AutoConfigResult>;
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: AppSettings) => Promise<{ success: boolean }>;
}

// ============================================================
// Expose Whitelisted API to Renderer via contextBridge
// ============================================================

contextBridge.exposeInMainWorld('electronAPI', {
  // Window Controls
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  
  // IMAP Functions
  connectImap: (config: ImapConfig) => ipcRenderer.invoke('imap:connect', config),
  disconnectImap: () => ipcRenderer.invoke('imap:disconnect'),
  getFolders: () => ipcRenderer.invoke('imap:listFolders'),
  fetchEmails: (folder: string, limit?: number, offset?: number) =>
    ipcRenderer.invoke('imap:listEmails', folder, { limit: limit || 20, offset: offset || 0 }),
  getEmail: (folder: string, uid: number) => ipcRenderer.invoke('imap:getEmail', folder, uid),
  deleteEmail: (folder: string, uid: number) => ipcRenderer.invoke('imap:deleteEmail', folder, uid),
  moveEmail: (folder: string, uid: number, targetFolder: string) =>
    ipcRenderer.invoke('imap:moveEmail', folder, uid, targetFolder),
  
  // SMTP Functions
  configureSMTP: (config: SmtpConfig) => ipcRenderer.invoke('mail:configureSMTP', config),
  sendEmail: (mailOptions: MailOptions) => ipcRenderer.invoke('mail:sendEmail', mailOptions),
  
  // Attachment Functions
  downloadAttachment: (filename: string, content: string) => 
    ipcRenderer.invoke('attachments:download', filename, content),
  openDownloads: () => ipcRenderer.invoke('attachments:openDownloads'),
  
  // Settings Management
  getAutoConfig: () => ipcRenderer.invoke('settings:getAutoConfig'),
  getSettings: () => ipcRenderer.invoke('settings:getSettings'),
  saveSettings: (settings: AppSettings) => ipcRenderer.invoke('settings:saveSettings', settings),
} as ElectronAPI);
