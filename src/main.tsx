import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { EmailProvider } from './EmailContext';
import { ThemeProvider, createTheme } from "@mui/material/styles"; const theme = createTheme({ palette: { primary: { main: "#1976d2" }, secondary: { main: "#9c27b0" } } });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmailProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </EmailProvider>
  </StrictMode>
);
