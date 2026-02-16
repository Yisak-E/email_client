import { M3Avatar, M3Box, M3Typography, M3Chip, M3Checkbox } from "m3r";
import { useEffect, useState } from "react";
import type { MessageType } from "../../types/MailType";
import { useEmailContext } from "../../EmailContext";
import { IoReorderThreeSharp } from "react-icons/io5";


const Sidebar = () => {
  const { selectedPage, setSelectedEmail, getHeader, inboxMessageList, isConnected } = useEmailContext();
  const [mailList, setMailList] = useState<MessageType[]>([]);
  const [filterType, setFilterType] = useState<"all" | "unread" | "read" | "starred">("all");

  // Extract email address from sender string
  const extractEmailFromSender = (sender: string): string => {
    const emailMatch = sender.match(/<(.+?)>/);
    if (emailMatch) return emailMatch[1];
    return sender || "";
  };

  // Get avatar URL from sender email
  const getAvatarUrl = (message: MessageType): string => {
    const sender = getHeader(message, "From");
    const email = extractEmailFromSender(sender);
    if (!email) return `https://ui-avatars.com/api/?name=Unknown&background=random&size=40`;
    const namePart = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(namePart)}&background=random&size=40`;
  };

  useEffect(() => {
    console.log("📧 Sidebar Debug:", {
      isConnected,
      selectedPage,
      inboxMessagesCount: inboxMessageList.length,
      mailListCount: mailList.length,
    });

    if (isConnected && selectedPage === "inbox" && inboxMessageList.length > 0) {
      console.log("🔍 First email structure:", {
        hasPayload: !!inboxMessageList[0].payload,
        hasHeaders: !!inboxMessageList[0].payload?.headers,
        headersCount: inboxMessageList[0].payload?.headers?.length || 0,
        firstHeaders: inboxMessageList[0].payload?.headers?.slice(0, 3)?.map((h: any) => h.name),
      });
      
      setMailList(inboxMessageList);
      console.log("✅ Emails set to mailList:", inboxMessageList.length);
    } else {
      setMailList([]);
    }
  }, [selectedPage, inboxMessageList, isConnected]);

  // Filter emails based on selected filter
  const getFilteredEmails = () => {
    switch (filterType) {
      case "unread":
        return mailList.filter(mail => mail.labelIds?.includes("UNREAD"));
      case "read":
        return mailList.filter(mail => !mail.labelIds?.includes("UNREAD"));
      case "starred":
        return mailList.filter(mail => mail.labelIds?.includes("STARRED"));
      default:
        return mailList;
    }
  };

  const filteredEmails = getFilteredEmails();
  console.log("📬 Filtered emails:", { filterType, count: filteredEmails.length, total: mailList.length });

  const handleEmailClick = (mail: MessageType) => {
    if (mail.id && setSelectedEmail) {
      setSelectedEmail(mail);
    }
  };

  return (
    <M3Box 
     className="list-container"
    >

      {/* Connection Message */}
      {!isConnected && (
        <M3Box sx={{ px: 2, py: 2, textAlign: 'center', flexShrink: 0 }}>
          <M3Typography variant="bodySmall" className="text-gray-600">
            Go to Settings ⚙️ to configure your email account and connect to your mail server.
          </M3Typography>
        </M3Box>
      )}

      {/* Filters - Horizontal Scroll */}
      {isConnected && selectedPage === "inbox" && mailList.length > 0 && (
        <M3Box 
         className="list-filter-container"
        >
         <M3Box>
          <M3Box className="filter-row-1 bg-blue-600">
            <M3Box className="float-left">
              <IoReorderThreeSharp size={24} color="#000000" />
            </M3Box>

             <M3Box className="filter-container">
              <M3Typography variant="headlineSmall" display="block">
                {!isConnected ? "Not connected" : `Inbox (${mailList.length})`}
              </M3Typography>
            </M3Box>

            <M3Box>
              <M3Checkbox
                // checked={selectAllChecked}
                // onChange={() => setSelectAllChecked(!selectAllChecked)}
              />
            </M3Box>

          </M3Box>

         </M3Box>
            <M3Box className="filter-row-2">
              <M3Chip
                label="All"
                onClick={() => setFilterType("all")}
                variant={(filterType === "all" ? "filled" : "outlined") as any}
                className="filter-chip"
              />
              <M3Chip
                label="Read"
                onClick={() => setFilterType("read")}
                variant={(filterType === "read" ? "filled" : "outlined") as any}
                className="filter-chip"
              />
              <M3Chip
                label="Unread"
                onClick={() => setFilterType("unread")}
                variant={(filterType === "unread" ? "filled" : "outlined") as any}
                className="filter-chip"
              />
              <M3Chip
                label="Starred"
                onClick={() => setFilterType("starred")}
                variant={(filterType === "starred" ? "filled" : "outlined") as any}
                sx={{ flexShrink: 0, cursor: 'pointer' }}
              />
            </M3Box>
        </M3Box>
      )}

      {/* Email List - Scrollable Container */}
      <M3Box 
        className="list-view">
        {filteredEmails.length > 0 ? (
          filteredEmails.map((mail: MessageType) => {
            const subject = getHeader(mail, "Subject");
            const from = getHeader(mail, "From");
            console.log(`📨 Rendering email - Subject: "${subject}", From: "${from}"`);
            return (
            <M3Box
              key={mail.id}
              onClick={() => handleEmailClick(mail)}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                py: 1.5,
                px: 2,
                borderBottom: '1px solid #E8E7EF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: mail.labelIds?.includes("UNREAD") ? '#F0F3FF' : '#FAF8FF',
                '&:hover': {
                  backgroundColor: mail.labelIds?.includes("UNREAD") ? '#E8EBFF' : '#F5F3FF',
                  borderLeft: '3px solid #4A5C92',
                  paddingLeft: 'calc(1rem - 3px)'
                }
              }}
            >
             
              <M3Avatar 
                alt={getHeader(mail, "From")} 
                src={getAvatarUrl(mail)} 
                sx={{ width: 40, height: 40, flexShrink: 0, mt: 0.25 }}
              />
              <M3Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <M3Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <M3Typography 
                    variant="labelLarge" 
                    sx={{ 
                      fontWeight: mail.labelIds?.includes("UNREAD") ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      color: mail.labelIds?.includes("UNREAD") ? '#324478' : '#49454F'
                    }}
                  >
                    {getHeader(mail, "Subject") || "(No Subject)"}
                  </M3Typography>
                  <M3Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
                    {mail.labelIds?.includes("UNREAD") && (
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
                        fontSize: '0.75rem',
                        minWidth: 'fit-content'
                      }}
                    >
                      {getHeader(mail, "Date") ? new Date(getHeader(mail, "Date")).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ""}
                    </M3Typography>
                  </M3Box>
                </M3Box>
                <M3Typography 
                  variant="bodySmall" 
                  sx={{
                    color: mail.labelIds?.includes("UNREAD") ? '#324478' : '#caf312',
                    fontWeight: mail.labelIds?.includes("UNREAD") ? 500 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {getHeader(mail, "From") || "Unknown Sender"}
                </M3Typography>
                <M3Typography 
                  variant="labelSmall"
                  sx={{
                    color: '#757680',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.75rem'
                  }}
                >
                  {mail.snippet}
                </M3Typography>
              </M3Box>
            </M3Box>
            );
          })
        ) : (
          isConnected && (
            <M3Box sx={{ p: 2, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <M3Typography variant="bodySmall" className="text-gray-600">
                {filterType !== "all" ? "No emails match this filter" : "No emails found"}
              </M3Typography>
            </M3Box>
          )
        )}
      </M3Box>
    </M3Box>
  );
};

export default Sidebar;
