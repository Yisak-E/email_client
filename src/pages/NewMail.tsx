import { useState } from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";

const NewMail = () => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const handleSend = () => {
    // Hook this up to your send logic / API
    console.log("Sending email", { to, cc, bcc, subject, body });
  };

  const handleDiscard = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setBody("");
    setShowCc(false);
    setShowBcc(false);
  };

  return (
    <Box className="h-full w-full flex justify-center items-start p-4 ">
      <Box className="w-full  h-full bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        {/* Header */}
        <Box className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
          <Typography variant="subtitle1" className="font-semibold">
            New message
          </Typography>
          <Box className="flex items-center gap-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleSend}
            >
              Send
            </Button>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={handleDiscard}
            >
              Discard
            </Button>
          </Box>
        </Box>

        {/* Fields */}
        <Box className="flex-1 flex flex-col px-4 py-3 gap-3 overflow-hidden">
          {/* From (static for now) */}
          <Box className="flex items-center gap-3">
            <Box className="w-16 text-sm text-slate-500">From</Box>
            <Typography className="text-sm text-slate-800">
              you@example.com
            </Typography>
          </Box>

          {/* To row */}
          <Box className="flex items-center gap-3">
            <Box className="w-16 text-sm text-slate-500">To</Box>
            <TextField
              variant="standard"
              fullWidth
              placeholder="Add recipients"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              InputProps={{
                disableUnderline: false,
              }}
            />
            <Button
              size="small"
              variant="text"
              onClick={() => setShowCc((prev) => !prev)}
            >
              Cc
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() => setShowBcc((prev) => !prev)}
            >
              Bcc
            </Button>
          </Box>

          {/* Cc row */}
          {showCc && (
            <Box className="flex items-center gap-3">
              <Box className="w-16 text-sm text-slate-500">Cc</Box>
              <TextField
                variant="standard"
                fullWidth
                placeholder="Add Cc"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                InputProps={{
                  disableUnderline: false,
                }}
              />
            </Box>
          )}

          {/* Bcc row */}
          {showBcc && (
            <Box className="flex items-center gap-3">
              <Box className="w-16 text-sm text-slate-500">Bcc</Box>
              <TextField
                variant="standard"
                fullWidth
                placeholder="Add Bcc"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                InputProps={{
                  disableUnderline: false,
                }}
              />
            </Box>
          )}

          {/* Subject */}
          <Box className="flex items-center gap-3">
            <Box className="w-16 text-sm text-slate-500">Subject</Box>
            <TextField
              variant="standard"
              fullWidth
              placeholder="Add a subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              InputProps={{
                disableUnderline: false,
              }}
            />
          </Box>

          <Divider className="mt-2" />

          {/* Body area with simple formatting toolbar look */}
          <Box className="flex-1 flex flex-col mt-1 border rounded-md overflow-hidden">
            <Box className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b text-xs text-slate-600">
              <span className="font-medium">Message</span>
              <span className="text-slate-400">|</span>
              <span>Formatting</span>
              <span>Insert</span>
              <span>Options</span>
            </Box>
            <Box className="flex-1">
              <TextField
                multiline
                minRows={12}
                fullWidth
                placeholder="Type your message here"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    alignItems: "flex-start",
                    px: 2,
                    py: 1.5,
                  },
                }}
                sx={{ height: "100%" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewMail;