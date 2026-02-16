import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('emailAPI', {
  // IMAP/Fetch Email functions
  connectImap: (config: any) => ipcRenderer.invoke('imap:connect', config),
  disconnectImap: () => ipcRenderer.invoke('imap:disconnect'),
  listFolders: () => ipcRenderer.invoke('imap:listFolders'),
  listEmails: (folder: string, options?: any) => ipcRenderer.invoke('imap:listEmails', folder, options),
  getEmail: (folder: string, uid: number) => ipcRenderer.invoke('imap:getEmail', folder, uid),
  deleteEmail: (folder: string, uid: number) => ipcRenderer.invoke('imap:deleteEmail', folder, uid),
  moveEmail: (folder: string, uid: number, targetFolder: string) => ipcRenderer.invoke('imap:moveEmail', folder, uid, targetFolder),
  
  // Nodemailer functions
  configureSMTP: (config: any) => ipcRenderer.invoke('mail:configureSMTP', config),
  sendEmail: (mailOptions: any) => ipcRenderer.invoke('mail:sendEmail', mailOptions),
  
  // Utility functions
  parseEmail: (emailData: any) => ipcRenderer.invoke('mail:parseEmail', emailData),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:getSettings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:saveSettings', settings),
});

declare global {
  interface Window {
    emailAPI: {
      connectImap: (config: any) => Promise<any>;
      disconnectImap: () => Promise<void>;
      listFolders: () => Promise<string[]>;
      listEmails: (folder: string, options?: any) => Promise<any[]>;
      getEmail: (folder: string, uid: number) => Promise<any>;
      deleteEmail: (folder: string, uid: number) => Promise<void>;
      moveEmail: (folder: string, uid: number, targetFolder: string) => Promise<void>;
      configureSMTP: (config: any) => Promise<void>;
      sendEmail: (mailOptions: any) => Promise<any>;
      parseEmail: (emailData: any) => Promise<any>;
      getSettings: () => Promise<any>;
      saveSettings: (settings: any) => Promise<void>;
    };
  }
}
