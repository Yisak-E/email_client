import { contextBridge, ipcRenderer } from 'electron';

/**
 * Type definitions for IPC API
 */
interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface MailOptions {
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

interface FetchEmailsOptions {
  folder?: string;
  limit?: number;
  offset?: number;
}

interface EmailAPI {
  // IMAP/Fetch Email functions
  connectImap: (config: ImapConfig) => Promise<{ success: boolean; message: string }>;
  disconnectImap: () => Promise<void>;
  listFolders: () => Promise<string[]>;
  fetchEmails: (options?: FetchEmailsOptions) => Promise<any>;
  getEmail: (folder: string, uid: number) => Promise<any>;
  deleteEmail: (folder: string, uid: number) => Promise<void>;
  moveEmail: (folder: string, uid: number, targetFolder: string) => Promise<void>;
  
  // SMTP/Nodemailer functions
  configureSMTP: (config: SmtpConfig) => Promise<void>;
  sendEmail: (mailOptions: MailOptions) => Promise<any>;
  
  // Utility functions
  parseEmail: (emailData: any) => Promise<any>;
  
  // Settings
  getSettings: () => Promise<Record<string, any>>;
  saveSettings: (settings: Record<string, any>) => Promise<void>;
  
  // Folder operations
  getFolders: () => Promise<string[]>;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // IMAP/Fetch Email functions
  connectImap: (config: ImapConfig) => ipcRenderer.invoke('imap:connect', config),
  disconnectImap: () => ipcRenderer.invoke('imap:disconnect'),
  listFolders: () => ipcRenderer.invoke('imap:listFolders'),
  fetchEmails: (options?: FetchEmailsOptions) => 
    ipcRenderer.invoke('imap:listEmails', options?.folder || 'INBOX', {
      limit: options?.limit || 20,
      offset: options?.offset || 0,
    }),
  getEmail: (folder: string, uid: number) => ipcRenderer.invoke('imap:getEmail', folder, uid),
  deleteEmail: (folder: string, uid: number) => ipcRenderer.invoke('imap:deleteEmail', folder, uid),
  moveEmail: (folder: string, uid: number, targetFolder: string) => 
    ipcRenderer.invoke('imap:moveEmail', folder, uid, targetFolder),
  
  // SMTP/Nodemailer functions
  configureSMTP: (config: SmtpConfig) => ipcRenderer.invoke('mail:configureSMTP', config),
  sendEmail: (mailOptions: MailOptions) => ipcRenderer.invoke('mail:sendEmail', mailOptions),
  
  // Utility functions
  parseEmail: (emailData: any) => ipcRenderer.invoke('mail:parseEmail', emailData),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:getSettings'),
  saveSettings: (settings: Record<string, any>) => ipcRenderer.invoke('settings:saveSettings', settings),
  
  // Folder operations stub
  getFolders: () => ipcRenderer.invoke('imap:listFolders'),
});

declare global {
  interface Window {
    electronAPI: EmailAPI;
  }
}
