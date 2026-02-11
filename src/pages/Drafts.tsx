import React from "react";
import {
  M3Box,
  M3Typography,
  M3Avatar,
  M3List,
  M3ListItem,
  M3ListItemAvatar,
  M3ListItemText,
  M3Divider,
  M3IconButton,
  M3Paper,
  M3Button,
} from "m3r"; 


import { Search, MoreVert, RadioButtonUnchecked } from "@mui/icons-material";
import type { MessageType } from "../types/MailType";
import { useEmailContext } from "../EmailContext";
import draftsData from "../data/drafts.json";

const Drafts = () => {
  const {
    setSelectedEmail,
    setSelectedView,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
  } = useEmailContext();

  let draftEmails = draftsData.emails as MessageType[];

  // Logic remains the same
  if (filter === "Read") {
    draftEmails = draftEmails.filter((email) => email.read);
  } else if (filter === "Unread") {
    draftEmails = draftEmails.filter((email) => !email.read);
  } else if (filter === "Today") {
    const todayLabel = "Now";
    draftEmails = draftEmails.filter((email) => email.time === todayLabel);
  }

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    draftEmails = draftEmails.filter(
      (email) =>
        (email.to ?? "").toLowerCase().includes(lowerSearchTerm) ||
        email.subject.toLowerCase().includes(lowerSearchTerm) ||
        email.content.toLowerCase().includes(lowerSearchTerm)
    );
  }

  const handleEmailClick = (email: MessageType) => {
    setSelectedEmail(email);
    setSelectedView("view");
  };

  return (
    <M3Box style={{ width: "25%", display: "flex", flexDirection: "column" }}>
      <M3Box style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <M3Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <M3Typography variant="headlineSmall" style={{ fontWeight: "700", color: "#1f2937" }}>
            Drafts ({draftEmails.length})
          </M3Typography>
          <M3IconButton>
            <RadioButtonUnchecked style={{ color: "#9ca3af" }} />
          </M3IconButton>
        </M3Box>

        <M3Box style={{ display: "flex", gap: "8px" }}>
          <M3Paper
            elevation={0}
            style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "transparent", boxShadow: "none" }}
          >
            {["All", "Read", "Today", "Unread"].map((f) => (
              <button
                key={f}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  border: "1px solid",
                  cursor: "pointer",
                  backgroundColor: filter === f ? "#e0e7ff" : "transparent",
                  color: filter === f ? "#4338ca" : "#4b5563",
                  borderColor: filter === f ? "#c7d2fe" : "#e5e7eb",
                }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </M3Paper>
          <M3Typography
            variant="labelMedium"
            style={{ marginLeft: "auto", cursor: "pointer", color: "#4f46e5", fontWeight: "500", alignSelf: "center" }}
            onClick={() => setSearchTerm("")}
          >
            Clear
          </M3Typography>
        </M3Box>
      </M3Box>

      <M3Divider />

      <M3Box style={{ padding: "8px 16px" }}>
        <M3Paper
          elevation={0}
          style={{ display: "flex", alignItems: "center", padding: "4px 12px", backgroundColor: "#f3f4f6", borderRadius: "9999px" }}
        >
          <Search style={{ color: "#9ca3af", marginRight: "8px" }} />
         
          <MoreVert style={{ color: "#9ca3af" }} />
        </M3Paper>
      </M3Box>

      <M3List style={{ overflowY: "auto", height: "800px", paddingTop: "0" }}>
        {draftEmails.map((email) => (
          <React.Fragment key={email.id.toString()}>
            <M3ListItem style={{ padding: 0 }}>
              <M3Button
                onClick={() => handleEmailClick(email)}
                style={{ padding: "12px 16px", transition: "background-color 0.2s" }}
              >
                <M3ListItemAvatar>
                  <M3Avatar
                    src={`https://i.pravatar.cc/150?u=draft-${email.id}`}
                    style={{ width: "48px", height: "48px", border: "2px solid white", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                  />
                </M3ListItemAvatar>
                <M3ListItemText
                  primary={
                    <M3Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <M3Typography variant="headlineSmall" style={{ fontWeight: "700", color: "#111827" }}>
                        {email.to ?? "Recipient"}
                      </M3Typography>
                      <M3Typography variant="labelSmall" style={{ color: "#6b7280" }}>
                        {email.time}
                      </M3Typography>
                    </M3Box>
                  }
                  secondary={
                    <M3Box style={{ marginTop: "4px" }}>
                      <M3Typography variant="bodyMedium" style={{ display: "block", fontWeight: "600", color: "#374151" }}>
                        {email.subject}
                      </M3Typography>
                      {email.preview && (
                        <M3Typography
                          variant="bodySmall"
                          style={{
                            color: "#6b7280",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                          }}
                        >
                          {email.preview}
                        </M3Typography>
                      )}
                    </M3Box>
                  }
                />
              </M3Button>
            </M3ListItem>
            <M3Divider />
          </React.Fragment>
        ))}
      </M3List>
    </M3Box>
  );
};

export default Drafts;