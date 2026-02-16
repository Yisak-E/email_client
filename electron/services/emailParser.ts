import { simpleParser } from 'mailparser';

export interface ParsedEmail {
  from?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  text?: string;
  html?: string;
  date?: Date;
  messageId?: string;
  inReplyTo?: string;
  references?: string[];
  attachments: any[];
}

export async function parseEmail(emailSource: string | Buffer): Promise<ParsedEmail> {
  try {
    const parsed = await simpleParser(emailSource);

    return {
      from: Array.isArray(parsed.from) ? parsed.from.map(f => f.text).join(', ') : (parsed.from?.text || ''),
      to: Array.isArray(parsed.to) ? parsed.to.map(t => t.text).join(', ') : (parsed.to?.text || ''),
      cc: Array.isArray(parsed.cc) ? parsed.cc.map(c => c.text).join(', ') : (parsed.cc?.text || ''),
      bcc: Array.isArray(parsed.bcc) ? parsed.bcc.map(b => b.text).join(', ') : (parsed.bcc?.text || ''),
      subject: parsed.subject || '(No Subject)',
      text: parsed.text || '',
      html: parsed.html || '',
      date: parsed.date || new Date(),
      messageId: parsed.messageId || '',
      inReplyTo: parsed.inReplyTo || '',
      references: Array.isArray(parsed.references) ? parsed.references : (parsed.references ? [parsed.references] : []),
      attachments: parsed.attachments || [],
    };
  } catch (error) {
    console.error('Error parsing email:', error);
    throw error;
  }
}

export function decodeBase64(str: string): string {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding base64:', error);
    return str;
  }
}

export function encodeBase64(str: string): string {
  try {
    return Buffer.from(str).toString('base64');
  } catch (error) {
    console.error('Error encoding base64:', error);
    return str;
  }
}
