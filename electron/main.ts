import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import isDev from './isDev';
import { setupIpcHandlers } from './ipcHandlers';

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

let mainWindow: BrowserWindow | null = null;

function resolvePreloadPath() {
  const candidates = [
    path.join(__dirname, 'preload.js'),
    path.join(__dirname, 'preload.ts'),
  ];

  const selected = candidates.find((candidate) => fs.existsSync(candidate));
  if (!selected) {
    throw new Error(`Preload script not found. Checked: ${candidates.join(', ')}`);
  }

  return selected;
}

async function createMainWindow() {
  const preloadPath = resolvePreloadPath();

  console.log('\n═══════════════════════════════════════');
  console.log('🚀 ELECTRON MAIN PROCESS STARTING');
  console.log('═══════════════════════════════════════');
  console.log('🔧 Main process debug info:');
  console.log(`   __dirname: ${__dirname}`);
  console.log(`   Selected preload path: ${preloadPath}`);
  console.log(`   Preload exists: ${fs.existsSync(preloadPath)}`);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      devTools: true,
    },
  });

  setupIpcHandlers(mainWindow);

  if (isDev) {
    const url = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    console.log(`📍 Loading URL: ${url}`);
    await mainWindow.loadURL(url);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log(`📍 Loading file: ${indexPath}`);
    await mainWindow.loadFile(indexPath);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    //mainWindow = null;
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load renderer:', { errorCode, errorDescription, validatedURL });
  });
}

app.whenReady().then(async () => {
  try {
    await createMainWindow();
  } catch (error) {
    console.error('❌ Failed to create main window:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow().catch((error) => {
        console.error('❌ Failed to re-create main window:', error);
      });
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('\n🚨 UNHANDLED PROMISE REJECTION:');
  console.error('Reason:', reason instanceof Error ? reason.message : reason);
});

process.on('uncaughtException', (error) => {
  console.error('\n🚨 UNCAUGHT EXCEPTION:');
  console.error(error);
});

export { mainWindow };
