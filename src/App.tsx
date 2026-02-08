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
import Contacts from './pages/Contacts';
import NewMail from './pages/NewMail';
import Sidebar from './components/layout/Sidebar';

function App() {
 


  return (

      <Box className="flex flex-col  h-screen w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">

      {/* nav bar top */}
      <Box  className="flex flex-col  w-full h-16 bg-gray-100 p-4 border border-gray-900">
         <Sidebar />
      </Box>

      
      {/* main content */}

      <Box className="flex flex-row  h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
        

         {
          selectedView === 'inbox' && <Inbox />
        }
        {
          selectedView === 'contacts' && <Contacts />
        }
        {
          selectedView === 'newmail' && <NewMail />
        }
        
      </Box>


       
      
       
      </Box>
     
  )
}

export default App
