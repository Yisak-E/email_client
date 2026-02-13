import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { EmailProvider } from './EmailContext';
import { M3Provider } from "m3r";
import GmailProvider from './context/GmailContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmailProvider>
      <GmailProvider>
        <M3Provider themeColor="#2196F3" themeMode="light">
          <App />
        </M3Provider>
      </GmailProvider>
    </EmailProvider>
  </StrictMode>
);
