import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import isDev from './isDev';

const diagnosticsChannel = require('node:diagnostics_channel');

if (typeof (diagnosticsChannel as any).tracingChannel !== 'function') {
  (diagnosticsChannel as any).tracingChannel = () => ({
    hasSubscribers: false,
    publish: () => { },
    subscribe: () => { },
    unsubscribe: () => { },
    traceSync: (fn: (...args: any[]) => any, ...args: any[]) => fn(...args),
    tracePromise: async (fn: (...args: any[]) => any, ...args: any[]) => fn(...args),
  });
}

let mainWindow: BrowserWindow | null = null;

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
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      //enableRemoteModule: false,
      nodeIntegration: false,
      // Security: Sandbox the renderer process
      sandbox: true,
    },
    icon: isDev ? undefined : path.join(__dirname, '../resources/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const { setupIpcHandlers } = require('./ipcHandlers') as typeof import('./ipcHandlers');
  setupIpcHandlers(mainWindow);
}

// App event handlers
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS, keep the app running until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

export { mainWindow };

