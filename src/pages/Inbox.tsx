import React from 'react';

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
  MailLockOutlined
} from '@mui/icons-material';
import { useEmailContext } from '../EmailContext';
import {type MessageType}  from '../types/MailType';
import messagesData from "../../public/data/messages.json";





const Inbox = () => {
 const  {selectedEmail, setSelectedEmail, filter, setFilter, searchTerm, setSearchTerm, emailList, handle} = useEmailContext();


 const handleEmailClick = (email: MessageType | null) => {
  setSelectedEmail(email);
}
 

  return (
    <Box className=" flex justify-between h-full w-full bg-white rounded-l-3xl overflow-hidden border-r border-gray-100 ">
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
              variant={filter === 'All' ? 'filled' : 'outlined'}
              size="small" 
               icon={filter === 'All' ? <CheckCircleOutline className="text-indigo-700" /> : <RadioButtonUnchecked className="text-gray-400" />}
              onClick={() => setFilter('All')}
              className={`font-medium ${filter === 'All' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
            />
            <Chip 
              label="Read" 
              size="small" 
              icon={filter === 'Read' ? <CheckCircleOutline className="text-indigo-700" /> : <RadioButtonUnchecked className="text-gray-400" />} 
              variant={filter === 'Read' ? 'filled' : 'outlined'}
              onClick={() => setFilter('Read')}
              className={filter === 'Read' ? 'text-indigo-700 border-indigo-200' : 'text-gray-600'} 
            />
            <Chip 
              label="Today" 
              size="small" 
              icon={filter === 'Today' ? <CheckCircleOutline className="text-indigo-700" /> : <RadioButtonUnchecked className="text-gray-400" />}
              variant={filter === 'Today' ? 'filled' : 'outlined'}
              onClick={() => setFilter('Today')}
              className={filter === 'Today' ? 'text-indigo-700 border-indigo-200' : 'text-gray-600'} 
            />
            <Chip 
              label="Unread" 
              size="small" 
              variant={filter === 'Unread' ? 'filled' : 'outlined'}
              icon={filter === 'Unread' ? <CheckCircleOutline className="text-indigo-700" /> : <RadioButtonUnchecked className="text-gray-400" />}
              onClick={() => setFilter('Unread')}
              className={filter === 'Unread' ? 'text-indigo-700 border-indigo-200' : 'text-gray-600'} 
            />
            <Typography 

            variant="caption" className="ml-auto cursor-pointer text-indigo-600 font-medium self-center" onClick={() => setSearchTerm('')}>
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
            <InputBase placeholder="Global Search" className="text-sm w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

      {/* Right-hand email content view */}
      <EmailView
        selectedEmail={selectedEmail}
        setSelectedEmail={setSelectedEmail}
      />
    </Box>
  );
};

export default Inbox;

type EmailViewProps = {
  selectedEmail: MessageType | null;
  setSelectedEmail: (email: MessageType | null) => void;
};

const EmailView = ({ selectedEmail }: EmailViewProps) => {
    
  return (
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
  );
};