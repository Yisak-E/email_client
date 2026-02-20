import Imap = require('imap');
import { simpleParser } from 'mailparser';
import type { Readable } from 'stream';

interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  rejectUnauthorized?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ParsedEmail {
  uid: number;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  date: Date;
  attachments: any[];
}

type ListEmailsOptions = { limit?: number; offset?: number };

type ListEmailsResult = {
  emails: Array<{
    uid: number;
    from?: string;
    to?: string;
    subject?: string;
    date?: Date;
    text?: string;
  }>;
  total: number;
  limit: number;
  offset: number;
};

let imap: Imap | null = null;

function normalizeHeaderValue(value?: string[]): string {
  return Array.isArray(value) && value.length > 0 ? value[0] : '';
}

function getRecipientText(parsedTo: any): string {
  if (!parsedTo) return '';
  if (typeof parsedTo.text === 'string') return parsedTo.text;
  if (Array.isArray(parsedTo)) {
    return parsedTo
      .map((entry) => entry?.address || entry?.name)
      .filter(Boolean)
      .join(', ');
  }
  if (Array.isArray(parsedTo.value)) {
    return parsedTo.value
      .map((entry: any) => entry?.address || entry?.name)
      .filter(Boolean)
      .join(', ');
  }
  return '';
}

export async function connectImap(config: ImapConfig) {
  return new Promise<{ success: boolean; message: string }>((resolve, reject) => {
    if (imap) {
      console.log('ℹ️ IMAP already connected, skipping duplicate connection');
      resolve({ success: true, message: 'Already connected to IMAP server' });
      return;
    }

    const client = new Imap({
      user: config.auth.user,
      password: config.auth.pass,
      host: config.host,
      port: config.port,
      tls: config.secure,
      tlsOptions: config.secure
        ? {
          rejectUnauthorized: config.rejectUnauthorized ?? true,
          servername: config.host,
        }
        : undefined,
    });

    let settled = false;
    const settleError = (err: Error) => {
      if (settled) return;
      settled = true;
      imap = null;
      reject(err);
    };

    const settleSuccess = () => {
      if (settled) return;
      settled = true;
      imap = client;
      resolve({ success: true, message: 'Connected to IMAP server' });
    };

    client.once('ready', () => {
      client.openBox('INBOX', true, (err) => {
        if (err) {
          console.error('❌ IMAP connection failed:', err);
          client.end();
          settleError(err);
          return;
        }
        console.log('✅ IMAP connected successfully');
        settleSuccess();
      });
    });

    client.once('error', (err) => {
      console.error('❌ IMAP error:', err);
      settleError(err);
    });

    client.once('end', () => {
      console.log('ℹ️ IMAP connection ended');
      if (imap === client) {
        imap = null;
      }
    });

    client.connect();
  });
}

export async function disconnectImap() {
  return new Promise<void>((resolve) => {
    if (!imap) {
      resolve();
      return;
    }

    const client = imap;
    const finish = () => {
      if (imap === client) {
        imap = null;
      }
      console.log('✅ IMAP disconnected');
      resolve();
    };

    client.once('end', finish);
    client.once('error', () => finish());
    client.end();
  });
}

export async function listFolders(): Promise<string[]> {
  if (!imap) throw new Error('IMAP not connected');

  return new Promise<string[]>((resolve, reject) => {
    imap!.getBoxes((err, boxes) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(Object.keys(boxes));
    });
  });
}

