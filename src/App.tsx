
import { EmailProvider } from './EmailContext';


import { M3Provider } from 'm3r';
import CalendarView from './Components/Views/CalendarView';
import ComposeModal from './Components/Mail/ComposeMail';
import MainLayout from './Components/Layout/MainLayout';
import EmailView from './Components/Views/EmailView';
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
            {currentView === 'calendar' && <CalendarView />}
            
          </MainLayout>
          <ComposeModal open={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
        </EmailProvider>
    </M3Provider >
  )
}


export default App
