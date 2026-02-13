import { M3Avatar, M3Box } from "m3r";
import { useEffect, useState } from "react";
import type { MessageType } from "../../types/MailType";
import { useEmailContext } from "../../EmailContext";
import { useGmail } from "../../context/GmailContext";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const Sidebar = () => {
  const {selectedPage, setSelectedEmail} = useEmailContext();
  const { messages: gmailMessages, isAuthenticated } = useGmail();
  const [mailList, setMailList] = useState<MessageType[]>([]);

  // Convert Gmail API messages to MessageType format
  const convertGmailToMessage = (gmailMsg: any): MessageType => {
    const headers = gmailMsg.payload?.headers || [];
    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || "";
    
    return {
      id: gmailMsg.id,
      sender: getHeader("From"),
      subject: getHeader("Subject") || "(No Subject)",
      content: gmailMsg.snippet || "",
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
    <M3Box color="secondary" textAlign="center" m={0} p={0} borderRadius={4} boxShadow={3} >
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
          <M3Box display="flex" justifyContent="center" gap={2} mb={2}>
            <Typography variant="inherit" color="textSecondary">All</Typography>
            <Typography variant="body1" color="textSecondary">Unread</Typography>
            <Typography variant="body2" color="textSecondary">Starred</Typography>
          </M3Box>
        )
       }

      <List sx={{ width: '100%',height: 'calc(100vh - 180px)', bgcolor: 'background.paper' }} className="overflow-y-scroll">
        {mailList.length > 0 ? (
          mailList.map((mail: MessageType) => (
            <ListItem 
                key={mail.id}
                onClick={() => {
                   if(mail.id && setSelectedEmail) {
                    setSelectedEmail(mail);
                    mail.read = true;
                   }
                }}
                alignItems="flex-start" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <M3Box component="span" sx={{ display: 'block', fontWeight: 'bold', color: 'text.primary' }}>
                <M3Avatar alt={mail.id.toString()} src={`https://i.pravatar.cc/150?u=${mail.id}`} className="w-8 h-8 border-2 border-white shadow-sm mr-4" />
              </M3Box>
              <ListItemText
                primary={mail.subject}
                secondary={
                  <>
                    <M3Box component="span" sx={{ display: 'block', color: 'text.primary' }}>
                      {mail.sender}
                    </M3Box>
                    <M3Box component="span" sx={{ display: 'block', color: 'text.secondary' }}>
                      {mail.time}
                    </M3Box>
                  </>
                }
              />
              <M3Box>
                {/* small icon to show if it is read/unread/starred */}
                {!mail.read && (
                   <M3Box component="span" sx={{ display: 'block', color: 'textSecondary' }} width={10} height={10} borderRadius="50%" bgcolor="primary.main" >
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
       
      
    </M3Box>
  )};

export default Sidebar;