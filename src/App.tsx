import './App.css';
import NewMail from './pages/NewMail';
import Sidebar from './components/layout/Sidebar';
import { useEmailContext } from './EmailContext';


import { 
  Box, 
  Typography, 
  IconButton, 
  InputBase,
  Paper,
} from '@mui/material';
import { 
  Person2Outlined,
  Search,
  Settings,
} from '@mui/icons-material';
import EmailView from './pages/EmailView';
import MailList from './components/layout/MailList';

function App() {
  const { selectedView } = useEmailContext();
 
  return (

      <Box className="flex flex-col  h-screen w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">

      {/* nav bar top */}
      <Box  className="flex flex-row  w-full h-16 bg-gray-100 p-4 border border-gray-900 bg-purple-50 items-center justify-between">
        <Typography variant="h5" className="font-bold text-gray-800">
          MyMail
        </Typography>
        {/* global search bar */}
        <Paper
          component="form"
          className="flex items-center w-[600px] w-max-xl mt-2 bg-gray-200 rounded-full px-4 py-1 focus-within:ring-2 focus-within:ring-purple-500"
        >
          <InputBase
            className="flex-1"
            placeholder="Global Search"
            inputProps={{ 'aria-label': 'search emails' }}
          />
          <IconButton type="submit" className="p-1">
            <Search className="text-gray-500" />
          </IconButton>
        </Paper>

        {/* some icons that support additional actions */}
        <Box className="flex items-center gap-4">
          {/* placeholder for potential icons */}
          {/* settings profiles */}
          <IconButton>
            <Settings className="text-black" />
          </IconButton>
          <IconButton>
            <Person2Outlined className="text-black"  />
          </IconButton>
        </Box>
         
      </Box>

      <Box className="flex flex-row h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
        <Sidebar />
        
        {/* side view */}
        <MailList/>
      
        {/* content view */}
        <Box className="flex-1 h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
          {selectedView === 'view' && <EmailView />}
          {selectedView === 'newmail' && <NewMail />}
        </Box>
      
      </Box>
 
       
      </Box>
     
  )
}

export default App
