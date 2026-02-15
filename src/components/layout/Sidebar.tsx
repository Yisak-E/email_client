import { M3Avatar, M3Box } from "m3r";
import { useEffect, useState } from "react";
import type { MessageType } from "../../types/MailType";
import { useEmailContext } from "../../EmailContext";
import { useGmail } from "../../context/GmailContext.tsx";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const Sidebar = () => {
  const {selectedPage, setSelectedEmail} = useEmailContext();
  const { messages: gmailMessages, isAuthenticated, getEmailById, loadMoreEmails } = useGmail();
  const [mailList, setMailList] = useState<MessageType[]>([]);

  // Helper to decode base64
  const decodeBase64 = (str: string): string => {
    try {
      return decodeURIComponent(atob(str).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
      return str;
    }
  };

  // Extract email address from sender string (e.g., "John Doe <john@example.com>" -> "john@example.com")
  const extractEmailFromSender = (sender: string): string => {
    const emailMatch = sender.match(/<(.+?)>/);
    if (emailMatch) return emailMatch[1];
    // If no angle brackets, assume the whole string is an email
    return sender || "";
  };

  // Get avatar URL from sender email using UI Avatars service
  const getAvatarUrl = (sender: string): string => {
    const email = extractEmailFromSender(sender);
    if (!email) return `https://ui-avatars.com/api/?name=Unknown&background=random&size=40`;
    // Extract name from email for display
    const namePart = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(namePart)}&background=random&size=40`;
  };

  // Convert Gmail API messages to MessageType format
  const convertGmailToMessage = (gmailMsg: any): MessageType => {
    const headers = gmailMsg.payload?.headers || [];
    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || "";
    
    // Extract email body
    let emailBody = "";
    if (gmailMsg.payload?.parts) {
      // For multipart emails, find the text part
      const textPart = gmailMsg.payload.parts.find((part: any) => part.mimeType === "text/plain");
      if (textPart && textPart.body?.data) {
        emailBody = decodeBase64(textPart.body.data.replace(/\-/g, '+').replace(/_/g, '/'));
      }
    } else if (gmailMsg.payload?.body?.data) {
      // For simple emails
      emailBody = decodeBase64(gmailMsg.payload.body.data.replace(/\-/g, '+').replace(/_/g, '/'));
    }
    
    return {
      id: gmailMsg.id,
      sender: getHeader("From"),
      subject: getHeader("Subject") || "(No Subject)",
      content: emailBody || gmailMsg.snippet || "",
      time: getHeader("Date"),
      status: "new",
      read: !gmailMsg.labelIds?.includes("UNREAD"),
      preview: gmailMsg.snippet,
      to: getHeader("To"),
    };
  };

  useEffect(() => {
    // Only show Gmail messages if authenticated and inbox is selected
    if (isAuthenticated && selectedPage === "inbox" && gmailMessages.length > 0) {
      setMailList(gmailMessages.map(convertGmailToMessage));
    } else {
      setMailList([]);
    }
  }, [selectedPage, gmailMessages, isAuthenticated]);

    
  return (
    <M3Box className="list-container" >
       <Typography variant="h6">{!isAuthenticated ? "Sign in to see emails" : `INBOX (${mailList.length})`}</Typography>

       {/* Authentication message */}
       {!isAuthenticated && (
          <M3Box p={2} textAlign="center">
            <Typography color="textSecondary">
              Please sign in with your Google account to view your Gmail inbox.
            </Typography>
          </M3Box>
        )}

       {/* filters */}
       {
        isAuthenticated && selectedPage === "inbox" && mailList.length > 0 && (
          <M3Box className="list-filter-container">
            <Typography variant="inherit" color="textSecondary">All</Typography>
            <Typography variant="body1" color="textSecondary">Unread</Typography>
            <Typography variant="body2" color="textSecondary">Starred</Typography>
          </M3Box>
        )
       }

      <List className="list-view">
        {mailList.length > 0 ? (
          mailList.map((mail: MessageType) => (
            <ListItem 
                key={mail.id}
                onClick={async () => {
                   if(mail.id && setSelectedEmail) {
                    // Fetch full email content
                    const fullEmail = await getEmailById(mail.id as string);
                    if (fullEmail) {
                      const headers = fullEmail.payload?.headers || [];
                      const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || "";
                      
                      // Extract email body
                      let emailBody = "";
                      if (fullEmail.payload?.parts) {
                        const textPart = fullEmail.payload.parts.find((part: any) => part.mimeType === "text/plain");
                        if (textPart && textPart.body?.data) {
                          emailBody = decodeBase64(textPart.body.data.replace(/\-/g, '+').replace(/_/g, '/'));
                        }
                      } else if (fullEmail.payload?.body?.data) {
                        emailBody = decodeBase64(fullEmail.payload.body.data.replace(/\-/g, '+').replace(/_/g, '/'));
                      }
                      
                      const enrichedEmail: MessageType = {
                        ...mail,
                        content: emailBody || mail.content,
                        sender: getHeader("From") || mail.sender,
                        subject: getHeader("Subject") || mail.subject,
                        to: getHeader("To") || mail.to,
                        time: getHeader("Date") || mail.time,
                      };
                      
                      setSelectedEmail(enrichedEmail);
                      enrichedEmail.read = true;
                    }
                   }
                }}
                alignItems="flex-start" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1 }}>
              <M3Box component="span" sx={{ display: 'block', mr: 1.5, flexShrink: 0 }}>
                <M3Avatar 
                  alt={mail.sender} 
                  src={getAvatarUrl(mail.sender)} 
                  sx={{ width: 40, height: 40 }}
                />
              </M3Box>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mail.subject || "(No Subject)"}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}>
                      {mail.sender}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled' }}>
                      {mail.time ? new Date(mail.time).toLocaleDateString() : ""}
                    </Typography>
                  </>
                }
                sx={{ m: 0 }}
              />
              <M3Box sx={{ ml: 1, flexShrink: 0 }}>
                {/* small icon to show if it is read/unread/starred */}
                {!mail.read && (
                   <M3Box component="span" sx={{ display: 'block', color: 'primary.main' }} width={8} height={8} borderRadius="50%" bgcolor="primary.main" >
                    </M3Box>
                ) }
              </M3Box>
            </ListItem>
          ))
        ) : (
          isAuthenticated && (
            <M3Box p={2} textAlign="center">
              <Typography color="textSecondary">
                No emails found
              </Typography>
            </M3Box>
          )
        )}
      </List>
      
      {/* Load More Button */}
      {isAuthenticated && mailList.length > 0 && (
        <M3Box p={2} textAlign="center">
          <button 
            onClick={loadMoreEmails}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Load More Emails
          </button>
        </M3Box>
      )}
    </M3Box>
  )};

export default Sidebar;