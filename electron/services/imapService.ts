import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

let imap: ImapFlow | null = null;

function getRecipientText(parsedTo: any): string {
  if (!parsedTo) {
    return '';
  }

  if (typeof parsedTo.text === 'string') {
    return parsedTo.text;
  }

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
  try {
    imap = new ImapFlow(config);
    await imap.connect();
    console.log('✅ IMAP connected successfully');
    return { success: true, message: 'Connected to IMAP server' };
  } catch (error) {
    console.error('❌ IMAP connection failed:', error);
    throw error;
  }
}

export async function disconnectImap() {
  if (imap) {
    await imap.close();
    imap = null;
    console.log('✅ IMAP disconnected');
  }
}

export async function listFolders() {
  if (!imap) throw new Error('IMAP not connected');

  const mailboxes = await imap.list();
  return mailboxes.map((box: any) => box.path);
}

export async function listEmails(folder: string, options?: { limit?: number; offset?: number }) {
  if (!imap) throw new Error('IMAP not connected');

  try {
    const lock = await imap.getMailboxLock(folder);
    
    try {
      const limit = options?.limit || 20;
      const offset = options?.offset || 0;

      // Get message count
      const mailbox = await imap.status(folder, { messages: true });
      const totalMessages = mailbox.messages || 0;

      // Fetch messages
      let messages = [];
      if (totalMessages > 0) {
        // Fetch from the end (newest first)
        const startSeq = Math.max(1, totalMessages - offset - limit + 1);
        const endSeq = Math.max(1, totalMessages - offset);

        for await (const message of imap.fetch(`${startSeq}:${endSeq}`, {
          envelope: true,
          bodyStructure: true,
          source: true,
        })) {
          messages.push({
            uid: message.uid,
            envelope: message.envelope,
            bodyStructure: message.bodyStructure,
            source: message.source,
          });
        }
      }

      return {
        emails: messages,
        total: totalMessages,
        limit,
        offset,
      };
    } finally {
      lock.release();
    }
  } catch (error) {
    console.error('Error listing emails:', error);
    throw error;
  }
}

export async function getEmail(folder: string, uid: number) {
  if (!imap) throw new Error('IMAP not connected');

  try {
    const lock = await imap.getMailboxLock(folder);

    try {
      const message = await imap.fetchOne(uid, { source: true });

      if (!message) {
        throw new Error(`Message with UID ${uid} not found`);
      }

      // Parse the email using mailparser
      const parsed = await simpleParser(message.source as Buffer);

      return {
        uid: message.uid,
        from: parsed.from?.text || '',
        to: getRecipientText(parsed.to),
        subject: parsed.subject || '(No Subject)',
        text: parsed.text || '',
        html: parsed.html || '',
        date: parsed.date || new Date(),
        attachments: parsed.attachments || [],
      };
    } finally {
      lock.release();
    }
  } catch (error) {
    console.error('Error getting email:', error);
    throw error;
  }
}

export async function deleteEmail(folder: string, uid: number) {
  if (!imap) throw new Error('IMAP not connected');

  try {
    const lock = await imap.getMailboxLock(folder);

    try {
      await imap.messageDelete(uid, { uid: true });
      console.log(`✅ Email UID ${uid} deleted from ${folder}`);
    } finally {
      lock.release();
    }
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
}

export async function moveEmail(folder: string, uid: number, targetFolder: string) {
  if (!imap) throw new Error('IMAP not connected');

  try {
    const lock = await imap.getMailboxLock(folder);

    try {
      await imap.messageMove(uid, targetFolder, { uid: true });
      console.log(`✅ Email UID ${uid} moved from ${folder} to ${targetFolder}`);
    } finally {
      lock.release();
    }
  } catch (error) {
    console.error('Error moving email:', error);
    throw error;
  }
}

export function isConnected() {
  return imap !== null;
}
