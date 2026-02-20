/**
 * MAIN PROCESS - Backend Layer (3-Layer Architecture)
 * 
 * Core Electron Application - Handles:
 * - IPC Handlers (request/response from Renderer)
 * - Email Services (IMAP, SMTP)
 * - File System Operations
 * - Environment Configuration
 * - Headless Auto-Login & Background Service
 * 
 * Layer Structure:
 * [Main Process] ←→ [Preload Script] ←→ [Renderer/React]
 *  (Backend)         (IPC Bridge)       (Frontend)
 * 
 * Note: This process runs headless (no visible window) and automatically
 * authenticates with IMAP credentials from .env on startup.
 */

// Load environment variables at the very top (BEFORE anything else)
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Initialize environment variables from .env file
 * - Critical: Must happen before any credential access
 * - Tries multiple paths for flexibility
 */
function loadEnvFile() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../../.env'),
  ];

  const existingPath = envPaths.find((candidate) => fs.existsSync(candidate));
  if (existingPath) {
    console.log(`📁 Loading .env from: ${existingPath}`);
    dotenv.config({ path: existingPath });
    console.log('✅ Environment variables loaded');
  } else {
    console.warn('⚠️ .env file not found');
  }
}

loadEnvFile();

// NOW import other modules after dotenv is initialized
import { app, BrowserWindow, Menu, Tray, ipcMain, Notification } from 'electron';
import isDev from './isDev';
import { connectImap, listEmails } from './services/imapService';

// Track sync state
let lastSyncedUIDs: Set<number> = new Set();
let syncTimer: NodeJS.Timeout | null = null;
let tray: Tray | null = null;

// Polyfill diagnostics_channel for pino compatibility
try {
  const diagnosticsChannel = require('node:diagnostics_channel');
  if (!diagnosticsChannel.tracingChannel) {
    const createTracingChannel = () => ({
      hasSubscribers: false,
      publish: () => { },
      subscribe: () => { },
      unsubscribe: () => { },
      traceSync: (fn: (...args: any[]) => any, ...args: any[]) => {
        try {
          return fn(...args);
        } catch (e) {
          return undefined;
        }
      },
      tracePromise: async (fn: (...args: any[]) => any, ...args: any[]) => {
        try {
          return await fn(...args);
        } catch (e) {
          return undefined;
        }
      },
    });
    diagnosticsChannel.tracingChannel = createTracingChannel;
    console.log('✅ diagnosticsChannel.tracingChannel polyfill applied');
  }
} catch (pollyfillError) {
  console.error('⚠️ Failed to polyfill diagnostics_channel:', pollyfillError);
}

let mainWindow: BrowserWindow | null = null;
let isAutoLoginComplete = false;

/**
 * Attempt to auto-login using IMAP credentials from .env
 * This runs in headless mode - no UI feedback, only console logging
 */
async function initiateAutoLogin() {
  try {
    console.log('\n🔐 === HEADLESS AUTO-LOGIN INITIATED ===');

    // Extract IMAP credentials from environment (support both VITE_ and non-prefixed)
    const imapHost = process.env.VITE_GMAIL_IMAP_HOST || process.env.GMAIL_IMAP_HOST || 'imap.gmail.com';
    const imapPort = parseInt(
      process.env.VITE_GMAIL_IMAP_PORT || process.env.GMAIL_IMAP_PORT || '993',
      10
    );
    const imapUser = process.env.VITE_GMAIL_IMAP_USER || process.env.GMAIL_IMAP_USER;
    const imapPass = process.env.VITE_GMAIL_IMAP_PASS || process.env.GMAIL_IMAP_PASS;

    if (!imapUser || !imapPass) {
      console.error('❌ CRITICAL: IMAP credentials not found in .env file');
      console.error('   Required: VITE_GMAIL_IMAP_USER and VITE_GMAIL_IMAP_PASS');
      isAutoLoginComplete = false;
      return;
    }

    console.log(`📧 Target: ${imapHost}:${imapPort}`);
    console.log(`👤 User: ${imapUser}`);

    // Attempt IMAP connection
    const result = await connectImap({
      host: imapHost,
      port: imapPort,
      secure: true,
      auth: {
        user: imapUser,
        pass: imapPass,
      },
    });

    console.log('\n✅ === HEADLESS AUTO-LOGIN SUCCESSFUL ===');
    console.log('📦 Background process is ready to accept IPC requests\n');
    isAutoLoginComplete = true;
  } catch (error) {
    console.error('\n❌ === HEADLESS AUTO-LOGIN FAILED ===');
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('App will continue running to accept IPC requests\n');
    isAutoLoginComplete = false;
  }
}

/**
 * Setup system tray with context menu
 */
function setupTray() {
  try {
    const iconPath = isDev
      ? path.join(__dirname, '../public/icon.png')
      : path.join(__dirname, '../resources/icon.png');

    if (fs.existsSync(iconPath)) {
      tray = new Tray(iconPath);

      const contextMenu = Menu.buildFromTemplate([
        {
          label: '📩 Open Inbox',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
            }
          },
        },
        {
          label: '🔄 Check for Mail',
          click: async () => {
            await syncEmails();
            tray?.displayBalloon({
              title: '✅ Sync Complete',
              content: 'Checked for new mail',
            });
          },
        },
        { type: 'separator' },
        {
          label: '❌ Quit',
          click: () => {
            app.quit();
          },
        },
      ]);

      tray.setContextMenu(contextMenu);
      tray.setToolTip('Email Client - Headless Mode');
      console.log('✅ System tray icon created');
    } else {
      console.warn('⚠️ Tray icon not found at:', iconPath);
    }
  } catch (err) {
    console.error('Failed to setup system tray:', err);
  }
}

