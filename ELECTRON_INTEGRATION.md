# Electron Integration Setup Guide

This guide covers the complete Electron integration setup for your Vite + React + TypeScript email client.

## Architecture Overview

```
electron/
├── main.ts              (Electron main process - creates windows, handles app lifecycle)
├── preload.ts           (Context bridge - exposes IPC APIs to renderer)
├── config.ts            (Environment configuration loader for credentials)
├── isDev.ts             (Development mode detection)
├── ipcHandlers.ts       (IPC event handlers connecting UI to services)
└── services/
    ├── imapService.ts   (IMAP email fetching & management)
    ├── nodemailerService.ts (SMTP email sending)
    └── emailParser.ts   (Email parsing utilities)

src/
├── main.tsx             (React app entry point)
├── App.tsx              (Main React component)
├── EmailContext.tsx     (React context for email state)
└── api/
    └── api.ts           (API calls to IPC handlers via window.electronAPI)
```

## Window Object API

The preload script exposes `window.electronAPI` with the following methods:

### Email Fetching
```typescript
window.electronAPI.connectImap(config: ImapConfig)
window.electronAPI.disconnectImap()
window.electronAPI.getFolders()                    // Stub for listFolders()
window.electronAPI.fetchEmails(options?: { folder?: string, limit?: number, offset?: number })
window.electronAPI.getEmail(folder: string, uid: number)
window.electronAPI.deleteEmail(folder: string, uid: number)
window.electronAPI.moveEmail(folder: string, uid: number, targetFolder: string)
```

### Email Sending
```typescript
window.electronAPI.configureSMTP(config: SmtpConfig)
window.electronAPI.sendEmail(mailOptions: MailOptions)
```

### Utilities
```typescript
window.electronAPI.parseEmail(emailData: any)
window.electronAPI.getSettings()
window.electronAPI.saveSettings(settings: Record<string, any>)
```

## Environment Variables Setup

### 1. Create `.env` file

Copy from `.env.example` and fill in your credentials:

```bash
cp .env.example .env
```

### 2. Configure Gmail (IMAP/SMTP)

**Get App Password (Gmail):**
1. Go to https://myaccount.google.com/
2. Click "Security" in left menu
3. Enable 2-Factor Authentication
4. Scroll down to "App passwords"
5. Select Mail and Windows Computer
6. Copy the 16-character password

**Set in `.env`:**
```env
VITE_GMAIL_IMAP_USER=your-email@gmail.com
VITE_GMAIL_IMAP_PASS=xxxx xxxx xxxx xxxx  # 16-char app password
VITE_GMAIL_SMTP_USER=your-email@gmail.com
VITE_GMAIL_SMTP_PASS=xxxx xxxx xxxx xxxx  # Same app password
```

### 3. Configure Outlook (IMAP/SMTP)

**For Outlook.com/Microsoft 365:**
1. Use your email and password directly
2. Enable IMAP in Outlook settings if needed

**Set in `.env`:**
```env
VITE_OUTLOOK_IMAP_USER=your-email@outlook.com
VITE_OUTLOOK_IMAP_PASS=your-password
VITE_OUTLOOK_SMTP_USER=your-email@outlook.com
VITE_OUTLOOK_SMTP_PASS=your-password
```

## Running the Application

### Development Mode

```bash
# Install dependencies
npm install

# Run with hot reload (Vite on port 5173, Electron watching)
npm run dev:electron
```

This will:
1. Compile TypeScript files in `electron/`
2. Start Vite dev server on `http://localhost:5173`
3. Launch Electron window pointing to Vite dev server
4. Open DevTools automatically for debugging

### Production Build

```bash
# Build React app + Electron main process
npm run build:electron
```

This will:
1. Compile all TypeScript
2. Build optimized React bundle to `dist/`
3. Package with electron-builder (creates installers)

### Just Build Without Packaging

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## TypeScript Configuration

The project uses multiple `tsconfig` files:

- **tsconfig.json** - Base configuration
- **tsconfig.app.json** - React/Vite app settings
- **tsconfig.electron.json** - Electron main process settings
- **tsconfig.node.json** - Build tool settings (vite, webpack, etc.)

