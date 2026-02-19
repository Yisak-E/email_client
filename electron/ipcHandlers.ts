import { ipcMain, BrowserWindow } from 'electron';
import * as imapService from './services/imapService';
import * as nodemailerService from './services/nodemailerService';
import * as emailParser from './services/emailParser';
import { getEmailConfig } from './config';

const settings: Record<string, any> = {};

export function setupIpcHandlers(mainWindow: BrowserWindow | null) {
  // ============ IMAP Handlers ============
  ipcMain.handle('imap:connect', async (event, config) => {
    try {
      return await imapService.connectImap(config);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('imap:disconnect', async () => {
    try {
      await imapService.disconnectImap();
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('imap:listFolders', async () => {
    try {
      return await imapService.listFolders();
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('imap:listEmails', async (event, folder, options) => {
    try {
      return await imapService.listEmails(folder, options);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('imap:getEmail', async (event, folder, uid) => {
    try {
      return await imapService.getEmail(folder, uid);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('imap:deleteEmail', async (event, folder, uid) => {
    try {
      await imapService.deleteEmail(folder, uid);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('imap:moveEmail', async (event, folder, uid, targetFolder) => {
    try {
      await imapService.moveEmail(folder, uid, targetFolder);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  // ============ SMTP/Nodemailer Handlers ============
  ipcMain.handle('mail:configureSMTP', async (event, config) => {
    try {
      return await nodemailerService.configureSMTP(config);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  ipcMain.handle('mail:sendEmail', async (event, mailOptions) => {
    try {
      return await nodemailerService.sendEmail(mailOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  // ============ Email Parser Handlers ============
  ipcMain.handle('mail:parseEmail', async (event, emailData) => {
    try {
      return await emailParser.parseEmail(emailData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  // ============ Settings Handlers ============
  ipcMain.handle('settings:getSettings', async () => {
    return settings;
  });

  ipcMain.handle('settings:getAutoConfig', async () => {
    const config = getEmailConfig();
    const hasGmailCredentials = Boolean(
      config.gmail.imap.auth.user &&
      config.gmail.imap.auth.pass
    );

    return {
      provider: 'gmail',
      gmail: config.gmail,
      hasGmailCredentials,
    };
  });

  ipcMain.handle('settings:saveSettings', async (event, newSettings) => {
    Object.assign(settings, newSettings);
    if (mainWindow) {
      mainWindow.webContents.send('settings:updated', settings);
    }
    return { success: true };
  });
}
