# Quick Start: Using Electron IPC in React Components

This guide shows you how to use the email API in your React components.

## Basic Setup

### 1. Import the API Functions

```typescript
// src/components/MyComponent.tsx
import {
  connectImap,
  listFolders,
  fetchInboxEmails,
  sendEmail,
} from '../api/api';
```

### 2. Use in a Component

```typescript
import { useEffect, useState } from 'react';
import { fetchInboxEmails, Email } from '../api/api';

export function InboxComponent() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmails() {
      try {
        setLoading(true);
        const result = await fetchInboxEmails(20);
        setEmails(result.emails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load emails');
      } finally {
        setLoading(false);
      }
    }

    loadEmails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Inbox ({emails.length})</h2>
      <ul>
        {emails.map(email => (
          <li key={email.uid}>
            <strong>{email.subject}</strong>
            <br />
            <small>{email.from}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Common Use Cases

### Connect to Email Account

```typescript
import { connectImap } from '../api/api';

async function handleConnect() {
  try {
    const result = await connectImap({
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password',
      },
    });
    console.log('Connected:', result);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

### List Email Folders

```typescript
import { listFolders } from '../api/api';

async function showFolders() {
  try {
    const folders = await listFolders();
    console.log('Available folders:', folders);
  } catch (error) {
    console.error('Failed to list folders:', error);
  }
}
```

### Fetch Emails from Any Folder

```typescript
import { listEmails } from '../api/api';

async function fetchFromFolder() {
  try {
    const result = await listEmails('Sent Mail', { limit: 50, offset: 0 });
    console.log(`Found ${result.total} emails in Sent Mail`);
    console.log('Latest:', result.emails);
  } catch (error) {
    console.error('Failed to fetch emails:', error);
  }
}
```

### Send an Email

```typescript
import { configureSMTP, sendEmail } from '../api/api';

async function handleSendEmail() {
  try {
    // Configure SMTP first (usually done once at startup)
    await configureSMTP({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password',
      },
    });

    // Send email
    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Hello',
      text: 'This is a test email',
      html: '<h1>Hello</h1><p>This is a test email</p>',
    });

    console.log('Email sent! ID:', result.messageId);
  } catch (error) {
    console.error('Failed to send:', error);
  }
}
```

### Manage Emails

```typescript
import { deleteEmail, moveEmail } from '../api/api';

// Delete email
async function handleDelete(folderName: string, uid: number) {
  try {
    await deleteEmail(folderName, uid);
    console.log(`Email ${uid} deleted`);
  } catch (error) {
    console.error('Delete failed:', error);
  }
}

// Move email to another folder
async function handleMove(from: string, uid: number, to: string) {
  try {
    await moveEmail(from, uid, to);
    console.log(`Email ${uid} moved from ${from} to ${to}`);
  } catch (error) {
    console.error('Move failed:', error);
  }
}
```

## Working with Settings

```typescript
import { getSettings, saveSettings } from '../api/api';
import type { AppSettings } from '../types/electron';

async function loadSettings() {
  const settings = await getSettings();
  console.log('Current settings:', settings);
}

async function updateSettings() {
  const newSettings: AppSettings = {
    imapProvider: 'gmail',
    autoFetchInterval: 5000,
    enableNotifications: true,
  };

  await saveSettings(newSettings);
  console.log('Settings updated');
}
```

## Type Safety

All functions are fully typed. You get TypeScript autocompletion:

```typescript
// ✅ Good - TypeScript knows the types
const result = await fetchInboxEmails(20);
result.emails.forEach(email => {
  console.log(email.subject);  // ✅ IntelliSense works
});

// ❌ Bad - TypeScript will catch this
console.log(result.unknown);  // ❌ Error: Property 'unknown' does not exist
```

## Error Handling

All API functions throw errors that you should handle:

```typescript
import type { Email } from '../api/api';

async function safeEmailFetch(): Promise<Email[] | null> {
  try {
    const result = await fetchInboxEmails(20);
    return result.emails;
  } catch (error) {
    if (error instanceof Error) {
      console.error('API Error:', error.message);
    } else {
      console.error('Unknown error occurred');
    }
    return null;
  }
}
```

## React Hooks Pattern

Create a custom hook for email operations:

```typescript
// src/hooks/useEmail.ts
import { useState, useCallback } from 'react';
import type { Email, FetchEmailsResult } from '../types/electron';
import { fetchInboxEmails, sendEmail as sendEmailApi } from '../api/api';

export function useEmail() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (folder = 'INBOX', limit = 20) => {
    try {
      setLoading(true);
      const result = await fetchInboxEmails(limit);
      setEmails(result.emails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendEmail = useCallback(async (to: string, subject: string, body: string) => {
    try {
      const result = await sendEmailApi({
        to,
        subject,
        text: body,
      });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  return { emails, loading, error, fetchEmails, sendEmail };
}

// Usage in component
export function MyComponent() {
  const { emails, loading, fetchEmails } = useEmail();

  return (
    <div>
      <button onClick={() => fetchEmails('INBOX', 20)}>
        Load Emails
      </button>
      {emails.map(email => (
        <div key={email.uid}>{email.subject}</div>
      ))}
    </div>
  );
}
```

## API Reference

See `src/types/electron.d.ts` for complete interface definitions and JSDoc comments.

### Main Interfaces

| Interface | Purpose |
|-----------|---------|
| `ImapConfig` | IMAP server connection settings |
| `SmtpConfig` | SMTP server settings for sending |
| `Email` | Single email message with full content |
| `MailOptions` | Parameters for sending an email |
| `FetchEmailsResult` | Result from fetching multiple emails |
| `AppSettings` | Application configuration |

## Debugging

### Enable IPC Logging

In development, DevTools is opened automatically. You can see IPC calls in the console.

### Check IPC Handler Logs

The main process logs all IPC calls:

```typescript
// In electron/ipcHandlers.ts
ipcMain.handle('imap:listEmails', async (event, folder, options) => {
  console.log('🔍 Fetching from:', folder, 'Options:', options);
  try {
    const result = await imapService.listEmails(folder, options);
    console.log('✅ Got', result.emails.length, 'emails');
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});
```

### Test IPC in DevTools Console

```javascript
// In DevTools console
await window.electronAPI.getFolders()
await window.electronAPI.fetchEmails({ folder: 'INBOX', limit: 5 })
```

## Performance Tips

1. **Paginate Large Folders**: Use `limit` and `offset` options
   ```typescript
   // Load 20 at a time
   await listEmails('INBOX', { limit: 20, offset: 0 });
   // Load next page
   await listEmails('INBOX', { limit: 20, offset: 20 });
   ```

2. **Cache Settings**: Fetch settings once, update when needed
   ```typescript
   const settings = await getSettings();
   // Don't call getSettings() every render!
   ```

3. **Batch Operations**: Combine multiple operations into one flow
   ```typescript
   const [folders, emails] = await Promise.all([
     listFolders(),
     fetchInboxEmails(20),
   ]);
   ```

## Next Steps

- See [ELECTRON_INTEGRATION.md](./ELECTRON_INTEGRATION.md) for setup details
- Check `electron/services/` for implementation details
- Review `electron/ipcHandlers.ts` for all available handlers
