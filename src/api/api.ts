// api.ts
/** 
  IPC-based Email API using Electron's contextBridge
  Uses ImapFlow (fetching) and Nodemailer (sending)
  
  This file provides a typed wrapper around window.electronAPI
  For type definitions, see src/types/electron.d.ts
  
  Note: This is ELECTRON-ONLY. It will NOT work in browser context.
  The app must be run via desktop Electron with npm run dev:electron
*/

import type {
  ImapConfig,
  SmtpConfig,
  MailOptions,
  FetchEmailsResult,
  Email,
  SendEmailResult,
  AppSettings,
  AutoConfigResult,
} from '../types/electron';

/**
 * State tracking for API availability
 */
let apiReadyPromise: Promise<any> | null = null;
let apiReady = false;

/**
 * Wait for Electron API to be available with retry logic
 * The preload script exposes electronAPI to window after context loads
 */
export function waitForElectronAPI(maxRetries = 50, delayMs = 100): Promise<void> {
  if (apiReady && window.electronAPI) {
    return Promise.resolve();
  }

  if (apiReadyPromise) {
    return apiReadyPromise;
  }

  apiReadyPromise = new Promise((resolve, reject) => {
    let retries = 0;

    const checkAPI = () => {
      if (typeof window !== 'undefined' && window.electronAPI) {
        console.log('✅ Electron API is now available');
        apiReady = true;
        resolve();
        return;
      }

      retries++;
      if (retries >= maxRetries) {
        const error = new Error(
          'Electron API unavailable. Run with: npm run dev:electron\n' +
          'The app requires Electron context with preload bridge enabled.'
        );
        console.error('❌', error.message);
        reject(error);
        return;
      }

      console.log(`⏳ Waiting for Electron API... (attempt ${retries}/${maxRetries})`);
      setTimeout(checkAPI, delayMs);
    };

    checkAPI();
  });

  return apiReadyPromise;
}

function getElectronApi() {
  if (typeof window === 'undefined') {
    throw new Error('window is not defined - not running in browser or Electron context');
  }

  if (!window.electronAPI) {
    throw new Error(
      '❌ Electron API unavailable.\n\n' +
      'This app requires Electron with preload bridge.\n' +
      'Run with: npm run dev:electron\n\n' +
      'Do NOT use "npm run dev" (browser-only mode).'
    );
  }

  return window.electronAPI;
}

function getElectronApiSafe() {
  if (typeof window === 'undefined' || !window.electronAPI) {
    return null;
  }

  return window.electronAPI;
}

// ============ IMAP/ImapFlow Functions ============

/**
 * Connect to IMAP server
 * @param config IMAP server configuration
 * @returns Connection result
 */
export async function connectImap(config: ImapConfig) {
  try {
    const result = await getElectronApi().connectImap(config);
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
    await getElectronApi().disconnectImap();
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
    const api = getElectronApiSafe();
    if (!api) {
      console.warn('Electron API unavailable. Returning empty folder list.');
      return [];
    }

    const folders = await api.getFolders();
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
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;
    const api = getElectronApiSafe();
    if (!api) {
      console.warn('Electron API unavailable. Returning empty email list.');
      return { emails: [], total: 0, limit, offset };
    }

    const result = await api.fetchEmails(folder, limit, offset);
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
    const email = await getElectronApi().getEmail(folder, uid);
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
    await getElectronApi().deleteEmail(folder, uid);
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
    await getElectronApi().moveEmail(folder, uid, targetFolder);
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
    const result = await getElectronApi().configureSMTP(config);
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
    const result = await getElectronApi().sendEmail(mailOptions);
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
    return await getElectronApi().parseEmail(emailData);
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
    return await getElectronApi().getSettings();
  } catch (error) {
    console.error("❌ Failed to get settings:", error);
    throw error;
  }
}

/**
 * Get auto email configuration from Electron main process (.env-backed)
 * Waits for Electron API to be available before attempting to fetch
 */
export async function getAutoConfig(): Promise<AutoConfigResult> {
  try {
    // Wait for Electron API to be ready
    await waitForElectronAPI();
    
    console.log('📧 Fetching auto config from Electron main process...');
    return await getElectronApi().getAutoConfig();
  } catch (error) {
    console.error("❌ Failed to get auto config:", error);
    throw error;
  }
}

/**
 * Save application settings
 * @param settings Settings to save
 */
export async function saveSettings(settings: AppSettings) {
  try {
    await getElectronApi().saveSettings(settings);
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