export async function listEmails(folder: string, options?: ListEmailsOptions): Promise<ListEmailsResult> {
  if (!imap) throw new Error('IMAP not connected');

  return new Promise<ListEmailsResult>((resolve, reject) => {
    imap!.openBox(folder, true, (err, box) => {
      if (err) {
        reject(err);
        return;
      }

      const limit = options?.limit || 20;
      const offset = options?.offset || 0;
      const totalMessages = box.messages.total;

      if (totalMessages === 0) {
        resolve({ emails: [], total: 0, limit, offset });
        return;
      }

      const startSeq = Math.max(1, totalMessages - offset - limit + 1);
      const endSeq = Math.max(1, totalMessages - offset);

      const emails: ListEmailsResult['emails'] = [];
      const fetcher = imap!.seq.fetch(`${startSeq}:${endSeq}`, {
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      });

      fetcher.on('message', (msg, seqno) => {
        let attributes: any = {};
        let header: any = {};

        msg.on('attributes', (attrs) => {
          attributes = attrs;
        });

        msg.on('body', (stream: Readable) => {
          let buffer = '';
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });
          stream.on('end', () => {
            header = Imap.parseHeader(buffer);
          });
        });

        msg.on('end', () => {
          const subject = normalizeHeaderValue(header.subject) || '(No Subject)';
          const from = normalizeHeaderValue(header.from);
          const to = normalizeHeaderValue(header.to);
          const dateValue = normalizeHeaderValue(header.date);
          const date = dateValue ? new Date(dateValue) : attributes.date || new Date();

          const uid = typeof attributes.uid === 'number' ? attributes.uid : seqno;

          emails.push({
            uid,
            from,
            to,
            subject,
            date,
            text: '',
          });
        });
      });

      fetcher.once('error', (fetchErr) => reject(fetchErr));
      fetcher.once('end', () => {
        console.log(`📬 Fetched ${emails.length}/${totalMessages} emails from ${folder}`);
        resolve({ emails, total: totalMessages, limit, offset });
      });
    });
  });
}

export async function getEmail(folder: string, uid: number): Promise<ParsedEmail> {
  if (!imap) throw new Error('IMAP not connected');

  return new Promise<ParsedEmail>((resolve, reject) => {
    imap!.openBox(folder, true, (err) => {
      if (err) {
        reject(err);
        return;
      }

      const fetcher = imap!.fetch(uid, { bodies: '' });
      let emailData: ParsedEmail | null = null;
      let parsePromise: Promise<void> | null = null;

      fetcher.on('message', (msg) => {
        msg.on('body', (stream: any) => {
          parsePromise = new Promise((resolveParse, rejectParse) => {
            simpleParser(stream as any, (parseErr, parsed) => {
              if (parseErr) {
                rejectParse(parseErr);
                return;
              }
              emailData = {
                uid,
                from: parsed.from?.text || '',
                to: getRecipientText(parsed.to),
                subject: parsed.subject || '(No Subject)',
                text: parsed.text || '',
                html: parsed.html || '',
                date: parsed.date || new Date(),
                attachments: parsed.attachments || [],
              };
              resolveParse();
            });
          });
        });
      });

      fetcher.once('error', (fetchErr) => reject(fetchErr));
      fetcher.once('end', () => {
        if (!parsePromise) {
          reject(new Error(`Message with UID ${uid} not found`));
          return;
        }

        parsePromise
          .then(() => {
            if (emailData) {
              resolve(emailData);
            } else {
              reject(new Error(`Message with UID ${uid} not found`));
            }
          })
          .catch((parseErr) => reject(parseErr));
      });
    });
  });
}

export async function deleteEmail(folder: string, uid: number) {
  if (!imap) throw new Error('IMAP not connected');

  return new Promise<{ success: boolean }>((resolve, reject) => {
    imap!.openBox(folder, false, (err) => {
      if (err) {
        reject(err);
        return;
      }

      imap!.addFlags(uid, ['\\Deleted'], (flagErr) => {
        if (flagErr) {
          reject(flagErr);
          return;
        }

        imap!.expunge((expungeErr) => {
          if (expungeErr) {
            reject(expungeErr);
            return;
          }
          console.log(`✅ Email UID ${uid} deleted from ${folder}`);
          resolve({ success: true });
        });
      });
    });
  });
}

export async function moveEmail(folder: string, uid: number, targetFolder: string) {
  if (!imap) throw new Error('IMAP not connected');

  return new Promise<{ success: boolean }>((resolve, reject) => {
    imap!.openBox(folder, false, (err) => {
      if (err) {
        reject(err);
        return;
      }

      imap!.move(uid, targetFolder, (moveErr) => {
        if (moveErr) {
          reject(moveErr);
          return;
        }
        console.log(`✅ Email UID ${uid} moved from ${folder} to ${targetFolder}`);
        resolve({ success: true });
      });
    });
  });
}

export function isConnected() {
  return imap !== null;
}

export async function fetchEmails(folder: string, limit?: number, offset?: number) {
  return listEmails(folder, { limit, offset });
}