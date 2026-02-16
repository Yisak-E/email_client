# Email Client Configuration Guide

This email client uses **ImapFlow** for receiving emails and **Nodemailer** for sending emails, with **Electron** as the desktop framework.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- **ImapFlow**: For IMAP server connections
- **Nodemailer**: For SMTP mail sending
- **mailparser**: For parsing email content
- **Electron**: For desktop application

### 2. Environment Configuration

The application uses IPC (Inter-Process Communication) to communicate between React frontend and Electron backend.

### 3. IMAP Configuration

To connect to your email account's IMAP server, you'll need:

- **Host**: IMAP server address (e.g., `imap.gmail.com`)
- **Port**: IMAP port (usually `993` for secure)
- **Secure**: Boolean (true for SSL/TLS)
- **Auth**:
  - **User**: Email address
  - **Pass**: Password or app-specific password

### 4. SMTP Configuration

To send emails, you'll need:

- **Host**: SMTP server address (e.g., `smtp.gmail.com`)
- **Port**: SMTP port (usually `587` for TLS or `465` for SSL)
- **Secure**: Boolean (true for SSL)
- **Auth**:
  - **User**: Email address
  - **Pass**: Password or app-specific password
- **From**: Optional sender email address

## Running the Application

### Development Mode

```bash
npm run dev:electron
```

This will:
1. Start the Vite dev server on `http://localhost:5173`
2. Launch Electron with dev tools enabled

### Building for Production

```bash
npm run build:electron
```

This will:
1. Build the React app
2. Compile TypeScript
3. Package with electron-builder

## Common Configurations

### Gmail

**IMAP:**
- Host: `imap.gmail.com`
- Port: `993`
- Secure: `true`
- Additional: Use [App Password](https://support.google.com/accounts/answer/185833) instead of account password

**SMTP:**
- Host: `smtp.gmail.com`
- Port: `587`
- Secure: `false`
- Additional: Use [App Password](https://support.google.com/accounts/answer/185833) instead of account password

### Outlook/Microsoft 365

**IMAP:**
- Host: `imap-mail.outlook.com`
- Port: `993`
- Secure: `true`

**SMTP:**
- Host: `smtp-mail.outlook.com`
- Port: `587`
- Secure: `false`

## Architecture

```
electron/
  ├── main.ts              # Electron main process
  ├── preload.ts           # Context Bridge (React <-> Electron)
  ├── ipcHandlers.ts       # IPC event handlers
  ├── isDev.ts             # Development mode check
  └── services/
      ├── imapService.ts       # ImapFlow integration
      ├── nodemailerService.ts # Nodemailer integration
      └── emailParser.ts       # Email parsing utility

src/
  ├── api/
  │   └── api.ts           # IPC API calls (replaces Gmail API)
  ├── EmailContext.tsx     # React context for email state
  └── components/          # React components
```

## IPC API Methods

All functions are exposed through `window.emailAPI` in the React application:

### IMAP Functions

- `connectImap(config)` - Connect to IMAP server
- `disconnectImap()` - Disconnect from IMAP server
- `listFolders()` - Get list of email folders
- `listEmails(folder, options)` - Get emails from folder
- `getEmail(folder, uid)` - Get full email content
- `deleteEmail(folder, uid)` - Delete email
- `moveEmail(folder, uid, targetFolder)` - Move email

### SMTP Functions

- `configureSMTP(config)` - Configure SMTP server
- `sendEmail(mailOptions)` - Send email

### Utility Functions

- `parseEmail(emailData)` - Parse email data
- `getSettings()` - Get saved settings
- `saveSettings(settings)` - Save settings

## Troubleshooting

### Connection timeout
- Verify host and port are correct
- Check firewall/antivirus isn't blocking the connection
- Ensure you have internet connectivity

### Authentication failed
- Verify email and password/app-password
- For Gmail, ensure you're using [App Password](https://support.google.com/accounts/answer/185833)
- Check if account has 2FA enabled

### SMTP error
- Port and secure settings must match server requirements
- Some servers require specific user agent or connection settings
- Try using TLS (port 587) before SSL (port 465)

## Migration from Gmail API

This application replaces the previous Gmail API implementation with:
- **ImapFlow** for reliable IMAP connections
- **Nodemailer** for standard SMTP sending
- **Electron's contextBridge** for secure IPC communication
- **mailparser** for parsing complex email structures

Benefits:
- Works with any IMAP/SMTP server, not just Gmail
- No dependency on Google OAuth
- Better control over email operations
- More secure architecture with context isolation
