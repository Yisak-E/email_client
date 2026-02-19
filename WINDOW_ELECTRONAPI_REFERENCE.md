# Window.electronAPI Reference

Complete reference for the IPC API exposed to React components via `window.electronAPI`.

## API Overview

```
┌──────────────────────────────────────────────────────────────┐
│                   window.electronAPI                         │
│  (Exposed via preload.ts contextBridge)                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  IMAP/Fetch Functions                                        │
│  ├─ connectImap(config)        → imap:connect               │
│  ├─ disconnectImap()           → imap:disconnect            │
│  ├─ getFolders()               → imap:listFolders           │
│  ├─ fetchEmails(options)       → imap:listEmails            │
│  ├─ getEmail(folder, uid)      → imap:getEmail              │
│  ├─ deleteEmail(folder, uid)   → imap:deleteEmail           │
│  └─ moveEmail(folder, uid, to) → imap:moveEmail             │
│                                                               │
│  SMTP/Send Functions                                         │
│  ├─ configureSMTP(config)      → mail:configureSMTP         │
│  └─ sendEmail(options)         → mail:sendEmail             │
│                                                               │
│  Utility Functions                                           │
│  ├─ parseEmail(data)           → mail:parseEmail            │
│  ├─ getSettings()              → settings:getSettings       │
│  └─ saveSettings(settings)     → settings:saveSettings      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Detailed API Reference

### IMAP Functions

#### `connectImap(config: ImapConfig): Promise<{success: boolean, message: string}>`

Connect to an IMAP email server.

**Parameters:**
```typescript
interface ImapConfig {
  host: string;          // e.g., 'imap.gmail.com'
  port: number;          // e.g., 993
  secure: boolean;       // true for port 993, false for 587
  auth: {
    user: string;        // Email address
    pass: string;        // App password or password
  };
}
```

**Example:**
```typescript
const result = await window.electronAPI.connectImap({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: 'user@gmail.com',
    pass: 'app-password-16chars',
  },
});
console.log(result.message); // "Connected to IMAP server"
```

---

#### `disconnectImap(): Promise<void>`

Disconnect from the IMAP server.

**Example:**
```typescript
await window.electronAPI.disconnectImap();
console.log('Disconnected from IMAP');
```

---

#### `getFolders(): Promise<string[]>`

Get list of all available email folders/mailboxes.

**Returns:** Array of folder names like `['INBOX', 'Sent Mail', 'Drafts', etc.]`

**Example:**
```typescript
const folders = await window.electronAPI.getFolders();
console.log('Available folders:', folders);
// Output: ['INBOX', '[Gmail]/Sent Mail', '[Gmail]/Drafts', '[Gmail]/Trash']
```

---

#### `fetchEmails(options?: FetchEmailsOptions): Promise<FetchEmailsResult>`

Fetch emails from a folder with pagination.

**Parameters:**
```typescript
interface FetchEmailsOptions {
  folder?: string;      // Default: 'INBOX'
  limit?: number;       // Default: 20
  offset?: number;      // Default: 0 (for pagination)
}
```

**Returns:**
```typescript
interface FetchEmailsResult {
  emails: Email[];
  total: number;        // Total emails in folder
  limit: number;        // How many fetched
  offset: number;       // Starting position
}

interface Email {
  uid: number;
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  date?: Date;
  attachments?: Attachment[];
  envelope?: Envelope;
}
```

**Example:**
```typescript
// Get first 20 from INBOX
const result = await window.electronAPI.fetchEmails({
  folder: 'INBOX',
  limit: 20,
  offset: 0,
});

console.log(`Found ${result.total} total emails`);
console.log(`Fetched ${result.emails.length} emails`);

result.emails.forEach(email => {
  console.log(`[${email.uid}] ${email.from}: ${email.subject}`);
});

// Get next page
const page2 = await window.electronAPI.fetchEmails({
  folder: 'INBOX',
  limit: 20,
  offset: 20,
});
```

---

#### `getEmail(folder: string, uid: number): Promise<Email>`

Get full content of a single email.

**Parameters:**
- `folder` - Folder name (e.g., 'INBOX')
- `uid` - Email UID from `fetchEmails()`

**Returns:** Full email object with parsed content

**Example:**
```typescript
const email = await window.electronAPI.getEmail('INBOX', 123);
console.log('Subject:', email.subject);
console.log('From:', email.from);
console.log('Body:', email.text);
console.log('Has', email.attachments?.length, 'attachments');
```

---

#### `deleteEmail(folder: string, uid: number): Promise<void>`

Delete an email from a folder.

**Parameters:**
- `folder` - Folder name
- `uid` - Email UID

**Example:**
```typescript
await window.electronAPI.deleteEmail('INBOX', 123);
console.log('Email deleted');
```

---

#### `moveEmail(folder: string, uid: number, targetFolder: string): Promise<void>`

Move email from one folder to another.

**Parameters:**
- `folder` - Source folder
- `uid` - Email UID
- `targetFolder` - Destination folder name

**Example:**
```typescript
await window.electronAPI.moveEmail('INBOX', 123, '[Gmail]/Archive');
console.log('Email moved to Archive');
```

---

### SMTP Functions

#### `configureSMTP(config: SmtpConfig): Promise<void>`

Configure SMTP server for sending emails. Usually called once at startup.

**Parameters:**
```typescript
interface SmtpConfig {
  host: string;         // e.g., 'smtp.gmail.com'
  port: number;         // e.g., 587
  secure: boolean;      // false for 587, true for 465
  auth: {
    user: string;       // Email address
    pass: string;       // App password
  };
}
```

**Example:**
```typescript
await window.electronAPI.configureSMTP({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'user@gmail.com',
    pass: 'app-password-16chars',
  },
});
console.log('SMTP configured');
```

---

#### `sendEmail(options: MailOptions): Promise<SendEmailResult>`

Send an email via configured SMTP server.

**Parameters:**
```typescript
interface MailOptions {
  from?: string;        // Sender (usually auto-filled from SMTP config)
  to: string | string[];     // Recipient(s)
  cc?: string | string[];    // Carbon copy
  bcc?: string | string[];   // Blind carbon copy
  subject: string;      // Email subject
  text?: string;        // Plain text body
  html?: string;        // HTML body
  attachments?: Attachment[];
  replyTo?: string;
}

