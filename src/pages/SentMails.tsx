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
} from "@mui/material";
import type { MessageType } from "../types/MailType";
import { useEmailContext } from "../EmailContext";
import sentMessagesData from "../../public/data/sentMessages.json";

const SentMails = () => {
    const { setSelectedEmail, setSelectedView } = useEmailContext();

    const sentEmails = sentMessagesData.emails as MessageType[];

    const handleEmailClick = (email: MessageType) => {
        setSelectedEmail(email);
        setSelectedView("view");
    };

    return (
        <Box className="flex flex-col h-full w-full">
            <Box className="p-4 flex items-center justify-between">
                <Typography variant="h6" className="font-bold text-gray-800">
                    Sent ({sentEmails.length})
                </Typography>
            </Box>

            <Divider />

            <List className="overflow-y-scroll h-full pt-0">
                {sentEmails.map((email) => (
                    <React.Fragment key={email.id.toString()}>
                        <ListItem alignItems="center" disablePadding>
                            <ListItemButton
                                onClick={() => handleEmailClick(email)}
                                className="hover:bg-indigo-50 transition-colors cursor-pointer px-4"
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={`https://i.pravatar.cc/150?u=sent-${email.id}`}
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

export default SentMails;