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
import { app, BrowserWindow } from 'electron';
import isDev from './isDev';
import { connectImap } from './services/imapService';

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

function createWindow() {
  const preloadCandidates = [
    path.join(__dirname, 'preload.js'),
    path.join(__dirname, 'preload.ts'),
  ];
  const preloadPath = preloadCandidates.find((candidate) => fs.existsSync(candidate)) || path.join(__dirname, 'preload.js');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: false,  // Start hidden
    skipTaskbar: true,  // Don't show in taskbar
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

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const { setupIpcHandlers } = require('./ipcHandlers') as typeof import('./ipcHandlers');
  setupIpcHandlers(mainWindow);
}

// App event handlers
app.on('ready', async () => {
  console.log('\n═══════════════════════════════════════');
  console.log('🚀 ELECTRON HEADLESS SERVICE STARTING');
  console.log('═══════════════════════════════════════\n');

  // Create the hidden window first (for IPC handlers)
  createWindow();

  // Initiate auto-login immediately
  await initiateAutoLogin();
});

app.on('window-all-closed', () => {
  // Keep app running in background (headless mode)
  console.log('\n⚠️  Window closed, but process continues running in headless mode...');
  console.log('   Waiting for IPC requests from renderer or external processes\n');
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