interface Attachment {
  filename: string;
  path?: string;        // File path
  content?: Buffer | string;  // Or direct content
  contentType?: string;
  encoding?: string;
}
```

**Returns:**
```typescript
interface SendEmailResult {
  success: boolean;
  message?: string;
  messageId?: string;
  response?: string;
}
```

**Example:**
```typescript
const result = await window.electronAPI.sendEmail({
  to: 'recipient@example.com',
  cc: ['cc@example.com'],
  subject: 'Hello World',
  text: 'This is plain text',
  html: '<h1>Hello</h1><p>This is HTML</p>',
  attachments: [
    {
      filename: 'document.pdf',
      path: '/path/to/document.pdf',
    },
    {
      filename: 'image.png',
      content: Buffer.from(imageData),
      contentType: 'image/png',
    },
  ],
});

console.log('Email sent!');
console.log('Message ID:', result.messageId);
```

---

### Utility Functions

#### `parseEmail(emailData: any): Promise<ParsedEmail>`

Parse raw email data into a structured format.

**Example:**
```typescript
const parsed = await window.electronAPI.parseEmail(rawEmailData);
console.log('Parsed subject:', parsed.subject);
```

---

### Settings Functions

#### `getSettings(): Promise<AppSettings>`

Get saved application settings.

**Returns:**
```typescript
interface AppSettings {
  [key: string]: any;
  imapProvider?: 'gmail' | 'outlook' | 'custom';
  autoFetchInterval?: number;
  prefetchSize?: number;
  enableNotifications?: boolean;
}
```

**Example:**
```typescript
const settings = await window.electronAPI.getSettings();
console.log('Current settings:', settings);
```

---

#### `saveSettings(settings: AppSettings): Promise<void>`

Save application settings to main process memory.

**Example:**
```typescript
await window.electronAPI.saveSettings({
  imapProvider: 'gmail',
  autoFetchInterval: 5000,
  enableNotifications: true,
});
console.log('Settings saved');
```

---

## Usage Patterns

### Pattern 1: Fetch and Display Emails

```typescript
const [emails, setEmails] = useState<Email[]>([]);

useEffect(() => {
  async function loadEmails() {
    try {
      const result = await window.electronAPI.fetchEmails({
        folder: 'INBOX',
        limit: 20,
      });
      setEmails(result.emails);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  }
  
  loadEmails();
}, []);
```

### Pattern 2: Send Email with Validation

```typescript
async function handleSendEmail(to: string, subject: string, body: string) {
  try {
    if (!to || !subject || !body) {
      throw new Error('All fields required');
    }

    const result = await window.electronAPI.sendEmail({
      to,
      subject,
      html: body,
    });

    console.log('✅ Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Send failed:', error);
    throw error;
  }
}
```

### Pattern 3: Email Management

```typescript
async function handleEmailAction(action: 'delete' | 'move', 
                                 folder: string, 
                                 uid: number, 
                                 targetFolder?: string) {
  try {
    if (action === 'delete') {
      await window.electronAPI.deleteEmail(folder, uid);
      console.log('Email deleted');
    } else if (action === 'move' && targetFolder) {
      await window.electronAPI.moveEmail(folder, uid, targetFolder);
      console.log(`Email moved to ${targetFolder}`);
    }
  } catch (error) {
    console.error(`Action "${action}" failed:`, error);
  }
}
```

---

## Provider Configurations

### Gmail

```typescript
// IMAP
{
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: { user: 'user@gmail.com', pass: 'your-16-char-app-password' }
}

// SMTP
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: 'user@gmail.com', pass: 'your-16-char-app-password' }
}
```

### Outlook.com

```typescript
// IMAP
{
  host: 'imap-mail.outlook.com',
  port: 993,
  secure: true,
  auth: { user: 'user@outlook.com', pass: 'your-password' }
}

// SMTP
{
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: { user: 'user@outlook.com', pass: 'your-password' }
}
```

---

## Error Handling

All functions can throw errors. Always use try-catch:

```typescript
try {
  const result = await window.electronAPI.fetchEmails({ folder: 'INBOX' });
  // Use result
} catch (error) {
  if (error instanceof Error) {
    console.error('Error message:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

Common errors:
- "IMAP not connected" - Call `connectImap()` first
- "Invalid login" - Check username/password
- "Connection timeout" - Check host/port/firewall

---

## See Also

- [ELECTRON_INTEGRATION.md](./ELECTRON_INTEGRATION.md) - Setup guide
- [ELECTRON_API_USAGE.md](./ELECTRON_API_USAGE.md) - React integration examples
- [src/types/electron.d.ts](./src/types/electron.d.ts) - Full TypeScript definitions
- [src/api/api.ts](./src/api/api.ts) - Wrapper implementation
