import { Box, IconButton, Avatar } from "@mui/material";
import { Settings, Person, Create, MailOutline, SendAndArchive, Send, SendOutlined } from "@mui/icons-material";
import { useEmailContext } from "../../EmailContext";



const Sidebar = () => {
    const {  setSelectedView } = useEmailContext();
  return (
     <Box className="flex flex-col justify-between  w-16 h-full bg-gray-100 p-4 border border-gray-900">
            {/* Placeholder for potential sidebar icons */}
            <Box className="flex flex-col items-center gap-4">
                 <IconButton onClick={() => setSelectedView('newmail')}>
                    <Create className="text-gray-400" />
                </IconButton>
                <IconButton size="small" className="mb-4" onClick={() => setSelectedView('view')}>
                    <MailOutline className="text-gray-400" />
                </IconButton>
                <IconButton onClick={() => setSelectedView('contacts')}>
                    <Send  className="text-purple-500" />
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
)
}

export default Sidebar;