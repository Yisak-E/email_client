import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
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

// Mock data based on your image
const emails = [
  { id: 1, sender: 'Jack Smith', subject: 'New Business Opportunities', preview: 'Dear Sam, hope this email finds you well...', time: 'Now', read: false },
  { id: 2, sender: 'Sarah Pressth', subject: 'RE: Project Progress', preview: 'Hi Sam, I’ve reviewed the latest...', time: 'Yesterday', read: true },
  { id: 3, sender: 'Dan Towards', subject: 'Insurance Documents', preview: 'Please find the attached LPO...', time: '03 Feb 2026', read: true },
  { id: 4, sender: 'Christine Woods', subject: 'Updated Request', preview: 'I would like to prepare a detailed...', time: '23 Dec 2025', read: true },
  { id: 5, sender: 'Michael Lee', subject: 'Meeting Schedule', preview: 'Can we reschedule our meeting to next week?', time: '15 Dec 2025', read: false },
  { id: 6, sender: 'Emily Davis', subject: 'Project Update', preview: 'The project is progressing well...', time: '10 Dec 2025', read: true },
  { id: 7, sender: 'David Brown', subject: 'Invoice for Services', preview: 'Please find attached the invoice...', time: '05 Dec 2025', read: false },
  { id: 8, sender: 'Sophia Wilson', subject: 'New Collaboration', preview: 'I am interested in collaborating on...', time: '01 Dec 2025', read: true },
  { id: 9, sender: 'James Taylor', subject: 'Feedback on Proposal', preview: 'I have some feedback regarding your proposal...', time: '28 Nov 2025', read: true },
  { id: 10, sender: 'Olivia Martinez', subject: 'Event Invitation', preview: 'You are invited to our annual event...', time: '20 Nov 2025', read: false },
];

const messages = [
  { id: 1, sender: 'Jack Smith', content: 'Dear Sam, hope this email finds you well. I wanted to discuss some new business opportunities that have come up recently. Let me know when you are available for a quick call.', time: 'Now' },
  { id: 2, sender: 'Sarah Pressth', content: 'Hi Sam, I’ve reviewed the latest project progress and everything looks good. We just need to finalize the budget and timeline. Let’s catch up tomorrow to discuss further.', time: 'Yesterday' },
  { id: 3, sender: 'Dan Towards', content: 'Please find the attached LPO for the insurance documents we discussed. Let me know if you need any additional information or if there are any issues with the documents.', time: '03 Feb 2026' },
  { id: 4, sender: 'Christine Woods', content: 'I would like to prepare a detailed report on the updated request. Can you provide me with the latest data and any specific requirements you have for the report?', time: '23 Dec 2025' },
  { id: 5, sender: 'Michael Lee', content: 'Can we reschedule our meeting to next week? I have a conflict with my current schedule and would like to find a time that works for both of us.', time: '15 Dec 2025' },
  { id: 6, sender: 'Emily Davis', content: 'The project is progressing well. We have completed the initial phases and are on track for the next milestones. I will keep you updated on any significant developments.', time: '10 Dec 2025' },
  { id: 7, sender: 'David Brown', content: 'Please find attached the invoice for the services provided. Let me know if you have any questions or if there are any issues with the invoice.', time: '05 Dec 2025' },
  { id: 8, sender: 'Sophia Wilson', content: 'I am interested in collaborating on your upcoming project. I believe my expertise could be a great fit. Let’s discuss how we can work together.', time: '01 Dec 2025' },
  { id: 9, sender: 'James Taylor', content: 'I have some feedback regarding your proposal. Overall, it looks promising, but I have a few suggestions that could improve it. Let’s schedule a time to go over the details.', time: '28 Nov 2025' },
  { id: 10, sender: 'Olivia Martinez', content: 'You are invited to our annual event. It will be a great opportunity to network and learn about the latest industry trends. Please let us know if you can attend.', time: '20 Nov 2025' },
];

const Inbox = () => {
  const [selectedEmail, setSelectedEmail] = React.useState(null);

  const handleEmailClick = (email) => {
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
              Inbox (4)
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
              className="bg-indigo-100 text-indigo-700 font-medium" 
            />
            <Chip label="Read" size="small" variant="outlined" className="text-gray-600" />
            <Chip label="Today" size="small" variant="outlined" className="text-gray-600" />
            <Chip label="Unread" size="small" variant="outlined" className="text-gray-600" />
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
          {emails.map((email) => (
            <React.Fragment key={email.id}>
              <ListItem 
                alignItems="center" 
                button 
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
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Box className="flex-1 p-4" >
        {/* Placeholder for email content view */}
        <Box className="h-full flex flex-col items-center justify-center text-center px-4 bg-gray-300">
            <IconButton size="large" className="mb-4 w-64 h-64">
              <MailLockOutlined className="text-blue-500  text-9xl" />
            </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Inbox;