Key features:
- ✅ Strict mode enabled
- ✅ Module resolution with path aliases (@/)
- ✅ ES2020+ target (Node.js 16+)
- ✅ Declaration files generated

## Security Best Practices

### Context Isolation ✅
```typescript
// preload.ts uses contextBridge to safely expose only needed APIs
contextBridge.exposeInMainWorld('electronAPI', { ... })
```

### Sandboxing ✅
```typescript
// main.ts enables process sandboxing
webPreferences: {
  sandbox: true,
  contextIsolation: true,
  nodeIntegration: false,
  enableRemoteModule: false,
}
```

### Credential Safety ✅
- Credentials loaded from `.env` in main process only
- Never exposed to renderer process
- `.env` should be in `.gitignore` (never commit credentials)
- Use app passwords/tokens, never real passwords

## Using IPC from React Components

### Example: Fetch emails

```typescript
// src/components/EmailList.tsx
import { useEffect, useState } from 'react';

export function EmailList() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Use window.electronAPI to call IPC handlers
    window.electronAPI.fetchEmails({ folder: 'INBOX', limit: 20 })
      .then(result => setEmails(result.emails))
      .catch(error => console.error('Failed to fetch emails:', error));
  }, []);

  return (
    <div>
      {emails.map(email => (
        <div key={email.uid}>{email.envelope.subject}</div>
      ))}
    </div>
  );
}
```

### Example: Send email

```typescript
// src/pages/newMail/NewMail.tsx
async function handleSendEmail(to: string, subject: string, body: string) {
  try {
    const result = await window.electronAPI.sendEmail({
      to,
      subject,
      text: body,
    });
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
```

### Type Safety

All IPC methods are typed in `electron/preload.ts`:

```typescript
declare global {
  interface Window {
    electronAPI: EmailAPI;  // Fully typed API
  }
}
```

This gives you IDE autocompletion and type checking.

## Common Issues & Solutions

### "IMAP not connected" error
- Check `.env` credentials
- Verify host/port in `.env`
- Check firewall doesn't block IMAP port (usually 993)
- Gmail: Use app password, not account password

### Port 5173 already in use
```bash
# Kill the process or use different port
npm run dev:electron -- --port 5174
```

### Electron won't close
Check that `mainWindow = null` is set in the `closed` event:
```typescript
mainWindow.on('closed', () => {
  mainWindow = null;  // Important!
});
```

### Credentials not loading from .env
- Restart Electron (`dev:electron`)
- Verify `.env` file exists in project root
- Check variable names match exactly (case-sensitive)
- Prefix should be `VITE_` for Vite to pick up

## File Structure Changes

### .gitignore Updates

Ensure these are ignored:

```gitignore
.env                 # Never commit credentials
.env.local
dist/               # Build output
node_modules/       # Dependencies
out/                # electron-builder output
*.exe               # Installers
*.dmg
*.msi
```

## Next Steps

1. **Copy `.env.example` to `.env`** and fill in your email credentials
2. **Run `npm install`** to install dependencies
3. **Run `npm run dev:electron`** to start development
4. **Check console** in DevTools for any connection errors
5. **Test features** - Connect IMAP, fetch emails, send messages

## Debugging

### Enable DevTools in Development

The preload script automatically opens DevTools in development mode. You can:
- Inspect the React component tree
- Console for JavaScript debugging
- Network tab (if using HTTP APIs)
- Check IPC communication: `console.log()` in main.ts and preload.ts

### Debug IPC Calls

Add logging to `electron/ipcHandlers.ts`:

```typescript
ipcMain.handle('imap:listFolders', async () => {
  console.log('🔍 Listing folders...');
  try {
    const result = await imapService.listFolders();
    console.log('✅ Folders:', result);
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});
```

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Documentation](https://vitejs.dev/)
- [ImapFlow Documentation](https://imapflow.com/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [MailParser Documentation](https://nodemailer.com/extras/mailparser/)

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-18
