
/**
 * APP.TSX - Root React Component (Renderer Layer)
 * 
 * Main application layout and routing
 * 
 * 3-Layer Architecture:
 * - Main Process (Backend): electron/main.ts + services
 * - Preload/IPC Bridge: electron/preload.ts
 * - Renderer (Frontend): React app in src/
 */

import { FC } from 'react';
import { M3Box, M3Stack } from 'm3r';
import { EmailProvider } from './EmailContext';
import Home from './pages/home/Home';
import './App.css';

/**
 * Main App Component
 * - Wraps entire app with EmailContext for state management
 * - Provides main layout structure
 * - Routes to Home page
 */
const App: FC = () => {
  return (
    <EmailProvider>
      <M3Box className="main-container">
        <M3Stack className="app-layout">
          <Home />
        </M3Stack>
      </M3Box>
    </EmailProvider>
  );
};

export default App;