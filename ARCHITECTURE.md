# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Electron Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           MAIN PROCESS (Node.js)                         │   │
│  │           electron/main.ts                               │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  IPC Handlers (electron/ipcHandlers.ts)            │  │   │
│  │  │                                                     │  │   │
│  │  │  • imap:connect            • mail:configureSMTP    │  │   │
│  │  │  • imap:listFolders        • mail:sendEmail        │  │   │
│  │  │  • imap:listEmails         • mail:parseEmail       │  │   │
│  │  │  • imap:getEmail           • settings:*            │  │   │
│  │  │  • imap:deleteEmail                                │  │   │
│  │  │  • imap:moveEmail                                  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                           ▲                                │   │
│  │                           │ invoke                         │   │
│  │                           │                                │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Services Layer                                    │  │   │
│  │  ├────────────────────────────────────────────────────┤  │   │
│  │  │                                                     │  │   │
│  │  │  ┌────────────────┐  ┌────────────────────────┐   │  │   │
│  │  │  │ ImapService    │  │ NodemailerService      │   │  │   │
│  │  │  │                │  │                        │   │  │   │
│  │  │  │ • ImapFlow     │  │ • Nodemailer          │   │  │   │
│  │  │  │ • Connection   │  │ • SMTP Auth           │   │  │   │
│  │  │  │ • Folder Ops   │  │ • Send Email          │   │  │   │
│  │  │  │ • Message Ops  │  │ • Attachment Support  │   │  │   │
│  │  │  └────────────────┘  └────────────────────────┘   │  │   │
│  │  │                                                     │  │   │
│  │  │  ┌──────────────────────────────────────────────┐  │  │   │
│  │  │  │ EmailParser                                  │  │  │   │
│  │  │  │ • mailparser integration                     │  │  │   │
│  │  │  │ • MIME decoding                              │  │  │   │
│  │  │  │ • Base64 utilities                           │  │  │   │
│  │  │  └──────────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │           ▼                                              │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Email Servers (External)                         │  │   │
│  │  │  • IMAP (Gmail, Outlook, Custom)                  │  │   │
│  │  │  • SMTP (Gmail, Outlook, Custom)                  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │                                       │
│                         │ IPC (Inter-Process Communication)    │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐  │
│  │         RENDERER PROCESS (React)                        │  │
│  │         BrowserWindow                                   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Preload Script (electron/preload.ts)              │  │  │
│  │  │  contextBridge - Exposes window.emailAPI           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                      ▲                                    │  │
│  │                      │ window.emailAPI                    │  │
│  │                      │                                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  React Components                                  │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌────────────────────────────────────────────┐   │  │  │
│  │  │  │ EmailContext.tsx                           │   │  │  │
│  │  │  │ • State Management                         │   │  │  │
│  │  │  │ • loadEmails()                             │   │  │  │
│  │  │  │ • connectToMailServer()                    │   │  │  │
│  │  │  │ • Auto-connect from saved settings         │   │  │  │
│  │  │  └────────────────────────────────────────────┘   │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌────────────────────────────────────────────┐   │  │  │
│  │  │  │ API Layer (src/api/api.ts)                 │   │  │  │
│  │  │  │ • connectImap()                            │   │  │  │
│  │  │  │ • listEmails()                             │   │  │  │
│  │  │  │ • sendEmail()                              │   │  │  │
│  │  │  │ • configureSMTP()                          │   │  │  │
│  │  │  │ • getSettings() / saveSettings()           │   │  │  │
│  │  │  └────────────────────────────────────────────┘   │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌────────────────────────────────────────────┐   │  │  │
│  │  │  │ UI Components                              │   │  │  │
│  │  │  │ • Inbox.tsx / MailList.tsx                 │   │  │  │
│  │  │  │ • EmailView.tsx                            │   │  │  │
│  │  │  │ • Settings.tsx (NEW)                       │   │  │  │
│  │  │  │ • NewMail.tsx                              │   │  │  │
│  │  │  └────────────────────────────────────────────┘   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Receiving Emails

```
User Opens App
    ↓
Settings.tsx (Configured? If not: Show Settings)
    ↓
EmailContext.connectToMailServer(imapConfig)
    ↓
window.emailAPI.connectImap() [IPC Call]
    ↓
Electron Main (ipcHandler: 'imap:connect')
    ↓
ImapService.connectImap()
    ↓
ImapFlow connects to IMAP Server ✓
    ↓
EmailContext.loadEmails('INBOX')
    ↓
window.emailAPI.listEmails() [IPC Call]
    ↓
Electron Main (ipcHandler: 'imap:listEmails')
    ↓
ImapService.listEmails('INBOX')
    ↓
ImapFlow fetches emails from IMAP Server
    ↓
mailparser parses email content
    ↓
Return parsed emails to React
    ↓
EmailContext updates state
    ↓
MailList.tsx renders email list ✓
```