/**
 * Background sync: Check INBOX for new emails every 5 minutes
 */
async function syncEmails() {
  try {
    if (!isAutoLoginComplete) {
      console.log('⏭️  Skipping sync: Auto-login not complete');
      return;
    }

    console.log('🔄 === BACKGROUND SYNC STARTED ===');

    const result = await listEmails('INBOX', { limit: 100, offset: 0 });
    const currentUIDs = new Set(result.emails.map((e: any) => e.uid));

    // Detect new emails
    const newEmails = Array.from(currentUIDs).filter((uid) => !lastSyncedUIDs.has(uid));

    if (newEmails.length > 0) {
      console.log(`📬 Found ${newEmails.length} new email(s)`);

      // Send notification to renderer
      if (mainWindow && !mainWindow.isVisible()) {
        new Notification({
          title: '📧 New Email',
          body: `You have ${newEmails.length} new message(s)`,
          icon: path.join(__dirname, '../public/icon.png'),
        }).show();
      }

      // Broadcast to renderer via IPC
      mainWindow?.webContents?.send('emails:synced', {
        newEmailCount: newEmails.length,
        totalEmails: result.total,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log('✅ No new emails');
    }

    // Update tracked UIDs
    lastSyncedUIDs = currentUIDs;
    console.log('✅ === SYNC COMPLETE ===\n');
  } catch (err) {
    console.error('❌ Sync failed:', err instanceof Error ? err.message : err);
    // Don't crash - will retry next cycle
  }
}

/**
 * Start background sync timer (5 minute interval)
 */
function startBackgroundSync() {
  console.log('⏰ Starting background sync timer (5 minute interval)');

  // Run first sync immediately
  syncEmails();

  // Then every 5 minutes
  syncTimer = setInterval(() => {
    syncEmails();
  }, 5 * 60 * 1000); // 5 minutes
}

/**
 * Stop background sync timer
 */
function stopBackgroundSync() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
    console.log('⏱️  Background sync timer stopped');
  }
}

function createWindow() {
  const preloadCandidates = [
    path.join(__dirname, 'preload.js'),
    path.join(__dirname, 'preload.ts'),
  ];
  const preloadPath = preloadCandidates.find((candidate) => fs.existsSync(candidate)) || path.join(__dirname, 'preload.js');

  console.log('🔧 Main process debug info:');
  console.log('   __dirname:', __dirname);
  console.log('   Preload candidates:', preloadCandidates);
  console.log('   Selected preload path:', preloadPath);
  console.log('   Preload exists:', fs.existsSync(preloadPath));

  // Check if running in headless mode
  const headlessMode = process.env.HEADLESS === 'true' || process.env.HEADLESS === '1';

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: !headlessMode,  // Hide if headless
    skipTaskbar: headlessMode,  // Hide from taskbar if headless
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    icon: isDev ? undefined : path.join(__dirname, '../resources/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  console.log('📍 Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
    console.log('🔨 DevTools opened (development mode)');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Log when preload script has loaded
  mainWindow.webContents.on('did-frame-finish-load', () => {
    console.log('✅ Preload script loaded, contextBridge should be available');
  });

  // Log any console messages from renderer for debugging
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    if (message.includes('Electron API')) {
      console.log(`[Renderer] ${message}`);
    }
  });

  // Hide to system tray on close (if headless)
  mainWindow.on('close', (event) => {
    if (headlessMode && tray) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  const { setupIpcHandlers } = require('./ipcHandlers') as typeof import('./ipcHandlers');
  setupIpcHandlers(mainWindow);
}

// App event handlers
app.on('ready', async () => {
  console.log('\n═══════════════════════════════════════');
  console.log('🚀 ELECTRON HEADLESS SERVICE STARTING');
  console.log('═══════════════════════════════════════\n');

  // Setup system tray icon
  setupTray();

  // Create the hidden window first (for IPC handlers)
  createWindow();

  // Initiate auto-login immediately
  await initiateAutoLogin();

  // Start background sync timer after auto-login
  if (isAutoLoginComplete) {
    startBackgroundSync();
  }
});

app.on('window-all-closed', () => {
  // Keep app running in background (headless mode)
  console.log('\n⚠️  Window closed, but process continues running in headless mode...');
  console.log('   Waiting for IPC requests from renderer or external processes\n');
});

app.on('before-quit', () => {
  // Cleanup
  stopBackgroundSync();
  if (tray) {
    tray.destroy();
  }
  console.log('🛑 Electron app shutting down...');
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle uncaught exceptions (critical for headless operation)
process.on('uncaughtException', (error) => {
  console.error('\n🚨 UNCAUGHT EXCEPTION in main process:');
  console.error('Message:', error instanceof Error ? error.message : error);
  console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
  // Don't exit - let the app continue running
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('\n🚨 UNHANDLED PROMISE REJECTION:');
  console.error('Reason:', reason instanceof Error ? reason.message : reason);
  // Don't exit - let the app continue running
});

export { mainWindow };

