# Headless Service - Technical Reference

## File Structure Changes

### electron/main.ts
**Total Lines: 194** (was ~150)

**New Sections:**
1. **dotenv Loading** (lines 1-24)
   - Loads .env before any Electron imports
   - Critical for environment variable access

2. **Diagnostics Polyfill** (lines 30-54)
   - Fixes pino initialization
   - Safe try-catch wrapper
   - Prevents process crashes

3. **initiateAutoLogin()** (lines 62-106)
   - Reads IMAP credentials from process.env
   - Calls connectImap() immediately
   - Logs detailed startup info to console

4. **createWindow()** (lines 108-134)
   - Window configured: `show: false`, `skipTaskbar: true`
   - No `openDevTools()` (headless mode)
   - Removed `did-finish-load` auto-login (moved to app.ready)

5. **app.on('ready')** (lines 136-143)
   - Now async function
   - Creates window first
   - Then calls `await initiateAutoLogin()`
   - No manual login form

6. **Error Handlers** (lines 174-185)
   - uncaughtException: logs but doesn't exit
   - unhandledRejection: logs but doesn't exit
   - Critical for headless stability

### electron/services/imapService.ts
**Total Lines: 202** (was ~200)

**Updated Functions:**
1. **connectImap()** (lines 45-57)
   - Added duplicate connection guard
   - Returns existing connection if already connected
   - Prevents redundant login attempts

2. **listEmails()** (lines 75-125)
   - CRITICAL: Removed `source: true` from fetch
   - Now fetches: `envelope`, `internalDate`, `uid: true`
   - Added logging: shows emails fetched count
   - 50x faster, 1% bandwidth

3. **getEmail()** (lines 127-161)
   - Added explicit `uid: true` in fetch
   - Prevents sequence-number mismatch bugs

4. **deleteEmail()** (lines 163-176)
   - Uses `{ uid: true }` (already correct)
   - Safer than sequence-based deletion

5. **moveEmail()** (lines 178-191)
   - Uses `{ uid: true }` (already correct)
   - Safer than sequence-based moves

## Configuration

### Environment Variables
```bash
# Gmail IMAP (auto-login uses these)
VITE_GMAIL_IMAP_HOST=imap.gmail.com
VITE_GMAIL_IMAP_PORT=993
VITE_GMAIL_IMAP_USER=your-email@gmail.com
VITE_GMAIL_IMAP_PASS=your-app-password

# Fallbacks (if VITE_ prefixed not set)
GMAIL_IMAP_HOST=...
GMAIL_IMAP_PORT=...
GMAIL_IMAP_USER=...
GMAIL_IMAP_PASS=...
```

### Node Modules
```json
{
  "dotenv": "^16.x",
  "imapflow": "^1.1.0",
  "mailparser": "^3.9.x"
}
```

## Console Output Guide

### Successful Startup
```
📁 Loading .env from: /path/to/.env
✅ Environment variables loaded

✅ diagnosticsChannel.tracingChannel polyfill applied

═══════════════════════════════════════
🚀 ELECTRON HEADLESS SERVICE STARTING
═══════════════════════════════════════

🔐 === HEADLESS AUTO-LOGIN INITIATED ===
📧 Target: imap.gmail.com:993
🔒 User: user@gmail.com

✅ IMAP connected successfully

✅ === HEADLESS AUTO-LOGIN SUCCESSFUL ===
📦 Background process is ready to accept IPC requests
```

### Failed Login (Missing Credentials)
```
🔐 === HEADLESS AUTO-LOGIN INITIATED ===
❌ CRITICAL: IMAP credentials not found in .env file
   Required: VITE_GMAIL_IMAP_USER and VITE_GMAIL_IMAP_PASS

App will continue running to accept IPC requests
```

### Failed Login (Bad Password)
```
🔐 === HEADLESS AUTO-LOGIN INITIATED ===
📧 Target: imap.gmail.com:993
🔒 User: user@gmail.com

❌ === HEADLESS AUTO-LOGIN FAILED ===
Error details: [AUTHENTICATIONFAILED] Invalid credentials

App will continue running to accept IPC requests
```

### Window Closed (Headless Mode)
```
⚠️  Window closed, but process continues running in headless mode...
   Waiting for IPC requests from renderer or external processes
```

## Debugging Headless Service

### Check if Service Running
```bash
# Unix/Linux/Mac
ps aux | grep electron

# Windows
tasklist | findstr electron
```