### Sending an Email

```
User Clicks "Compose"
    ↓
NewMail.tsx (Fills form)
    ↓
User Clicks "Send"
    ↓
window.emailAPI.sendEmail(mailOptions) [IPC Call]
    ↓
Electron Main (ipcHandler: 'mail:sendEmail')
    ↓
NodemailerService.sendEmail()
    ↓
Nodemailer connects to SMTP Server
    ↓
Sends email ✓
    ↓
Return messageId to React
    ↓
Show "Email Sent" notification ✓
```

### Configuration Retrieval

```
App starts
    ↓
EmailContext.useEffect()
    ↓
window.emailAPI.getSettings() [IPC Call]
    ↓
Electron Main (ipcHandler: 'settings:getSettings')
    ↓
Return saved settings object
    ↓
If imapConfig exists:
    ↓
Auto-connect: connectToMailServer(imapConfig)
    ↓
Load emails from INBOX ✓
```

## Security Model

```
┌─────────────────────────────────────────────────────┐
│           React (Untrusted)                         │
│                                                      │
│  window.emailAPI.connectImap(config) [Only this]   │
└────────────────┬─────────────────────────────────────┘
                 │
          (contextBridge bridge)
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  preload.ts (Exposed via contextBridge)            │
│                                                      │
│  Only specific functions exposed:                  │
│  • connectImap  • listFolders  • listEmails        │
│  • getEmail     • deleteEmail  • moveEmail         │
│  • configureSMTP • sendEmail  • saveSettings       │
│                                                      │
│  ✓ Context Isolation Enabled                       │
│  ✓ No direct Node access from React                │
│  ✓ Limited API surface                             │
└────────────────┬─────────────────────────────────────┘
                 │
          (ipcRenderer.invoke)
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│     Electron Main Process (Trusted)                │
│                                                      │
│  ipcHandlers.ts handles IPC events                 │
│  Services have full Node access                    │
│  Can access file system, process, etc.             │
│                                                      │
│  ✓ Password handling here (never in React)         │
│  ✓ Direct server access                            │
│  ✓ Full npm module ecosystem                       │
└─────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
├── NavBar (Top navigation)
├── Sidebar (Folder navigation)
│   └── Folder list from ImapFlow
├── Main Content Area
│   ├── MailList.tsx (Email list)
│   │   └── ImapFlow emails
│   ├── EmailView.tsx (Selected email)
│   │   └── Full email content
│   ├── NewMail.tsx (Compose)
│   │   └── Sends via Nodemailer
│   ├── Settings.tsx (NEW - Configuration)
│   │   ├── IMAP Config Form
│   │   └── SMTP Config Form
│   └── Other pages
│       └── Sent, Drafts, Spam, Trash
└── EmailProvider (Context)
    ├── State: emailList, selectedEmail, etc.
    ├── IPC Methods: loadEmails, connectToMailServer
    └── Utilities: getHeader, getEmailBody, decodeBase64
```

## Configuration State Persistence

```
Settings.tsx
    ↓
User enters IMAP/SMTP config
    ↓
api.saveSettings({ imapConfig, smtpConfig })
    ↓
window.emailAPI.saveSettings() [IPC Call]
    ↓
Electron Main: ipcHandler 'settings:saveSettings'
    ↓
Store in memory (can be extended to file/database)
    ↓
On app restart:
    ↓
EmailContext.useEffect() calls api.getSettings()
    ↓
Auto-loads saved configuration ✓
    ↓
Auto-connects to email server ✓
```

## Thread Model

```
Main Thread
│
├─ Electron Main Process
│  ├─ Window management
│  ├─ IPC handling
│  └─ Services (IMAP/SMTP connections)
│
└─ Renderer Process (UI Thread)
   ├─ React rendering
   ├─ User interactions
   └─ IPC requests (blocked until response)
```

---

This architecture provides:
✅ **Separation of Concerns** - Frontend (React) vs Backend (Node.js)
✅ **Security** - Context isolation, no dangerous APIs exposed
✅ **Flexibility** - Works with any email provider
✅ **Maintainability** - Clear IPC boundaries
✅ **Scalability** - Can add new services independently
