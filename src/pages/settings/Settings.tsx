import { useState } from 'react';
import { M3Box, M3Button, M3TextField, M3Typography } from 'm3r';
import { useEmailContext } from '../../EmailContext';
import * as api from '../../api/api';

const Settings = () => {
  const { connectToMailServer } = useEmailContext();
  
  const [activeTab, setActiveTab] = useState<'imap' | 'smtp'>('imap');
  const [imapConfig, setImapConfig] = useState({
    host: '',
    port: 993,
    secure: true,
    auth: {
      user: '',
      pass: '',
    },
  });

  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: '',
    },
    from: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ============ IMAP Config Handlers ============
  const handleImapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('auth.')) {
      const authField = name.split('.')[1];
      setImapConfig({
        ...imapConfig,
        auth: {
          ...imapConfig.auth,
          [authField]: value,
        },
      });
    } else if (type === 'checkbox') {
      setImapConfig({ ...imapConfig, [name]: checked });
    } else if (type === 'number') {
      setImapConfig({ ...imapConfig, [name]: parseInt(value) });
    } else {
      setImapConfig({ ...imapConfig, [name]: value });
    }
  };

  const handleTestImapConnection = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await connectToMailServer(imapConfig);
      setMessage({ type: 'success', text: 'IMAP connection successful!' });
      // Save config
      await api.saveSettings({ imapConfig });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'IMAP connection failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // ============ SMTP Config Handlers ============
  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('auth.')) {
      const authField = name.split('.')[1];
      setSmtpConfig({
        ...smtpConfig,
        auth: {
          ...smtpConfig.auth,
          [authField]: value,
        },
      });
    } else if (type === 'checkbox') {
      setSmtpConfig({ ...smtpConfig, [name]: checked });
    } else if (type === 'number') {
      setSmtpConfig({ ...smtpConfig, [name]: parseInt(value) });
    } else {
      setSmtpConfig({ ...smtpConfig, [name]: value });
    }
  };

  const handleTestSmtpConnection = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await api.configureSMTP(smtpConfig);
      setMessage({ type: 'success', text: 'SMTP configuration successful!' });
      // Save config
      await api.saveSettings({ smtpConfig });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'SMTP configuration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <M3Box className="p-6 h-full overflow-y-auto bg-gray-50">
      <M3Typography variant="headlineLarge" className="mb-6">
        Email Account Settings
      </M3Typography>

      {/* Tab Navigation */}
      <M3Box className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('imap')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'imap'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          IMAP (Receive)
        </button>
        <button
          onClick={() => setActiveTab('smtp')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'smtp'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          SMTP (Send)
        </button>
      </M3Box>

      {/* Status Message */}
      {message && (
        <M3Box
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </M3Box>
      )}

      {/* IMAP Configuration */}
      {activeTab === 'imap' && (
        <M3Box className="bg-white p-6 rounded-lg shadow-sm">
          <M3Typography variant="titleLarge" className="mb-4">
            IMAP Server Configuration
          </M3Typography>

          <p className="text-gray-600 text-sm mb-4">
            Configure your email provider's IMAP settings to receive emails.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IMAP Host
              </label>
              <M3TextField
                name="host"
                value={imapConfig.host}
                onChange={handleImapChange}
                placeholder="e.g., imap.gmail.com"
                fullWidth
                size="small"
              />
              <p className="text-xs text-gray-500 mt-1">
                Examples: imap.gmail.com, imap-mail.outlook.com
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <M3TextField
                  name="port"
                  type="number"
                  value={imapConfig.port}
                  onChange={handleImapChange}
                  fullWidth
                  size="small"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secure (SSL/TLS)
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="secure"
                    checked={imapConfig.secure}
                    onChange={handleImapChange}
                    className="h-4 w-4"
                  />
                  <span className="ml-2 text-sm">Use SSL/TLS</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <M3TextField
                name="auth.user"
                value={imapConfig.auth.user}
                onChange={handleImapChange}
                type="email"
                placeholder="your-email@example.com"
                fullWidth
                size="small"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <M3TextField
                name="auth.pass"
                value={imapConfig.auth.pass}
                onChange={handleImapChange}
                type="password"
                placeholder="Your password or app-specific password"
                fullWidth
                size="small"
              />
              <p className="text-xs text-gray-500 mt-1">
                For Gmail: Use{' '}
                <a
                  href="https://support.google.com/accounts/answer/185833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  App Password
                </a>
              </p>
            </div>

            <M3Button
              onClick={handleTestImapConnection}
              disabled={loading || !imapConfig.host || !imapConfig.auth.user}
              className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </M3Button>
          </div>
        </M3Box>
      )}

      {/* SMTP Configuration */}
      {activeTab === 'smtp' && (
        <M3Box className="bg-white p-6 rounded-lg shadow-sm">
          <M3Typography variant="titleLarge" className="mb-4">
            SMTP Server Configuration
          </M3Typography>

          <p className="text-gray-600 text-sm mb-4">
            Configure your email provider's SMTP settings to send emails.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Host
              </label>
              <M3TextField
                name="host"
                value={smtpConfig.host}
                onChange={handleSmtpChange}
                placeholder="e.g., smtp.gmail.com"
                fullWidth
                size="small"
              />
              <p className="text-xs text-gray-500 mt-1">
                Examples: smtp.gmail.com, smtp-mail.outlook.com
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <M3TextField
                  name="port"
                  type="number"
                  value={smtpConfig.port}
                  onChange={handleSmtpChange}
                  fullWidth
                  size="small"
                />
                <p className="text-xs text-gray-500 mt-1">587 for TLS, 465 for SSL</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secure (SSL/TLS)
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="secure"
                    checked={smtpConfig.secure}
                    onChange={handleSmtpChange}
                    className="h-4 w-4"
                  />
                  <span className="ml-2 text-sm">Use SSL/TLS</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address (Username)
              </label>
              <M3TextField
                name="auth.user"
                value={smtpConfig.auth.user}
                onChange={handleSmtpChange}
                type="email"
                placeholder="your-email@example.com"
                fullWidth
                size="small"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <M3TextField
                name="auth.pass"
                value={smtpConfig.auth.pass}
                onChange={handleSmtpChange}
                type="password"
                placeholder="Your password or app-specific password"
                fullWidth
                size="small"
              />
              <p className="text-xs text-gray-500 mt-1">
                For Gmail: Use{' '}
                <a
                  href="https://support.google.com/accounts/answer/185833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  App Password
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Address (Optional)
              </label>
              <M3TextField
                name="from"
                value={smtpConfig.from}
                onChange={handleSmtpChange}
                type="email"
                placeholder="sender@example.com"
                fullWidth
                size="small"
              />
              <p className="text-xs text-gray-500 mt-1">
                If blank, uses the email address above
              </p>
            </div>

            <M3Button
              onClick={handleTestSmtpConnection}
              disabled={loading || !smtpConfig.host || !smtpConfig.auth.user}
              className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </M3Button>
          </div>
        </M3Box>
      )}

      {/* Quick Config Section */}
      <M3Box className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
        <M3Typography variant="titleMedium" className="mb-3 text-blue-900">
          💡 Quick Setup
        </M3Typography>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            • <strong>Gmail:</strong> Use{' '}
            <a
              href="https://support.google.com/accounts/answer/185833"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              App Password
            </a>{' '}
            instead of account password
          </li>
          <li>
            • <strong>Outlook:</strong> Use your Microsoft account email and password
          </li>
          <li>
            • <strong>Other providers:</strong> Check your email provider's documentation
            for IMAP/SMTP settings
          </li>
        </ul>
      </M3Box>
    </M3Box>
  );
};

export default Settings;
