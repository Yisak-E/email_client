/**
 * PRELOAD SCRIPT - IPC Bridge Layer (3-Layer Architecture)
 * 
 * Secure Communication Bridge between Main Process (Backend) and Renderer (Frontend)
 * - Enforces contextIsolation: true (secure)
 * - Enforces sandbox: true (secure)
 * - Only exposes whitelisted APIs
 * - Prevents access to Node.js internals from renderer
 * 
 * Layer Structure:
 * [Main Process] ←→ [Preload Script] ←→ [Renderer/React]
 *  (Backend)         (IPC Bridge)       (Frontend)
 */

import { contextBridge, ipcRenderer } from 'electron';

// ============================================================
// TYPE DEFINITIONS - API Contract
// ============================================================

export interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
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
// ELECTRON API - Main Process Interface
// ============================================================

export interface ElectronAPI {
  // Window Controls (Renderer → Main)
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  
  // IMAP Email Functions
  connectImap: (config: ImapConfig) => Promise<{ success: boolean; message: string }>;
  disconnectImap: () => Promise<void>;
  getFolders: () => Promise<string[]>;
  fetchEmails: (options: { folder: string; limit?: number; offset?: number }) => Promise<FetchEmailsResult>;
  getEmail: (folder: string, uid: number) => Promise<Email>;
  deleteEmail: (folder: string, uid: number) => Promise<{ success: boolean }>;
  moveEmail: (folder: string, uid: number, targetFolder: string) => Promise<{ success: boolean }>;
  
  // SMTP Email Functions
  configureSMTP: (config: SmtpConfig) => Promise<{ success: boolean; message: string }>;
  sendEmail: (mailOptions: MailOptions) => Promise<SendEmailResult>;
  
  // Settings Management
  getAutoConfig: () => Promise<AutoConfigResult>;
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: AppSettings) => Promise<{ success: boolean }>;
}

// ============================================================
// IPC BRIDGE IMPLEMENTATION
// ============================================================

const electronAPI: ElectronAPI = {
  // Window Controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  
  // IMAP Functions
  connectImap: (config: ImapConfig) => ipcRenderer.invoke('imap:connect', config),
  disconnectImap: () => ipcRenderer.invoke('imap:disconnect'),
  getFolders: () => ipcRenderer.invoke('imap:listFolders'),
  
  fetchEmails: (options: { folder: string; limit?: number; offset?: number }) =>
    ipcRenderer.invoke('imap:listEmails', options.folder, {
      limit: options.limit || 20,
      offset: options.offset || 0,
    }),
  
  getEmail: (folder: string, uid: number) =>
    ipcRenderer.invoke('imap:getEmail', folder, uid),
  
  deleteEmail: (folder: string, uid: number) =>
    ipcRenderer.invoke('imap:deleteEmail', folder, uid),
  
  moveEmail: (folder: string, uid: number, targetFolder: string) =>
    ipcRenderer.invoke('imap:moveEmail', folder, uid, targetFolder),
  
  // SMTP Functions
  configureSMTP: (config: SmtpConfig) =>
    ipcRenderer.invoke('mail:configureSMTP', config),
  
  sendEmail: (mailOptions: MailOptions) =>
    ipcRenderer.invoke('mail:sendEmail', mailOptions),
  
  // Settings
  getAutoConfig: () => ipcRenderer.invoke('settings:getAutoConfig'),
  getSettings: () => ipcRenderer.invoke('settings:getSettings'),
  saveSettings: (settings: AppSettings) =>
    ipcRenderer.invoke('settings:saveSettings', settings),
};

// ============================================================
// EXPOSE API TO RENDERER (contextBridge)
// ============================================================

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// ============================================================
// TYPE DECLARATIONS FOR WINDOW
// ============================================================

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// ============================================================
// MESSAGE LOGGING (Development)
// ============================================================

console.log('[Preload] IPC Bridge initialized');
console.log('[Preload] electronAPI exposed to renderer');
