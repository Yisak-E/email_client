import { M3Box } from 'm3r';
import MailDrawer from './MailDrawer';
import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    onViewChange: (view: 'email' | 'calendar') => void;
    onComposeClick: () => void;
}

export default function MainLayout({ children, isDarkMode, onToggleTheme, onViewChange, onComposeClick }: MainLayoutProps) {
    return (
        <M3Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'background.default', color: 'text.primary' }}>
            {/* Left Drawer */}
            <M3Box sx={{ width: '80px', flexShrink: 0, height: '100%' }}>
                <MailDrawer
                    onToggleTheme={onToggleTheme}
                    isDarkMode={!isDarkMode}
                    onViewChange={onViewChange}
                    onComposeClick={onComposeClick}
                />
            </M3Box>

            {/* Main Content Area */}
            <M3Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                {children}
            </M3Box>
        </M3Box>
    );
}
