import { M3Avatar, M3Box, M3Typography, M3List, M3ListItem, M3Chip } from "m3r";
import { useEffect, useState } from "react";
import type { MessageType } from "../../types/MailType";
import { useEmailContext } from "../../EmailContext";
import { useGmail } from "../../context/GmailContext.tsx";

const Sidebar = () => {
  const { selectedPage, setSelectedEmail } = useEmailContext();
  const { messages: gmailMessages, isAuthenticated, getEmailById, loadMoreEmails } = useGmail();
  const [mailList, setMailList] = useState<MessageType[]>([]);
  const [filterType, setFilterType] = useState<"all" | "unread" | "read" | "starred">("all");

  // Helper to decode base64
  const decodeBase64 = (str: string): string => {
    try {
      return decodeURIComponent(atob(str).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
      return str;
    }
  };

  // Extract email address from sender string
  const extractEmailFromSender = (sender: string): string => {
    const emailMatch = sender.match(/<(.+?)>/);
    if (emailMatch) return emailMatch[1];
    return sender || "";
  };

  // Get avatar URL from sender email
  const getAvatarUrl = (sender: string): string => {
    const email = extractEmailFromSender(sender);
    if (!email) return `https://ui-avatars.com/api/?name=Unknown&background=random&size=40`;
    const namePart = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(namePart)}&background=random&size=40`;
  };

  // Convert Gmail API messages to MessageType format
  const convertGmailToMessage = (gmailMsg: any): MessageType => {
    const headers = gmailMsg.payload?.headers || [];
    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || "";
    
    let emailBody = "";
    if (gmailMsg.payload?.parts) {
      const textPart = gmailMsg.payload.parts.find((part: any) => part.mimeType === "text/plain");
      if (textPart && textPart.body?.data) {
        emailBody = decodeBase64(textPart.body.data.replace(/\-/g, '+').replace(/_/g, '/'));
      }
    } else if (gmailMsg.payload?.body?.data) {
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
    if (isAuthenticated && selectedPage === "inbox" && gmailMessages.length > 0) {
      setMailList(gmailMessages.map(convertGmailToMessage));
    } else {
      setMailList([]);
    }
  }, [selectedPage, gmailMessages, isAuthenticated]);

  // Filter emails based on selected filter
  const getFilteredEmails = () => {
    switch (filterType) {
      case "unread":
        return mailList.filter(mail => !mail.read);
      case "read":
        return mailList.filter(mail => mail.read);
      case "starred":
        return mailList.filter(mail => mail.status === "starred");
      default:
        return mailList;
    }
  };

  const filteredEmails = getFilteredEmails();

  const handleEmailClick = async (mail: MessageType) => {
    if (mail.id && setSelectedEmail) {
      const fullEmail = await getEmailById(mail.id as string);
      if (fullEmail) {
        const headers = fullEmail.payload?.headers || [];
        const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || "";
        
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
  };

  return (
    <M3Box className="list-container">
      <M3Typography variant="headlineSmall" display="block" className="mb-4 px-4">
        {!isAuthenticated ? "Sign in to see emails" : `Inbox (${mailList.length})`}
      </M3Typography>

      {!isAuthenticated && (
        <M3Box p={2} textAlign="center">
          <M3Typography variant="bodySmall" className="text-gray-600">
            Please sign in with your Google account to view your Gmail inbox.
          </M3Typography>
        </M3Box>
      )}

      {isAuthenticated && selectedPage === "inbox" && mailList.length > 0 && (
        <M3Box className="list-filter-container mb-4 px-4 flex flex-wrap gap-2">
          <M3Chip
            label="All"
            onClick={() => setFilterType("all")}
            variant={(filterType === "all" ? "filled" : "outlined") as any}
            className="cursor-pointer"
          />
          <M3Chip
            label="Read"
            onClick={() => setFilterType("read")}
            variant={(filterType === "read" ? "filled" : "outlined") as any}
            className="cursor-pointer"
          />
          <M3Chip
            label="Unread"
            onClick={() => setFilterType("unread")}
            variant={(filterType === "unread" ? "filled" : "outlined") as any}
            className="cursor-pointer"
          />
          <M3Chip
            label="Starred"
            onClick={() => setFilterType("starred")}
            variant={(filterType === "starred" ? "filled" : "outlined") as any}
            className="cursor-pointer"
          />
          <M3Chip
            label="Clear"
            onClick={() => setFilterType("all")}
            variant="outlined"
            className="cursor-pointer"
          />
        </M3Box>
      )}

      <M3List className="list-view" sx={{ 
        maxHeight: 'calc(100vh - 300px)', 
        overflowY: 'auto',
        px: 2,
        flex: 1
      }}>
        {filteredEmails.length > 0 ? (
          filteredEmails.map((mail: MessageType) => (
            <M3ListItem 
              key={mail.id}
              onClick={() => handleEmailClick(mail)}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                py: 2,
                px: 2,
                mb: 1,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: `1px solid ${mail.read ? '#e5e7eb' : '#dbe1ff'}`,
                backgroundColor: mail.read ? '#ffffff' : '#f0f3ff',
                '&:hover': {
                  backgroundColor: mail.read ? '#f9fafb' : '#e8ebff',
                  boxShadow: '0 1px 3px rgba(74, 92, 146, 0.12)',
                }
              }}
              className="responsive-email-item"
            >
              <M3Avatar 
                alt={mail.sender} 
                src={getAvatarUrl(mail.sender)} 
                sx={{ width: 40, height: 40, flexShrink: 0, mt: 0.5 }}
              />
              <M3Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <M3Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <M3Typography 
                    variant="labelLarge" 
                    sx={{ 
                      fontWeight: mail.read ? 400 : 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      color: mail.read ? '#49454F' : '#324478'
                    }}
                  >
                    {mail.subject || "(No Subject)"}
                  </M3Typography>
                  <M3Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
                    {!mail.read && (
                      <M3Box 
                        sx={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: '#4A5C92',
                          flexShrink: 0
                        }} 
                      />
                    )}
                    <M3Typography 
                      variant="labelSmall"
                      sx={{
                        color: '#757680',
                        whiteSpace: 'nowrap',
                        fontSize: '0.75rem'
                      }}
                    >
                      {mail.time ? new Date(mail.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ""}
                    </M3Typography>
                  </M3Box>
                </M3Box>
                <M3Typography 
                  variant="bodySmall" 
                  sx={{
                    color: mail.read ? '#49454F' : '#324478',
                    fontWeight: mail.read ? 400 : 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {mail.sender}
                </M3Typography>
                <M3Typography 
                  variant="labelSmall"
                  sx={{
                    color: '#757680',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {mail.preview || mail.content?.substring(0, 50)}
                </M3Typography>
              </M3Box>
            </M3ListItem>
          ))
        ) : (
          isAuthenticated && (
            <M3Box p={2} textAlign="center">
              <M3Typography variant="bodySmall" className="text-gray-600">
                {filterType !== "all" ? "No emails match this filter" : "No emails found"}
              </M3Typography>
            </M3Box>
          )
        )}
      </M3List>

      {isAuthenticated && mailList.length > 0 && (
        <M3Box p={2} textAlign="center" sx={{ borderTop: '1px solid #e5e7eb' }}>
          <button 
            onClick={loadMoreEmails}
            style={{
              padding: "10px 24px",
              backgroundColor: "#4A5C92",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              width: '100%'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d4a76")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4A5C92")}
          >
            Load More Emails
          </button>
        </M3Box>
      )}
    </M3Box>
  );
};

export default Sidebar;
