import { M3Avatar, M3Box, M3Typography } from "m3r";
import { useEffect, useState } from "react";
import type { MessageType } from "../../types/MailType";
import { useEmailContext } from "../../EmailContext";
import { List, ListItem, ListItemText } from "@mui/material";

const Sidebar = () => {
  const {selectedPage, inboxMessageList, sentMessageList, draftMessageList, spamMessageList, trashMessageList} = useEmailContext();
  const [mailList, setMailList] = useState<MessageType[]>([]);

  useEffect(() => {
    switch (selectedPage) {
      case "inbox":
        setMailList(inboxMessageList);
        break;
      case "sent":
        setMailList(sentMessageList);
        break;
      case "drafts":
        setMailList(draftMessageList || []);
        break;
      case "spam":
        setMailList(spamMessageList || []);
        break;
      case "trash":
        setMailList(trashMessageList || []);
        break;
      default:
        setMailList(inboxMessageList);
    }
  }, [selectedPage, inboxMessageList, sentMessageList, draftMessageList, spamMessageList, trashMessageList]);

    
  return (
    <M3Box color="secondary" textAlign="center" m={0} p={0} borderRadius={4} boxShadow={3} >
       <M3Typography variant="h6" >{selectedPage.toUpperCase() +` (${mailList.length})`}</M3Typography>

       {/* filters */}
       {
        selectedPage === "inbox" && (
          <M3Box display="flex" justifyContent="center" gap={2} mb={2}>
            <M3Typography variant="inherit" color="textSecondary">All</M3Typography>
            <M3Typography variant="body1" color="textSecondary">Unread</M3Typography>
            <M3Typography variant="body2" color="textSecondary">Starred</M3Typography>
          </M3Box>
        )
       }

      <List sx={{ width: '100%',height: 'calc(100vh - 180px)', bgcolor: 'background.paper' }} className="overflow-y-scroll">
        {mailList.map((mail) => (
          <ListItem key={mail.id} alignItems="flex-start" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
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
          </ListItem>
        ))}
      </List>
       
      
    </M3Box>
  )};

export default Sidebar;