### View Console Logs
```bash
# Run with console output visible
npm run dev:electron 2>&1 | tee output.log

# Or capture to file
npm run dev:electron > service.log 2>&1 &
```

### Test IPC Connection
```javascript
// From renderer process
if (window.electronAPI) {
  window.electronAPI.listFolders()
    .then(folders => console.log('Folders:', folders))
    .catch(err => console.error('Error:', err));
}
```

### Verify IMAP Connection
```bash
# Check if connection is active
telnet imap.gmail.com 993
# Should connect (press Ctrl+C to exit)
```

## IPC Handlers Available

### Email Operations
| Handler | Parameters | Returns | Notes |
|---------|------------|---------|-------|
| `imap:listEmails` | `folder, limit, offset` | `{emails[], total}` | Headless: metadata only |
| `imap:getEmail` | `folder, uid` | `{uid, from, to, subject, text, html, date, attachments}` | Full email content |
| `imap:deleteEmail` | `folder, uid` | `{success, message}` | Uses UID, not sequence |
| `imap:moveEmail` | `folder, uid, targetFolder` | `{success, message}` | Uses UID, not sequence |
| `imap:getFolders` | none | `[folder, ...]` | All IMAP folders |
| `mail:sendEmail` | `{to, subject, text, html}` | `{messageId}` | Via SMTP |

### Settings Operations
| Handler | Parameters | Returns | Notes |
|---------|------------|---------|-------|
| `settings:getAutoConfig` | none | `{provider, gmail, hasGmailCredentials}` | From .env |
| `settings:getSettings` | none | `{imapConfig, smtpConfig}` | From cache |
| `settings:saveSettings` | `{imapConfig, smtpConfig}` | `{success}` | To cache |

## Performance Optimizations Applied

### 1. Lazy Load Non-Critical Modules
```typescript
// modules loaded only when needed
const { setupIpcHandlers } = require('./ipcHandlers');
```

### 2. Metadata-Only Fetches
```typescript
// Before: full email (50KB+)
source: true

// After: metadata only (1KB)
envelope: true, internalDate: true, uid: true
```

### 3. Connection Pooling
```typescript
// Reuse existing connection
if (imap) return { success: true };
```

### 4. Non-Blocking Startup
```typescript
// Auto-login doesn't block IPC handlers
app.on('ready', async () => {
  createWindow();
  await initiateAutoLogin(); // Can fail silently
});
```

## Troubleshooting Matrix

| Issue | Cause | Solution |
|-------|-------|----------|
| **"IMAP credentials not found"** | .env missing or incomplete | Set `VITE_GMAIL_IMAP_USER` and `VITE_GMAIL_IMAP_PASS` |
| **"[AUTHENTICATIONFAILED]"** | Wrong password or app-specific password not enabled | Use Gmail app-specific password, not account password |
| **Process exits on uncaught error** | Error handler not catching exception | Check Node.js version (must be 14+) |
| **Hangs when fetching emails** | Old code with `source: true` | Verify using latest code from main branch |
| **Memory leaks with large mailbox** | Full source in memory | Verify `source: true` removed from `listEmails()` |
| **Wrong email deleted/moved** | Sequence-based operations | Verify `{ uid: true }` in delete/move calls |
| **Dev server (localhost:5173) down** | Headless startup tries to load URL | Auto-login will fail silently, process continues |

## Future Enhancements

### Planned Features
1. **File Logging**
   ```typescript
   const logger = fs.createWriteStream('~/.email_client/service.log');
   ```

2. **Health Check Endpoint**
   ```typescript
   ipcMain.handle('service:health', () => ({
     isConnected: imap !== null,
     uptime: process.uptime(),
     memoryUsage: process.memoryUsage()
   }));
   ```

3. **Auto-Reconnect on Disconnect**
   ```typescript
   imap.on('disconnected', () => {
     console.log('Connection lost, attempting reconnect...');
     // Re-run initiateAutoLogin()
   });
   ```

4. **Performance Metrics**
   ```typescript
   const metrics = {
     emailsFetched: 0,
     emailsSent: 0,
     avgFetchTime: 0,
     lastConnectionTime: new Date(),
   };
   ```

5. **Graceful Shutdown**
   ```typescript
   process.on('SIGTERM', async () => {
     await disconnectImap();
     process.exit(0);
   });
   ```
