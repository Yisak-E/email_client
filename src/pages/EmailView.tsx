import { Box, Typography } from '@mui/material';
import { MailLockOutlined } from '@mui/icons-material';
import { useEmailContext } from '../EmailContext';


const EmailView = () => {
  const {selectedEmail} = useEmailContext();
    
  return (
     <Box className="flex-1 p-4 h-full" >
        {/* Placeholder for email content view */}
        <Box className="h-full flex flex-col items-center justify-center text-center px-4 bg-gray-300">
           {
            selectedEmail ? (
              <Box className="bg-white p-6  shadow-md w-full h-full overflow-y-auto">
                <Typography variant="h5" className="font-bold mb-2">
                  {selectedEmail.subject}
                </Typography>
                <Typography variant="subtitle2" className="text-gray-700 mb-1">
                  From: {selectedEmail.sender}
                </Typography>
                {selectedEmail.to && (
                  <Typography variant="subtitle2" className="text-gray-700 mb-1">
                    To: {selectedEmail.to}
                  </Typography>
                )}
                <Typography variant="subtitle2" className="text-gray-500 mb-4">
                  {selectedEmail.time}
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

export default EmailView;