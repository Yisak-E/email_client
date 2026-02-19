import { useState } from 'react';
import { M3Box, M3Button, M3TextField, M3Typography, M3Dialog } from 'm3r';
import * as api from '../../api/api';
import { useEmailContext } from '../../EmailContext';

interface ComposeState {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}

const NewMail = () => {
  const { isLoading } = useEmailContext();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [compose, setCompose] = useState<ComposeState>({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });

  const handleChange = (field: keyof ComposeState, value: string) => {
    setCompose((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!compose.to.trim()) {
      setError('Recipient email is required');
      return false;
    }
    if (!compose.to.includes('@')) {
      setError('Invalid email address');
      return false;
    }
    if (!compose.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setSending(true);
    setError(null);
    try {
      const result = await api.sendEmail({
        to: compose.to,
        cc: compose.cc || undefined,
        bcc: compose.bcc || undefined,
        subject: compose.subject,
        html: compose.body,
        text: compose.body,
      });

      console.log('✅ Email sent:', result.messageId);
      setSuccess(true);

      // Reset form
      setCompose({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
      });

      // Close dialog after 1.5 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send email';
      setError(message);
      console.error('❌ Send email failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setOpen(false);
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <>
      <M3Button
        variant="filled"
        onClick={() => setOpen(true)}
        disabled={isLoading}
        sx={{
          marginBottom: 2,
          width: '100%',
          padding: '12px',
          fontSize: '1rem',
        }}
      >
        ✉️ Compose
      </M3Button>

      <M3Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <M3Box sx={{ padding: 3 }}>
          <M3Typography variant="headlineSmall" sx={{ marginBottom: 2 }}>
            New Message
          </M3Typography>

          {success && (
            <M3Box
              sx={{
                padding: 2,
                marginBottom: 2,
                backgroundColor: '#E6F4EA',
                borderRadius: '8px',
                border: '1px solid #34A853',
              }}
            >
              <M3Typography variant="bodySmall" sx={{ color: '#137333' }}>
                ✅ Email sent successfully!
              </M3Typography>
            </M3Box>
          )}

          {error && (
            <M3Box
              sx={{
                padding: 2,
                marginBottom: 2,
                backgroundColor: '#FCE8E6',
                borderRadius: '8px',
                border: '1px solid #D33B27',
              }}
            >
              <M3Typography variant="bodySmall" sx={{ color: '#C5221F' }}>
                ❌ {error}
              </M3Typography>
            </M3Box>
          )}

          <M3TextField
            label="To"
            value={compose.to}
            onChange={(e: any) => handleChange('to', e.target.value)}
            fullWidth
            margin="normal"
            placeholder="recipient@example.com"
            disabled={sending}
          />

          <M3TextField
            label="Cc"
            value={compose.cc}
            onChange={(e: any) => handleChange('cc', e.target.value)}
            fullWidth
            margin="normal"
            placeholder="(optional)"
            disabled={sending}
          />

          <M3TextField
            label="Bcc"
            value={compose.bcc}
            onChange={(e: any) => handleChange('bcc', e.target.value)}
            fullWidth
            margin="normal"
            placeholder="(optional)"
            disabled={sending}
          />

          <M3TextField
            label="Subject"
            value={compose.subject}
            onChange={(e: any) => handleChange('subject', e.target.value)}
            fullWidth
            margin="normal"
            disabled={sending}
          />

          <M3TextField
            label="Message"
            value={compose.body}
            onChange={(e: any) => handleChange('body', e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={6}
            disabled={sending}
          />

          <M3Box sx={{ display: 'flex', gap: 1, marginTop: 3, justifyContent: 'flex-end' }}>
            <M3Button
              variant="outlined"
              onClick={handleClose}
              disabled={sending}
            >
              Cancel
            </M3Button>
            <M3Button
              variant="filled"
              onClick={handleSend}
              disabled={sending || !compose.to}
            >
              {sending ? 'Sending...' : 'Send'}
            </M3Button>
          </M3Box>
        </M3Box>
      </M3Dialog>
    </>
  );
};

export default NewMail;
