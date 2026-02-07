import React from 'react';
import messagesData from '../../public/data/messages.json';
import { 
  Box, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemAvatar, 
  ListItemText, 
  Chip, 
  IconButton, 
  Divider,
  InputBase,
  Paper,
} from '@mui/material';
import { 
  Search, 
  MoreVert, 
  CheckCircleOutline, 
  RadioButtonUnchecked, 
  Settings,
    Create,
    MailOutline,
    Person,
    MailLockOutlined
} from '@mui/icons-material';


type MessageType = {
  id: number | string,
  sender: string,
  subject: string,
  content: string,
  time: string,
  status: string,
  read: boolean,
  preview?: string
}

const Inbox = () => {
  const [selectedEmail, setSelectedEmail] = React.useState<MessageType | null>(null);
  const [filter, setFilter] = React.useState('All');
  const [emailList, setEmailList] = React.useState<MessageType[]>([]);


  React.useEffect(() => {
    if (filter === 'All') {
      setEmailList(messagesData.emails as MessageType[]);
    }
      else if (filter === 'Read') {
        setEmailList(messagesData.emails.filter(email => email.read) as MessageType[]);
    } else if (filter === 'Unread') {
        setEmailList(messagesData.emails.filter(email => !email.read) as MessageType[]);
    } else if (filter === 'Today') {
          const todayLabel = 'Now';
          setEmailList(messagesData.emails.filter(email => email.time === todayLabel) as MessageType[]);
    }

        }, [filter]);



  const handleEmailClick = (email: MessageType | null) => {
    setSelectedEmail(email);
  };

  return (
    <Box className=" flex justify-between h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
       <Box className="flex flex-col justify-between  w-16 h-screen bg-gray-100 p-4 border border-gray-900">
            {/* Placeholder for potential sidebar icons */}
            <Box className="flex flex-col items-center gap-4">
                <IconButton size="small" className="mb-4">
                    <Create className="text-gray-400" />
                </IconButton>
                <IconButton size="small" className="mb-4">
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
      
      <Box className="w-1/4 flex flex-col">
        
        {/* Header Section */}
        <Box className="p-4 flex flex-col gap-4">
          <Box className="flex justify-between items-center">
            <Typography variant="h6" className="font-bold text-gray-800">
              Inbox ({emailList.length})
            </Typography>
            <IconButton size="small">
              <RadioButtonUnchecked className="text-gray-400" />
            </IconButton>
          </Box>

          {/* Filter Chips */}
          <Box className="flex gap-2">
            <Chip 
              label="All" 
              icon={<CheckCircleOutline style={{ fontSize: '16px' }} />} 
              size="small" 
              onClick={() => setFilter('All')}
              className={`font-medium ${filter === 'All' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
            />
            <Chip 
              label="Read" 
              size="small" 
              variant="outlined" 
              onClick={() => setFilter('Read')}
              className={filter === 'Read' ? 'text-indigo-700 border-indigo-200' : 'text-gray-600'} 
            />
            <Chip 
              label="Today" 
              size="small" 
              variant="outlined" 
              onClick={() => setFilter('Today')}
              className={filter === 'Today' ? 'text-indigo-700 border-indigo-200' : 'text-gray-600'} 
            />
            <Chip 
              label="Unread" 
              size="small" 
              variant="outlined" 
              onClick={() => setFilter('Unread')}
              className={filter === 'Unread' ? 'text-indigo-700 border-indigo-200' : 'text-gray-600'} 
            />
            <Typography variant="caption" className="ml-auto cursor-pointer text-indigo-600 font-medium self-center">
              Clear
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Search Bar (Simulated from the top of your image) */}
        <Box className="px-4 py-2">
           <Paper 
            elevation={0} 
            className="flex items-center px-3 py-1 bg-gray-100 rounded-full"
          >
            <Search className="text-gray-400 mr-2" />
            <InputBase placeholder="Global Search" className="text-sm w-full" />
            <MoreVert className="text-gray-400" />
          </Paper>
        </Box>

        {/* Email List */}
        <List className="overflow-y-scroll h-[800px] pt-0">
          {emailList.map((email) => (
            <React.Fragment key={email.id.toString()}>
              <ListItem 
                alignItems="center" 
                disablePadding
              >
                <ListItemButton
                  onClick={() => handleEmailClick(messagesData.emails.find(msg => msg.id === email.id) || null)}
                  className={`hover:bg-indigo-50 transition-colors cursor-pointer px-4 ${!email.read ? 'bg-indigo-50/30' : ''}`}
                >
                <ListItemAvatar>
                  <Avatar 
                    src={`https://i.pravatar.cc/150?u=${email.id}`} 
                    className="w-12 h-12 border-2 border-white shadow-sm"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box className="flex justify-between items-center">
                      <Typography variant="subtitle2" className="font-bold text-gray-900">
                        {email.sender}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {email.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" className="block font-semibold text-gray-700">
                        {email.subject}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500 line-clamp-1">
                        {email.preview}
                      </Typography>
                    </Box>
                  }
                />
                {!email.read && (
                  <Box className="ml-2 mt-2 w-2 h-2 bg-indigo-600 rounded-full" />
                )}
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Box className="flex-1 p-4" >
        {/* Placeholder for email content view */}
        <Box className="h-full flex flex-col items-center justify-center text-center px-4 bg-gray-300">
           {
            selectedEmail ? (
              <Box className="bg-white p-6  shadow-md w-full h-full overflow-y-auto">
                <Typography variant="h5" className="font-bold mb-2">
                  {selectedEmail.subject}
                </Typography>
                <Typography variant="subtitle2" className="text-gray-700 mb-4">
                  From: {selectedEmail.sender} - {selectedEmail.time}
                </Typography>
                 <Box className="mt-4 w-2/3 mx-auto" >
                  <Typography variant="body1" className="text-gray-800 whitespace-pre-line">
                    {selectedEmail.content}
                  </Typography>
                 </Box>
              </Box>
            ) : (
              <Box className="flex flex-col items-center gap-4">
                <MailLockOutlined className="text-gray-400" style={{ fontSize: '48px' }} />
                <Typography variant="h6" className="text-gray-600">
                  Select an email to view its content
                </Typography>
              </Box>
            )

           } 
        </Box>
      </Box>
    </Box>
  );
};

export default Inbox;