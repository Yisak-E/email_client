import { M3Drawer, M3Stack, M3FAB, M3IconButton, M3Box, M3Avatar, M3Typography } from "m3r";
import { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import MailIcon from '@mui/icons-material/Mail';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import M3PaletteIcon from '@mui/icons-material/Palette';



interface MailDrawerProps {
    onToggleTheme?: () => void;
    isDarkMode?: boolean;
    onViewChange?: (view: 'email' | 'calendar') => void;
    onComposeClick?: () => void;
}

export default function MailDrawer({ onToggleTheme, isDarkMode, onViewChange, onComposeClick }: MailDrawerProps) {
    const [selectedItem, setSelectedItem] = useState<string>('email');
    return (
        <M3Drawer
            variant="permanent"
            sx={{
                height: "100%", // Ensure root element takes full height
                '& .MuiDrawer-paper': {
                    position: 'relative',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 2,
                    borderRight: 'none',
                }
            }}
        >
            <M3Stack spacing={3} alignItems="center" sx={{ flexGrow: 1, width: '100%', gap: "12px" }}>
                {/* Compose Button */}
                <M3Stack spacing={1} alignItems="center" sx={{ width: '100%' }}>
                    <M3FAB onClick={onComposeClick}>
                        <CreateIcon />
                    </M3FAB>

                    <M3Stack alignItems="center">
                        <M3IconButton
                            sx={{ width: 60, height: 56 }}
                            onClick={() => {
                                setSelectedItem('email');
                                onViewChange?.('email');
                            }}
                        >
                            <MailIcon color={selectedItem === 'email' ? 'primary' : undefined} />
                        </M3IconButton>
                        <M3Typography variant="labelSmall" sx={{ mt: -0.5 }} color={selectedItem === 'email' ? 'primary' : undefined}>Email</M3Typography>
                    </M3Stack>

                    <M3Stack alignItems="center">
                        <M3IconButton
                            sx={{ width: 60, height: 56 }}
                            onClick={() => {
                                setSelectedItem('calendar');
                                onViewChange?.('calendar');
                            }}
                        >
                            <CalendarTodayIcon color={selectedItem === 'calendar' ? 'primary' : undefined} />
                        </M3IconButton>
                        <M3Typography variant="labelSmall" color={selectedItem === 'calendar' ? 'primary' : undefined}>Calendar</M3Typography>
                    </M3Stack>


                    <M3Stack alignItems="center">
                        <M3IconButton
                            sx={{ width: 60, height: 56 }}
                            onClick={() => setSelectedItem('contacts')}
                        >
                            <PeopleIcon color={selectedItem === 'contacts' ? 'primary' : undefined} />
                        </M3IconButton>
                        <M3Typography variant="labelSmall" color={selectedItem === 'contacts' ? 'primary' : undefined}>Contacts</M3Typography>
                    </M3Stack>
                </M3Stack>

                <M3Box sx={{ flexGrow: 1 }} />

                {/* Bottom Actions */}
                <M3Stack spacing={1} pb={2} marginBottom={0} alignItems="center">
                    <M3IconButton sx={{ width: 60, height: 56 }} size="small">
                        <NotificationsIcon fontSize="small" />
                    </M3IconButton>
                    <M3IconButton sx={{ width: 60, height: 56 }} size="small" onClick={onToggleTheme}>
                        {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </M3IconButton>
                    <M3IconButton sx={{ width: 60, height: 56 }} size="small">
                        <M3PaletteIcon fontSize="small" />
                    </M3IconButton>
                    <M3IconButton sx={{ width: 60, height: 56 }} size="small">
                        <SettingsIcon fontSize="small" />
                    </M3IconButton>
                    <M3Avatar
                        sx={{ width: 60, height: 56 }}
                        alt="User"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    />
                </M3Stack>
            </M3Stack>
        </M3Drawer>
    );
}