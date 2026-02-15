import type { MessageType } from "../types/MailType";

/**
 * Decode base64URL encoded string to UTF-8 text
 */
export const decodeBase64 = (str: string): string => {
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    return str;
  }
};

/**
 * Get a specific header value from an email message
 */
export const getHeader = (email: MessageType | undefined, name: string): string => {
  if (!email) {
    console.warn(`⚠️ getHeader called with undefined email for "${name}"`);
    return "";
  }
  
  if (!email.payload?.headers) {
    console.warn(`⚠️ Email has no headers - email id:`, email.id);
    return "";
  }
  
  const header = email.payload.headers.find((h) => h.name === name);
  const value = header?.value || "";
  
  // Log Subject extraction for debugging
  if (name === "Subject") {
    console.log(`✓ Subject found for email ${email.id}:`, value || "(No Subject)");
  }
  
  return value;
};

/**
 * Extract and decode the email body content from a message
 */
export const getEmailBody = (email: MessageType | undefined): string => {
  if (!email) return "";
  
  let emailBody = "";
  if (email.payload?.parts) {
    const textPart = email.payload.parts.find((part) => part.mimeType === "text/plain");
    if (textPart && textPart.body?.data) {
      emailBody = decodeBase64(
        textPart.body.data.replace(/\-/g, '+').replace(/_/g, '/')
      );
    }
  } else if (email.payload?.body?.data) {
    emailBody = decodeBase64(
      email.payload.body.data.replace(/\-/g, '+').replace(/_/g, '/')
    );
  }
  
  return emailBody || email.snippet || "";
};
