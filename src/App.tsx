import './App.css';
import Inbox from './pages/Inbox';
import { Box } from '@mui/material';
import Contacts from './pages/Contacts';
import NewMail from './pages/NewMail';
import Sidebar from './components/layout/Sidebar';
import { useEmailContext } from './EmailContext';

function App() {
  const { selectedView } = useEmailContext();
 
  return (

      <Box className="flex flex-col  h-screen w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">

      {/* nav bar top */}
      <Box  className="flex flex-col  w-full h-16 bg-gray-100 p-4 border border-gray-900">
        
      </Box>
       
      {/* main content */}

      <Box className="flex flex-row h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
        <Sidebar />
        {selectedView === 'inbox' && <Inbox />}
        {selectedView === 'newmail' && <NewMail />}
        {selectedView === 'contacts' && <Contacts />}
      </Box>


       
      
       
      </Box>
     
  )
}

export default App
