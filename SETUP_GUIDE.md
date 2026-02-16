# Email Client - IPC/ImapFlow/Nodemailer Migration - Setup Guide

## Overview

Your email client has been successfully migrated from **Gmail API** to a more flexible architecture using:

- **ImapFlow** - Universal IMAP client for receiving emails
- **Nodemailer** - Universal SMTP client for sending emails  
- **Electron** - Desktop application framework
- **contextBridge** - Secure IPC (Inter-Process Communication) between React and Node.js
- **mailparser** - Email parsing and decoding

## What Changed

### Removed
- ✅ Google OAuth authentication (`gapi-script`, `@react-oauth/google`)
- ✅ Gmail API dependency
- ✅ Hardcoded JSON email data loading

### Added
- ✨ **Electron main process** - Backend Node.js process
- ✨ **ImapFlow service** - Connect to any IMAP server
- ✨ **Nodemailer service** - Send via any SMTP server
- ✨ **contextBridge** - Secure React ↔ Electron IPC
- ✨ **Settings page** - Configure email accounts

## File Structure

```
project-root/
├── electron/                    # Electron backend (Node.js)
│   ├── main.ts                 # Electron main process entry
│   ├── preload.ts              # contextBridge security layer
│   ├── ipcHandlers.ts          # IPC event handlers
│   ├── isDev.ts                # Development mode detection
│   └── services/
│       ├── imapService.ts      # ImapFlow integration
│       ├── nodemailerService.ts # Nodemailer integration
│       └── emailParser.ts      # mailparser utilities
│
├── src/                         # React frontend (UI)
│   ├── api/
│   │   └── api.ts              # IPC API calls (NEW)
│   ├── EmailContext.tsx         # State management (UPDATED)
│   ├── pages/
│   │   └── settings/
│   │       └── Settings.tsx    # Email config UI (NEW)
│   └── ...
│
├── tsconfig.electron.json       # TypeScript config for Electron
├── electron-builder.json        # Electron builder config
├── MIGRATION_GUIDE.md          # Detailed migration information
├── EMAIL_CONFIG.example.json   # Configuration examples
└── package.json                # Updated dependencies
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Setup

#### Option A: Web Development (Vite only)
```bash
npm run dev
```
Opens at `http://localhost:5173`

#### Option B: Electron Development
```bash
npm run dev:electron
```
Launches Electron with React dev server and DevTools

### 3. Configure Email Account

1. Open **Settings** tab in the app (⚙️ icon)
2. Enter IMAP settings (for receiving emails)
3. Click "Test Connection" to verify
4. Enter SMTP settings (for sending emails)
5. Click "Test Connection" to verify

### 4. Load Emails

Once connected:
- Emails from your INBOX will load automatically
- Navigate between folders using the sidebar
- Click an email to view its content

## Configuration Examples

### Gmail

