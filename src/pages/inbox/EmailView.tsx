import { useEmailContext } from '../../EmailContext';
import { M3Box, M3Typography } from 'm3r';
import { MdMail } from 'react-icons/md';


const EmailView = () => {
  const {selectedEmail} = useEmailContext();
    
  return (
     <M3Box className="flex-1 p-0 h-full" >
        {/* Placeholder for email content view */}
        <M3Box className="h-full flex flex-col items-center justify-center text-center px-4 bg-gray-100">
           {
            selectedEmail ? (
              <M3Box className="bg-white p-6 shadow-md w-full h-full overflow-y-auto">
                <M3Typography variant="headlineLarge" className="font-bold mb-2">
                  {selectedEmail.subject}
                </M3Typography>
                <M3Typography variant="bodyLarge" className="text-gray-700 mb-1">
                  From: {selectedEmail.sender}
                </M3Typography>
                {selectedEmail.to && (
                  <M3Typography variant="bodyMedium" className="text-gray-700 mb-1">
                    To: {selectedEmail.to}
                  </M3Typography>
                )}
                <M3Typography variant="bodySmall" className="text-gray-500 mb-4">
                  {selectedEmail.time}
                </M3Typography>
                 <M3Box className="mt-4 w-2/3 mx-auto" >
                  <M3Typography variant="bodyMedium" className="text-gray-800 whitespace-pre-line">
                    {selectedEmail.content}
                  </M3Typography>
                 </M3Box>
              </M3Box>
            ) : (
              <M3Box className="flex flex-col items-center gap-4">
                <MdMail className="text-purple-400" style={{ fontSize: '400px' }} />
                <M3Typography variant="bodyLarge" className="text-gray-600">
                  Select an email to view its content
                </M3Typography>
              </M3Box>
            )

           } 
        </M3Box>
      </M3Box>
  );
};

export default EmailView;