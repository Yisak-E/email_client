import { useEmailContext } from '../../EmailContext';
import { M3Box, M3Typography } from 'm3r';
import { MdMail } from 'react-icons/md';


const EmailView = () => {
  const { selectedEmail, getHeader, getEmailBody } = useEmailContext();

  return (
    <M3Box className="email-view">
      <M3Box className="email-view-body">
        {selectedEmail ? (
          <M3Box className="email-view-card">
            <M3Typography variant="headlineLarge" className="email-subject">
              {getHeader(selectedEmail, "Subject")}
            </M3Typography>
            <M3Typography variant="bodyLarge" className="email-meta">
              From: {getHeader(selectedEmail, "From")}
            </M3Typography>
            {getHeader(selectedEmail, "To") && (
              <M3Typography variant="bodyMedium" className="email-meta">
                To: {getHeader(selectedEmail, "To")}
              </M3Typography>
            )}
            <M3Typography variant="bodySmall" className="email-date">
              {getHeader(selectedEmail, "Date")}
            </M3Typography>
            <M3Box className="email-body">
              <M3Typography variant="bodyMedium" className="email-text">
                {getEmailBody(selectedEmail)}
              </M3Typography>
            </M3Box>
          </M3Box>
        ) : (
          <M3Box className="email-view-empty">
            {/* <MdMail className="text-purple-400" style={{ fontSize: '400px' }} /> */}
            <M3Typography variant="bodyLarge" className="email-empty-text">
              Select an email to view its content
            </M3Typography>
          </M3Box>
        )}
      </M3Box>
    </M3Box>
  );
};

export default EmailView;