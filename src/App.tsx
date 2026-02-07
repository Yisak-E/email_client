import './App.css'
import Inbox from './pages/Inbox'
import {
  Avatar,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Settings, Create, MailOutline, Person } from '@mui/icons-material';
import React from 'react';

function App() {
  const [selectedView, setSelectedView] = React.useState('inbox');


  return (
    <main className="min-h-screen bg-gray-50 flex items-left justify-start w-full">
      <Box className="flex justify-between h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
          <Box className="flex flex-col justify-between  w-16 h-screen bg-gray-100 p-4 border border-gray-900">
            {/* Placeholder for potential sidebar icons */}
            <Box className="flex flex-col items-center gap-4">
                <IconButton size="small" className="mb-4">
                    <Create className="text-gray-400" />
                </IconButton>
                <IconButton size="small" className="mb-4" onClick={() => setSelectedView('inbox')}>
                    <MailOutline className="text-gray-400" />
                </IconButton>
                <IconButton>
                    <Person  className="text-gray-400" />
                </IconButton>
            </Box>
        
            {/* bottom placeholder */}
            <Box>
                <IconButton size="small" className="mt-auto">
                    {/* settings */}
                    <Settings className="text-gray-400" />
                </IconButton>
                <IconButton size="small" className="mt-4">
                    {/* profile */}
                    <Avatar src="https://i.pravatar.cc/150?u=profile" className="w-8 h-8 border-2 border-white shadow-sm" />
                </IconButton>
            </Box>
        </Box>
         <Inbox /> 
       
      </Box>
     
    </main>
  )
}

export default App
