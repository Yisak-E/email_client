# Quick Start Guide

## Installation
```bash
npm install
```

## Running in Development

### With Electron (Desktop App)
```bash
npm run dev:electron
```

### Web Only (Vite)
```bash
npm run dev
```

## First Steps

1. **Open Settings** (⚙️ icon in sidebar)
2. **Configure IMAP** (Receiving emails)
   - Enter your email provider's IMAP settings
   - Test connection
3. **Configure SMTP** (Sending emails)
   - Enter your email provider's SMTP settings
   - Test connection
4. **Check Inbox** - Emails should load automatically

## Gmail Setup (Quickest)

1. Go to [Google Account > Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Create App Password for "Mail"
4. In Settings:
   - **IMAP Host:** `imap.gmail.com` | Port: `993` | Secure: ✓
   - **SMTP Host:** `smtp.gmail.com` | Port: `587` | Secure: ☐
   - **Email:** your-email@gmail.com
   - **Password:** your-app-password

## Building

```bash
# Desktop app (Windows/Mac/Linux installers)
npm run build:electron

# Web only
npm run build
```

## Project Structure

```
electron/              ← Backend (Node.js + ImapFlow/Nodemailer)
src/                   ← Frontend (React)
src/api/api.ts         ← IPC bridge to backend
src/EmailContext.tsx   ← State management
```

## Common IPC Methods

```typescript
import * as api from './api/api';

// Connect to IMAP
await api.connectImap({ host, port, secure, auth });

// Load emails
const result = await api.listEmails('INBOX');

// Get an email
const email = await api.getEmail('INBOX', uid);

// Send email
await api.sendEmail({ to, subject, text, html });

// Save settings
await api.saveSettings({ imapConfig, smtpConfig });
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to IMAP | Check host/port. Try port 143 or 110 |
| Auth failed | For Gmail, use App Password not account password |
| Port 5173 in use | `npm run dev -- --port 5174` |
| No module errors | `rm -rf node_modules && npm install` |

## Documentation

- 📖 [Full Setup Guide](./SETUP_GUIDE.md)
- 📖 [Migration Guide](./MIGRATION_GUIDE.md)
- 📖 [Configuration Examples](./EMAIL_CONFIG.example.json)
