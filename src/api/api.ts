// api.ts
/* 
  IPC-based Email API using Electron's contextBridge
  Uses ImapFlow (fetching) and Nodemailer (sending)
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

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from?: string;
}

export interface MailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
  replyTo?: string;
}

// ============ IMAP/ImapFlow Functions ============

/**
 * Connect to IMAP server
 */
export async function connectImap(config: ImapConfig) {
  try {
    const result = await window.emailAPI.connectImap(config);
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
    await window.emailAPI.disconnectImap();
    console.log("✅ IMAP disconnected");
  } catch (error) {
    console.error("❌ IMAP disconnection failed:", error);
    throw error;
  }
}

/**
 * List all folders from IMAP server
 */
export async function listFolders() {
  try {
    const folders = await window.emailAPI.listFolders();
    console.log("📁 Folders retrieved:", folders);
    return folders;
  } catch (error) {
    console.error("❌ Failed to list folders:", error);
    throw error;
  }
}

/**
 * List emails from a specific folder
 */
export async function listEmails(folder: string, options?: { limit?: number; offset?: number }) {
  try {
    const result = await window.emailAPI.listEmails(folder, options);
    console.log(`📧 Emails from ${folder}:`, result.emails.length);
    return result;
  } catch (error) {
    console.error("❌ Failed to list emails:", error);
    throw error;
  }
}

/**
 * Get a single email with full content
 */
export async function getEmail(folder: string, uid: number) {
  try {
    const email = await window.emailAPI.getEmail(folder, uid);
    console.log("✅ Email retrieved:", email.subject);
    return email;
  } catch (error) {
    console.error("❌ Failed to get email:", error);
    throw error;
  }
}

/**
 * Delete an email
 */
export async function deleteEmail(folder: string, uid: number) {
  try {
    await window.emailAPI.deleteEmail(folder, uid);
    console.log(`🗑️ Email UID ${uid} deleted from ${folder}`);
  } catch (error) {
    console.error("❌ Failed to delete email:", error);
    throw error;
  }
}

/**
 * Move email to another folder
 */
export async function moveEmail(folder: string, uid: number, targetFolder: string) {
  try {
    await window.emailAPI.moveEmail(folder, uid, targetFolder);
    console.log(`📬 Email UID ${uid} moved from ${folder} to ${targetFolder}`);
  } catch (error) {
    console.error("❌ Failed to move email:", error);
    throw error;
  }
}

// ============ SMTP/Nodemailer Functions ============

/**
 * Configure SMTP server
 */
export async function configureSMTP(config: SmtpConfig) {
  try {
    const result = await window.emailAPI.configureSMTP(config);
    console.log("✅ SMTP configured:", result);
    return result;
  } catch (error) {
    console.error("❌ SMTP configuration failed:", error);
    throw error;
  }
}

/**
 * Send an email using configured SMTP
 */
export async function sendEmail(mailOptions: MailOptions) {
  try {
    const result = await window.emailAPI.sendEmail(mailOptions);
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
 */
export async function parseEmail(emailData: any) {
  try {
    return await window.emailAPI.parseEmail(emailData);
  } catch (error) {
    console.error("❌ Failed to parse email:", error);
    throw error;
  }
}

// ============ Settings Functions ============

/**
 * Get saved settings
 */
export async function getSettings() {
  try {
    return await window.emailAPI.getSettings();
  } catch (error) {
    console.error("❌ Failed to get settings:", error);
    throw error;
  }
}

/**
 * Save settings
 */
export async function saveSettings(settings: any) {
  try {
    await window.emailAPI.saveSettings(settings);
    console.log("✅ Settings saved");
  } catch (error) {
    console.error("❌ Failed to save settings:", error);
    throw error;
  }
}
