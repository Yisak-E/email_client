import { M3Avatar, M3Box, M3Typography, M3Chip, M3Checkbox } from "m3r";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MessageType } from "../../types/MailType";
import { useEmailContext } from "../../EmailContext";
import { IoReorderThreeSharp } from "react-icons/io5";

type FolderName = 'INBOX' | 'Sent' | 'Drafts' | 'Spam' | 'Trash';

const folderOptions: FolderName[] = ['INBOX', 'Sent', 'Drafts', 'Spam', 'Trash'];

const Sidebar = () => {
  const {
    selectedPage,
    selectedEmail,
    setSelectedEmail,
    getHeader,
    inboxMessageList,
    isConnected,
    accountEmail,
    accountName,
    loadEmails,
    folderStats,
  } = useEmailContext();
  const [mailList, setMailList] = useState<MessageType[]>([]);
  const [filterType, setFilterType] = useState<"all" | "unread" | "read" | "starred" | "today">("all");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFolderPopupOpen, setIsFolderPopupOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState<FolderName>('INBOX');
  const folderPopupRef = useRef<HTMLDivElement | null>(null);

  const extractEmailFromSender = (sender: string): string => {
    const emailMatch = sender.match(/<(.+?)>/);
    if (emailMatch) return emailMatch[1];
    return sender || "";
  };

  const getAvatarUrl = (message: MessageType): string => {
    const sender = getHeader(message, "From");
    const email = extractEmailFromSender(sender);
    if (!email) return `https://ui-avatars.com/api/?name=Unknown&background=random&size=40`;
    const namePart = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(namePart)}&background=random&size=40`;
  };

  useEffect(() => {
    if (isConnected && selectedPage === "inbox" && inboxMessageList.length > 0) {
      setMailList(inboxMessageList);
    } else {
      setMailList([]);
    }
  }, [selectedPage, inboxMessageList, isConnected]);

  const isTodayEmail = (mail: MessageType) => {
    const dateHeader = getHeader(mail, "Date");
    if (!dateHeader) return false;
    const mailDate = new Date(dateHeader);
    if (Number.isNaN(mailDate.getTime())) return false;

    const now = new Date();
    return (
      mailDate.getFullYear() === now.getFullYear() &&
      mailDate.getMonth() === now.getMonth() &&
      mailDate.getDate() === now.getDate()
    );
  };

  const filteredEmails = useMemo(() => {
    switch (filterType) {
      case "unread":
        return mailList.filter((mail) => mail.labelIds?.includes("UNREAD"));
      case "read":
        return mailList.filter((mail) => !mail.labelIds?.includes("UNREAD"));
      case "starred":
        return mailList.filter((mail) => mail.labelIds?.includes("STARRED"));
      case "today":
        return mailList.filter(isTodayEmail);
      default:
        return mailList;
    }
  }, [filterType, mailList]);

  const visibleEmails = filteredEmails.slice(0, visibleCount);
  const hasMoreEmails = filteredEmails.length > visibleCount;

  useEffect(() => {
    setVisibleCount(10);
  }, [filterType, selectedPage, inboxMessageList]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!folderPopupRef.current) return;
      const targetNode = event.target as Node;
      if (!folderPopupRef.current.contains(targetNode)) {
        setIsFolderPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleEmailClick = (mail: MessageType) => {
    if (mail.id && setSelectedEmail) {
      setSelectedEmail(mail);
    }
  };

  const handleClear = () => {
    setFilterType("all");
  };

  const handleFolderSelect = async (folder: FolderName) => {
    setIsFolderPopupOpen(false);
    setFilterType('all');
    setVisibleCount(10);
    setActiveFolder(folder);
    await loadEmails(folder);
  };

  const displayName = accountName || (accountEmail ? accountEmail.split('@')[0] : 'Account');
  const displayEmail = accountEmail || '';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('') || 'A';

  return (
    <M3Box className="mail-list-panel">
      <M3Box className="account-row">
        <M3Avatar className="account-avatar">{initials}</M3Avatar>
        <M3Box className="account-meta">
          <M3Typography variant="labelLarge" className="account-name">
            {displayName}
          </M3Typography>
          {displayEmail && (
            <M3Typography variant="labelSmall" className="account-email">
              {displayEmail}
            </M3Typography>
          )}
        </M3Box>
      </M3Box>

      {!isConnected && (
        <M3Box className="status-row">
          <M3Typography variant="bodySmall" className="status-text">
            Go to Settings to connect your mail server.
          </M3Typography>
        </M3Box>
      )}

      {isConnected && selectedPage === "inbox" && (
        <>
          <M3Box className="mail-list-header">
            <M3Box className="mail-list-title">
              <M3Box ref={folderPopupRef} className="folder-popup-anchor">
                <button
                  type="button"
                  className="text-button"
                  aria-label="Toggle folders"
                  onClick={() => setIsFolderPopupOpen((value) => !value)}
                >
                  <IoReorderThreeSharp size={18} />
                </button>
                {isFolderPopupOpen && (
                  <M3Box className="folder-popup-menu">
                    {folderOptions.map((folder) => {
                      const isActiveFolder = activeFolder === folder;
                      const count = folderStats?.[folder] ?? 0;
                      return (
                        <button
                          key={folder}
                          type="button"
                          className={`folder-popup-item ${isActiveFolder ? 'active' : ''}`}
                          onClick={() => handleFolderSelect(folder)}
                        >
                          <span>{folder}</span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </M3Box>
                )}
              </M3Box>
              <M3Typography variant="titleMedium">
                {activeFolder} ({mailList.length})
              </M3Typography>
            </M3Box>
            <M3Box className="mail-list-actions">
              <M3Checkbox />
              <button type="button" className="text-button" onClick={handleClear}>
                Clear
              </button>
            </M3Box>
          </M3Box>

          <M3Box className="mail-filter-row">
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
              label="Today"
              onClick={() => setFilterType("today")}
              variant={(filterType === "today" ? "filled" : "outlined") as any}
              className="filter-chip"
            />
            <M3Chip
              label="Unread"
              onClick={() => setFilterType("unread")}
              variant={(filterType === "unread" ? "filled" : "outlined") as any}
              className="filter-chip"
            />
          </M3Box>
        </>
      )}

      <M3Box className="mail-list">
        {visibleEmails.length > 0 ? (
          visibleEmails.map((mail) => {
            const subject = getHeader(mail, "Subject") || "(No Subject)";
            const from = getHeader(mail, "From") || "Unknown Sender";
            const dateText = getHeader(mail, "Date")
              ? new Date(getHeader(mail, "Date")).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : "";

            const isUnread = mail.labelIds?.includes("UNREAD");
            const isActive = selectedEmail?.id === mail.id;

            return (
              <M3Box
                key={mail.id}
                onClick={() => handleEmailClick(mail)}
                className={`mail-row ${isActive ? "active" : ""}`}
              >
                <M3Avatar
                  alt={from}
                  src={getAvatarUrl(mail)}
                  className="mail-avatar"
                />
                <M3Box className="mail-meta">
                  <M3Box className="mail-meta-top">
                    <M3Typography variant="labelLarge" className={`mail-subject ${isUnread ? "unread" : ""}`}>
                      {subject}
                    </M3Typography>
                    <M3Box className="mail-meta-right">
                      {isUnread && <span className="unread-dot" />}
                      <M3Typography variant="labelSmall" className="mail-date">
                        {dateText}
                      </M3Typography>
                    </M3Box>
                  </M3Box>
                  <M3Typography variant="bodySmall" className={`mail-from ${isUnread ? "unread" : ""}`}>
                    {from}
                  </M3Typography>
                  <M3Typography variant="labelSmall" className="mail-snippet">
                    {mail.snippet}
                  </M3Typography>
                </M3Box>
              </M3Box>
            );
          })
        ) : (
          isConnected && (
            <M3Box className="mail-empty">
              <M3Typography variant="bodySmall">No emails found</M3Typography>
            </M3Box>
          )
        )}

        {hasMoreEmails && (
          <M3Box className="mail-more">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="text-button"
            >
              Load 10 More
            </button>
          </M3Box>
        )}
      </M3Box>
    </M3Box>
  );
};

export default Sidebar;