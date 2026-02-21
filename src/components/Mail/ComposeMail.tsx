

import { M3Box, M3Typography, M3Stack, M3IconButton, M3TextField, M3Button } from "m3r";
import { useState, useRef, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';

interface ComposeMailProps {
    open: boolean;
    onClose: () => void;
}

export default function ComposeMail({ open, onClose }: ComposeMailProps) {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Draggable state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        if (open) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            // Reset position when closed
            setPosition({ x: 0, y: 0 });
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [open]);

    const handleSend = async () => {
        if (!to || !subject || !body) {
            setError("Please fill in all fields");
            return;
        }

        setSending(true);
        setError(null);

        try {
           // await window.electronAPI.sendEmail({ to, subject, body });
            // Clean up and close
            setTo("");
            setSubject("");
            setBody("");
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send email');
        } finally {
            setSending(false);
        }
    };

    if (!open) return null;



    return (
        <M3Box
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 80,
                width: 500,
                height: 500,
                backgroundColor: 'background.paper',
                zIndex: 1300,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging.current ? 'none' : 'transform 0.1s ease-out'
            }}
        >
            <M3Box
                onMouseDown={handleMouseDown}
                sx={{
                    bgcolor: 'surfaceVariant.main',
                    p: 1.5,
                    px: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                    userSelect: 'none',
                    flexShrink: 0
                }}
            >
                <M3Typography variant="titleMedium">New Message</M3Typography>
                <M3IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </M3IconButton>
            </M3Box>

            <M3Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflow: 'hidden' }}>
                {error && <M3Typography color="error.main" variant="bodySmall">{error}</M3Typography>}

                <M3TextField
                    placeholder="Recipients"
                    variant="filled"
                    fullWidth
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    sx={{ flexShrink: 0 }}
                />

                <M3TextField
                    placeholder="Subject"
                    variant="filled"
                    fullWidth
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    sx={{ flexShrink: 0 }}
                />

                <M3TextField
                    placeholder="Message"
                    multiline
                    minRows={6}
                    variant="filled"
                    fullWidth
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    sx={{
                        flexGrow: 1, // fill remaining space
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiInputBase-root': {
                            height: '100%', // expand input base to fill container
                            alignItems: 'flex-start',
                            overflowY: 'auto', // scroll internally
                            borderBottomLeftRadius: 16, // Match container if at bottom 
                            borderBottomRightRadius: 16
                        }
                    }}
                />

                <M3Stack direction="row" justifyContent="flex-end" alignItems="center" mt={1} sx={{ flexShrink: 0 }}>
                    <M3Button
                        variant="filled"
                        onClick={handleSend}
                        disabled={sending}
                        sx={{ borderRadius: 20, px: 4 }}
                    >
                        {sending ? 'Sending...' : 'Send'}
                    </M3Button>
                </M3Stack>
            </M3Box>
        </M3Box>
    );
}



