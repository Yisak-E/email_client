/**
 * Attachment Download Helper
 * Handles saving email attachments to user's Downloads folder
 */

import { app, ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * Save attachment to Downloads folder
 * @param filename - Name of the file to save
 * @param content - File content (Buffer or base64 string) 
 * @returns Path where file was saved
 */
export async function saveAttachment(filename: string, content: Buffer | string): Promise<string> {
  try {
    const downloadsPath = app.getPath('downloads');
    const filepath = path.join(downloadsPath, filename);

    // Convert content to Buffer if needed
    let buffer: Buffer;
    if (typeof content === 'string') {
      buffer = Buffer.from(content, 'base64');
    } else {
      buffer = content;
    }

    // Write to file
    await fs.promises.writeFile(filepath, buffer);
    console.log(`📥 Attachment saved: ${filepath}`);

    return filepath;
  } catch (err) {
    console.error('Failed to save attachment:', err);
    throw new Error(`Failed to save attachment: ${err instanceof Error ? err.message : err}`);
  }
}

/**
 * Setup IPC handler for attachment downloads
 */
export function setupAttachmentHandlers() {
  ipcMain.handle('attachments:download', async (event, filename: string, content: string) => {
    try {
      const filepath = await saveAttachment(filename, content);
      return { success: true, filepath };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  });

  ipcMain.handle('attachments:openDownloads', async () => {
    try {
      const downloadsPath = app.getPath('downloads');
      require('electron').shell.openPath(downloadsPath);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  });
}
