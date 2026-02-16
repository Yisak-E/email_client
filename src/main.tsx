import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { EmailProvider } from './EmailContext';
import { M3Provider } from "m3r";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <M3Provider themeColor="#2196F3" themeMode="light">
      <EmailProvider>
        <App />
      </EmailProvider>
    </M3Provider>
  </StrictMode>
);
