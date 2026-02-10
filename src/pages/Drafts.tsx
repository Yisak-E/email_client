import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import { Search, MoreVert, RadioButtonUnchecked } from "@mui/icons-material";
import type { MessageType } from "../types/MailType";
import { useEmailContext } from "../EmailContext";
import draftsData from "../../public/data/drafts.json";

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
    <Box className="w-1/4 flex flex-col">
      {/* Header Section */}
      <Box className="p-4 flex flex-col gap-4">
        <Box className="flex justify-between items-center">
          <Typography variant="h6" className="font-bold text-gray-800">
            Drafts ({draftEmails.length})
          </Typography>
          <IconButton size="small">
            <RadioButtonUnchecked className="text-gray-400" />
          </IconButton>
        </Box>

        {/* Filter Chips */}
        <Box className="flex gap-2">
          <Paper
            elevation={0}
            className="flex items-center space-x-2 bg-transparent shadow-none"
          >
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                filter === "All"
                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                  : "text-gray-600 border-gray-200"
              }`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                filter === "Read"
                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                  : "text-gray-600 border-gray-200"
              }`}
              onClick={() => setFilter("Read")}
            >
              Read
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                filter === "Today"
                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                  : "text-gray-600 border-gray-200"
              }`}
              onClick={() => setFilter("Today")}
            >
              Today
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                filter === "Unread"
                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                  : "text-gray-600 border-gray-200"
              }`}
              onClick={() => setFilter("Unread")}
            >
              Unread
            </button>
          </Paper>
          <Typography
            variant="caption"
            className="ml-auto cursor-pointer text-indigo-600 font-medium self-center"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Search Bar */}
      <Box className="px-4 py-2">
        <Paper
          elevation={0}
          className="flex items-center px-3 py-1 bg-gray-100 rounded-full"
        >
          <Search className="text-gray-400 mr-2" />
          <InputBase
            placeholder="Search Drafts"
            className="text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MoreVert className="text-gray-400" />
        </Paper>
      </Box>

      {/* Drafts Email List */}
      <List className="overflow-y-scroll h-[800px] pt-0">
        {draftEmails.map((email) => (
          <React.Fragment key={email.id.toString()}>
            <ListItem alignItems="center" disablePadding>
              <ListItemButton
                onClick={() => handleEmailClick(email)}
                className="hover:bg-indigo-50 transition-colors cursor-pointer px-4"
              >
                <ListItemAvatar>
                  <Avatar
                    src={`https://i.pravatar.cc/150?u=draft-${email.id}`}
                    className="w-12 h-12 border-2 border-white shadow-sm"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box className="flex justify-between items-center">
                      <Typography
                        variant="subtitle2"
                        className="font-bold text-gray-900"
                      >
                        {email.to ?? "Recipient"}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-gray-500"
                      >
                        {email.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="caption"
                        className="block font-semibold text-gray-700"
                      >
                        {email.subject}
                      </Typography>
                      {email.preview && (
                        <Typography
                          variant="caption"
                          className="text-gray-500 line-clamp-1"
                        >
                          {email.preview}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Drafts;
