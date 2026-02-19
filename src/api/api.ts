// api.ts
/** 
  IPC-based Email API using Electron's contextBridge
  Uses ImapFlow (fetching) and Nodemailer (sending)
  
  This file provides a typed wrapper around window.electronAPI
  For type definitions, see src/types/electron.d.ts
*/

import type {
  ImapConfig,
  SmtpConfig,
  MailOptions,
  FetchEmailsOptions,
  FetchEmailsResult,
  Email,
  SendEmailResult,
  AppSettings,
} from '../types/electron';

// ============ IMAP/ImapFlow Functions ============

/**
 * Connect to IMAP server
 * @param config IMAP server configuration
 * @returns Connection result
 */
export async function connectImap(config: ImapConfig) {
  try {
    const result = await window.electronAPI.connectImap(config);
    console.log("✅ IMAP connected:", result);
    return result;
  } catch (error) {
    console.error("❌ IMAP connection failed:", error);
    throw error;
  }
}

/**
 * Disconnect from IMAP server
 */
export async function disconnectImap() {
  try {
    await window.electronAPI.disconnectImap();
    console.log("✅ IMAP disconnected");
  } catch (error) {
    console.error("❌ IMAP disconnection failed:", error);
    throw error;
  }
}

/**
 * List all folders from IMAP server
 * @returns Array of folder names
 */
export async function listFolders() {
  try {
    const folders = await window.electronAPI.getFolders();
    console.log("📁 Folders retrieved:", folders);
    return folders;
  } catch (error) {
    console.error("❌ Failed to list folders:", error);
    throw error;
  }
}

/**
 * List emails from a specific folder
 * @param folder Folder name (default: INBOX)
 * @param options Fetch options (limit, offset)
 * @returns Emails and metadata
 */
export async function listEmails(
  folder: string = 'INBOX',
  options?: { limit?: number; offset?: number }
): Promise<FetchEmailsResult> {
  try {
    const result = await window.electronAPI.fetchEmails({
      folder,
      limit: options?.limit || 20,
      offset: options?.offset || 0,
    });
    console.log(`📧 Emails from ${folder}:`, result.emails.length);
    return result;
  } catch (error) {
    console.error("❌ Failed to list emails:", error);
    throw error;
  }
}

/**
 * Get a single email with full content
 * @param folder Folder name
 * @param uid Email UID
 * @returns Full email with parsed content
 */
export async function getEmail(folder: string, uid: number): Promise<Email> {
  try {
    const email = await window.electronAPI.getEmail(folder, uid);
    console.log("✅ Email retrieved:", email.subject);
    return email;
  } catch (error) {
    console.error("❌ Failed to get email:", error);
    throw error;
  }
}

/**
 * Delete an email
 * @param folder Folder name
 * @param uid Email UID
 */
export async function deleteEmail(folder: string, uid: number) {
  try {
    await window.electronAPI.deleteEmail(folder, uid);
    console.log(`🗑️ Email UID ${uid} deleted from ${folder}`);
  } catch (error) {
    console.error("❌ Failed to delete email:", error);
    throw error;
  }
}

/**
 * Move email to another folder
 * @param folder Source folder name
 * @param uid Email UID
 * @param targetFolder Destination folder name
 */
export async function moveEmail(folder: string, uid: number, targetFolder: string) {
  try {
    await window.electronAPI.moveEmail(folder, uid, targetFolder);
    console.log(`📬 Email UID ${uid} moved from ${folder} to ${targetFolder}`);
  } catch (error) {
    console.error("❌ Failed to move email:", error);
    throw error;
  }
}

// ============ SMTP/Nodemailer Functions ============

/**
 * Configure SMTP server
 * @param config SMTP server configuration
 */
export async function configureSMTP(config: SmtpConfig) {
  try {
    const result = await window.electronAPI.configureSMTP(config);
    console.log("✅ SMTP configured:", result);
    return result;
  } catch (error) {
    console.error("❌ SMTP configuration failed:", error);
    throw error;
  }
}

/**
 * Send an email using configured SMTP
 * @param mailOptions Email options including to, subject, content, etc.
 * @returns Send result with message ID
 */
export async function sendEmail(mailOptions: MailOptions): Promise<SendEmailResult> {
  try {
    const result = await window.electronAPI.sendEmail(mailOptions);
    console.log("✅ Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
}

// ============ Email Parsing Functions ============

/**
 * Parse email data
 * @param emailData Raw email data
 * @returns Parsed email object
 */
export async function parseEmail(emailData: any) {
  try {
    return await window.electronAPI.parseEmail(emailData);
  } catch (error) {
    console.error("❌ Failed to parse email:", error);
    throw error;
  }
}

// ============ Settings Functions ============

/**
 * Get saved application settings
 * @returns Application settings object
 */
export async function getSettings(): Promise<AppSettings> {
  try {
    return await window.electronAPI.getSettings();
  } catch (error) {
    console.error("❌ Failed to get settings:", error);
    throw error;
  }
}

/**
 * Save application settings
 * @param settings Settings to save
 */
export async function saveSettings(settings: AppSettings) {
  try {
    await window.electronAPI.saveSettings(settings);
    console.log("✅ Settings saved");
  } catch (error) {
    console.error("❌ Failed to save settings:", error);
    throw error;
  }
}

// ============ Convenience Functions ============

/**
 * Fetch emails from INBOX
 * @param limit Number of emails to fetch
 * @returns Emails result
 */
export async function fetchInboxEmails(limit: number = 20): Promise<FetchEmailsResult> {
  return listEmails('INBOX', { limit });
}

/**
 * Fetch emails from a provider's default folder
 * Useful for Gmail, Outlook, etc.
 * @param folder Folder name
 * @param limit Number of emails
 * @returns Emails result
 */
export async function fetchEmails(
  folder: string = 'INBOX',
  limit: number = 20
): Promise<FetchEmailsResult> {
  return listEmails(folder, { limit });
}
