import { useEmailContext } from '../../EmailContext';
import { M3Box, M3Typography } from 'm3r';
import { MdMail } from 'react-icons/md';


const EmailView = () => {
  const {selectedEmail} = useEmailContext();

  // Helper to decode base64
  const decodeBase64 = (str: string): string => {
    try {
      return decodeURIComponent(atob(str).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
      return str;
    }
  };

  // Helper to get header value from message
  const getHeader = (name: string): string => {
    if (!selectedEmail) return "";
    return selectedEmail.payload?.headers?.find((h) => h.name === name)?.value || "";
  };

  // Helper to get email body content
  const getEmailBody = (): string => {
    if (!selectedEmail) return "";
    
    let emailBody = "";
    if (selectedEmail.payload?.parts) {
      const textPart = selectedEmail.payload.parts.find((part) => part.mimeType === "text/plain");
      if (textPart && textPart.body?.data) {
        emailBody = decodeBase64(textPart.body.data.replace(/\-/g, '+').replace(/_/g, '/'));
      }
    } else if (selectedEmail.payload?.body?.data) {
      emailBody = decodeBase64(selectedEmail.payload.body.data.replace(/\-/g, '+').replace(/_/g, '/'));
    }
    
    return emailBody || selectedEmail.snippet || "";
  };

  return (
     <M3Box className='overflow-y-scroll max-h-[calc(100vh-140px)] h-full max-w-[calc(100vw-500px)]'  >
        {/* Placeholder for email content view */}
        <M3Box className="h-full flex flex-col items-center justify-center text-center px-4 bg-gray-100">
           {
            selectedEmail ? (
              <M3Box className="bg-white p-6 shadow-md w-full h-full overflow-y-auto">
                <M3Typography variant="headlineLarge" className="font-bold mb-2">
                  {getHeader("Subject")}
                </M3Typography>
                <M3Typography variant="bodyLarge" className="text-gray-700 mb-1">
                  From: {getHeader("From")}
                </M3Typography>
                {getHeader("To") && (
                  <M3Typography variant="bodyMedium" className="text-gray-700 mb-1">
                    To: {getHeader("To")}
                  </M3Typography>
                )}
                <M3Typography variant="bodySmall" className="text-gray-500 mb-4">
                  {getHeader("Date")}
                </M3Typography>
                 <M3Box className="mt-4 w-2/3 mx-auto" >
                  <M3Typography variant="bodyMedium" className="text-gray-800 whitespace-pre-line">
                    {getEmailBody()}
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