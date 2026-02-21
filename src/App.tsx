
import { EmailProvider } from './EmailContext';


import { M3Provider } from 'm3r';
import CalendarView from './Component/Views/CalendarView';
import ComposeModal from './Components/Mail/ComposeMail';
import MainLayout from './Component/layout/MainLayout';
import EmailView from './Component/Views/EmailView';
import { useState } from 'react';


function App() {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [currentView, setCurrentView] = useState<'email' | 'calendar'>('email');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <M3Provider themeColor="#777" themeMode={themeMode} key={themeMode}>
       <EmailProvider>  
          <MainLayout
            isDarkMode={themeMode === 'dark'}
            onToggleTheme={toggleTheme}
            onViewChange={setCurrentView}
            onComposeClick={() => setIsComposeOpen(true)}
          >
            {currentView === 'email' && <EmailView />}
          </MainLayout>
          <ComposeModal open={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
        </EmailProvider>
    </M3Provider >
  )
}


export default App