1. **Create an App Password:**
   - Go to [Google Account > Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Create "App passwords" for Mail/Electron

2. **IMAP Settings:**
   ```
   Host: imap.gmail.com
   Port: 993
   Secure: ✓
   Email: your-email@gmail.com
   Password: your-app-password
   ```

3. **SMTP Settings:**
   ```
   Host: smtp.gmail.com
   Port: 587
   Secure: ☐
   Email: your-email@gmail.com
   Password: your-app-password
   From: your-email@gmail.com
   ```

### Outlook/Microsoft 365

1. **IMAP Settings:**
   ```
   Host: imap-mail.outlook.com
   Port: 993
   Secure: ✓
   Email: your-email@outlook.com
   Password: your-password
   ```

2. **SMTP Settings:**
   ```
   Host: smtp-mail.outlook.com
   Port: 587
   Secure: ☐
   Email: your-email@outlook.com
   Password: your-password
   From: your-email@outlook.com
   ```

## Core Features Now Available

### Email Reception (via ImapFlow)
- ✅ Connect to any IMAP server
- ✅ List all folders
- ✅ Fetch emails with pagination
- ✅ Read full email content
- ✅ Delete emails
- ✅ Move emails between folders
- ✅ Parse complex MIME structures

### Email Sending (via Nodemailer)
- ✅ Send via any SMTP server
- ✅ Support for HTML/plain text
- ✅ CC/BCC recipients
- ✅ Attachments
- ✅ Reply-To headers

### Email Processing (via mailparser)
- ✅ Auto-decode base64 content
- ✅ Parse MIME structures
- ✅ Extract attachments
- ✅ Handle multiple text encodings

## Build & Deployment

### Build for Desktop (Windows/Mac/Linux)

```bash
npm run build:electron
```

This will:
1. Build React app → `/dist`
2. Compile Electron code → `/dist-electron`
3. Package with electron-builder

Installers will be created in `dist/installers/`

### Build for Web Only

```bash
npm run build
```

Creates `/dist` folder for static hosting

## API Reference

All methods are available through `window.emailAPI` in React:

### IMAP Functions
```typescript
// Connect to IMAP server
await window.emailAPI.connectImap({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: { user: 'email@gmail.com', pass: 'password' }
});

// List folders
const folders = await window.emailAPI.listFolders();
// Returns: ['INBOX', 'Sent', 'Drafts', 'Spam', 'Trash']

// List emails from folder
const result = await window.emailAPI.listEmails('INBOX', {
  limit: 20,
  offset: 0
});
// Returns: { emails: [...], total: 150, limit: 20, offset: 0 }

// Get full email
const email = await window.emailAPI.getEmail('INBOX', 123);
// Returns: { from, to, subject, text, html, date, attachments }

// Delete email
await window.emailAPI.deleteEmail('INBOX', 123);

// Move email
await window.emailAPI.moveEmail('INBOX', 123, 'Archive');
```

### SMTP Functions
```typescript
// Configure SMTP
await window.emailAPI.configureSMTP({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: 'email@gmail.com', pass: 'password' },
  from: 'email@gmail.com'
});

// Send email
await window.emailAPI.sendEmail({
  to: 'recipient@example.com',
  cc: 'cc@example.com',
  subject: 'Hello',
  text: 'Email content',
  html: '<p>HTML content</p>',
  attachments: [{ filename: 'file.txt', content: '...' }]
});
```

### Settings Functions
```typescript
// Save settings (persists between app restarts)
await window.emailAPI.saveSettings({
  imapConfig: { ... },
  smtpConfig: { ... },
  theme: 'dark'
});

// Get settings
const settings = await window.emailAPI.getSettings();
```

## Architecture

### Communication Flow

```
React Component
    ↓ (IPC send)
preload.ts (contextBridge)
    ↓ (ipcRenderer.invoke)
Electron Main Process
    ↓ (ipcMain.handle)
ipcHandlers.ts
    ↓
Services (ImapFlow, Nodemailer, etc.)
    ↓
Email Servers (IMAP/SMTP)
```

### Security

✅ **Context Isolation Enabled** - React cannot access Node APIs directly
✅ **Limited API Surface** - Only specific functions exposed via contextBridge
✅ **No eval()** - Cannot execute arbitrary code
✅ **Credentials in Electron** - Passwords never sent to web renderer

## Troubleshooting

### Connection Issues

**"Connection timeout"**
- Check host/port are correct
- Verify firewall allows the port
- Try different port (other IMAP ports: 143, 110)

**"Authentication failed"**
- Verify email/password
- For Gmail, ensure using App Password
- Check if account has 2-factor authentication

**"Module not found: imapflow"**
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check npm version compatibility

### Running Issues

**"Cannot find electron"**
```bash
npm install electron --save-dev
```

**"Port 5173 already in use"**
```bash
# Kill process on that port or use different port
npm run dev -- --port 5174
```

**"contextBridge is not available"**
- Only works in Electron, not in web browsers
- For web-only version, remove Electron code

## Migrating React Components

### Old Way (Gmail API)
```typescript
import { loadGapiClient, listEmails } from './api/api';

useEffect(() => {
  loadGapiClient().then(() => listEmails());
}, []);
```

### New Way (ImapFlow + contextBridge)
```typescript
import * as api from './api/api';

const { loadEmails } = useEmailContext();

useEffect(() => {
  loadEmails('INBOX');
}, [loadEmails]);
```

## Performance Tips

1. **Pagination** - Load emails in chunks, not all at once
   ```typescript
   await api.listEmails('INBOX', { limit: 50, offset: 0 })
   ```

2. **Connection pooling** - Keep IMAP connected, don't disconnect/reconnect
   ```typescript
   // Good - persistent connection
   await connectImap(config); // once
   await listEmails('INBOX'); // many times
   
   // Bad - new connection each time
   await connectImap(config);
   await listEmails('INBOX');
   await disconnectImap();
   ```

3. **Caching** - Store settings to avoid repeated configuration
   ```typescript
   const settings = await api.getSettings();
   if (settings.imapConfig) {
     await connectToMailServer(settings.imapConfig); // auto-connect
   }
   ```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure Settings: Open app and set IMAP/SMTP
3. ✅ Test connections: Click "Test Connection" buttons
4. ✅ Load emails: Navigate to Inbox
5. ✅ Build for desktop: `npm run build:electron`

## Support & Resources

- **ImapFlow Docs:** https://imapflow.com/
- **Nodemailer Docs:** https://nodemailer.com/
- **mailparser Docs:** https://nodemailer.com/extras/mailparser/
- **Electron Docs:** https://www.electronjs.org/docs
- **contextBridge:** https://www.electronjs.org/docs/latest/api/context-bridge

## Breaking Changes from Gmail API

| Feature | Gmail API | ImapFlow/Nodemailer |
|---------|-----------|------------------|
| Authentication | OAuth 2.0 | Direct credentials |
| Rate limiting | 250 msgs/day (quota) | Depends on server |
| Server | Google only | Any IMAP/SMTP |
| Setup | OAuth consent screen | Email credentials |
| Libraries | gapi-script | imapflow, nodemailer |
| IPC | None (web API) | Electron contextBridge |

## License

This migration maintains the same license as the original project.
