import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

import type { MessageType } from "./types/MailType";
import { decodeBase64, getHeader, getEmailBody } from "./utils/emailUtils";
import * as api from "./api/api";

interface FolderStats {
    [key: string]: number;
}

type EmailContextType = {
    inboxMessageList: MessageType[];
    sentMessageList: MessageType[];
    draftMessageList?: MessageType[];
    spamMessageList?: MessageType[];
    trashMessageList?: MessageType[];
    showSubNav: boolean;
    setShowSubNav: (show: boolean) => void;
    selectedPage: "newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash" | "settings" | "calendar" | "contacts" | "notes";
    setSelectedPage: (page: "newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash" | "settings" | "calendar" | "contacts" | "notes") => void;
    selectedEmail?: MessageType;
    setSelectedEmail?: (email: MessageType) => void;
    accountEmail: string | null;
    accountName: string | null;
    // Email utility methods
    decodeBase64: (str: string) => string;
    getHeader: (email: MessageType | undefined, name: string) => string;
    getEmailBody: (email: MessageType | undefined) => string;
    // IPC Methods
    loadEmails: (folder: string) => Promise<void>;
    refreshInbox: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    connectToMailServer: (config: any) => Promise<void>;
    isConnected: boolean;
    // Folder management
    folderStats: FolderStats;
    loadFolderStats: () => Promise<void>;
};

const EmailContext = createContext<EmailContextType>({
    inboxMessageList: [],
    sentMessageList: [],
    draftMessageList: [],
    spamMessageList: [],
    trashMessageList: [],
    showSubNav: false,
    setShowSubNav: () => { },
    selectedPage: "inbox",
    setSelectedPage: () => { },
    selectedEmail: undefined,
    setSelectedEmail: () => { },
    accountEmail: null,
    accountName: null,
    decodeBase64: decodeBase64,
    getHeader: getHeader,
    getEmailBody: getEmailBody,
    loadEmails: async () => { },
    refreshInbox: async () => { },
    isLoading: false,
    error: null,
    connectToMailServer: async () => { },
    isConnected: false,
    folderStats: {},
    loadFolderStats: async () => { },
});


export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inboxMessageList, setInboxMessages] = useState<MessageType[]>([]);
    const [sentMessageList, setSentMessages] = useState<MessageType[]>([]);
    const [draftMessageList, setDraftMessages] = useState<MessageType[]>([]);
    const [spamMessageList, setSpamMessages] = useState<MessageType[]>([]);
    const [trashMessageList, setTrashMessages] = useState<MessageType[]>([]);
    const [showSubNav, setShowSubNav] = useState(false);
    const [selectedPage, setSelectedPage] = useState<"newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash" | "settings" | "calendar" | "contacts" | "notes">("inbox");
    const [selectedEmail, setSelectedEmail] = useState<MessageType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [folderStats, setFolderStats] = useState<FolderStats>({});
    const [accountEmail, setAccountEmail] = useState<string | null>(null);
    const [accountName, setAccountName] = useState<string | null>(null);

    const deriveDisplayName = (email: string) => {
        const localPart = email.split('@')[0] || '';
        const withSpaces = localPart.replace(/[._-]+/g, ' ').trim();
        if (!withSpaces) return email;

        return withSpaces
            .split(' ')
            .filter(Boolean)
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join(' ');
    };

    /**
     * Load emails from IMAP folder
     */
    const loadEmails = async (folder: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const pageSize = 50;
            let offset = 0;
            let total = 0;
            let allEmails: any[] = [];

            do {
                const result = await api.listEmails(folder, { limit: pageSize, offset });
                allEmails = [...allEmails, ...result.emails];
                total = result.total;
                offset += result.emails.length;

                if (result.emails.length === 0) {
                    break;
                }
            } while (offset < total);
            
            // Convert IMAP format to MessageType
            const messages = allEmails.map((email: any) => ({
                id: email.uid?.toString() || '',
                threadId: email.uid?.toString() || '',
                labelIds: [folder],
                snippet: email.text?.substring(0, 100) || '',
                payload: {
                    mimeType: 'text/plain',
                    headers: [
                        { name: 'Subject', value: email.subject || '(No Subject)' },
                        { name: 'From', value: email.from || '' },
                        { name: 'To', value: email.to || '' },
                        { name: 'Date', value: new Date(email.date || Date.now()).toLocaleString() },
                    ],
                    body: {
                        data: email.html || email.text || '',
                    },
                },
            }));

            if (folder === 'INBOX') {
                setInboxMessages(messages);
            } else if (folder === 'Sent') {
                setSentMessages(messages);
            } else if (folder === 'Drafts') {
                setDraftMessages(messages);
            } else if (folder === 'Spam') {
                setSpamMessages(messages);
            } else if (folder === 'Trash') {
                setTrashMessages(messages);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load emails');
            console.error('Error loading emails:', err);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Connect to mail server
     */
    const connectToMailServer = async (config: any) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.connectImap(config);
            setIsConnected(true);
            if (config?.auth?.user) {
                setAccountEmail(config.auth.user);
                setAccountName(deriveDisplayName(config.auth.user));
            }
            // Load inbox after connecting
            await loadEmails('INBOX');
            // Load folder stats
            await loadFolderStats();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect');
            setIsConnected(false);
            console.error('Connection error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Refresh inbox emails (pull latest)
     */
    const refreshInbox = async () => {
        try {
            await loadEmails('INBOX');
            await loadFolderStats();
            console.log('✅ Inbox refreshed');
        } catch (err) {
            console.error('Error refreshing inbox:', err);
            setError(err instanceof Error ? err.message : 'Failed to refresh inbox');
        }
    };

    /**
     * Load email counts for all folders
     */
    const loadFolderStats = async () => {
        try {
            const folders = await api.listFolders();
            const stats: FolderStats = {};

            for (const folder of folders) {
                try {
                    const result = await api.listEmails(folder, { limit: 1, offset: 0 });
                    stats[folder] = result.total;
                } catch (err) {
                    console.warn(`Could not load stats for folder ${folder}:`, err);
                    stats[folder] = 0;
                }
            }

            setFolderStats(stats);
            console.log('📊 Folder stats loaded:', stats);
        } catch (err) {
            console.error('Error loading folder stats:', err);
        }
    };

    // AUTO-LOGIN on app startup using .env credentials
    useEffect(() => {
        const initializeAutoLogin = async () => {
            try {
                // Wait for Electron API to be available
                console.log('⏳ Waiting for Electron API bridge...');
                await api.waitForElectronAPI();
                console.log('✅ Electron API bridge ready, proceeding with auto-login');

                // Get auto config from Electron main process (reads .env)
                const autoConfig = await api.getAutoConfig();
                const gmailImapConfig = autoConfig?.gmail?.imap;
                const gmailSmtpConfig = autoConfig?.gmail?.smtp;

                if (!autoConfig?.hasGmailCredentials || !gmailImapConfig?.auth?.user || !gmailImapConfig?.auth?.pass) {
                    throw new Error('Gmail credentials not found in .env');
                }

                console.log('🔐 Auto-logging in with Gmail credentials from .env...');
                await connectToMailServer(gmailImapConfig);

                if (gmailSmtpConfig?.auth?.user && gmailSmtpConfig?.auth?.pass) {
                    await api.configureSMTP(gmailSmtpConfig);
                }

                await api.saveSettings({
                    imapProvider: 'gmail',
                    imapConfig: gmailImapConfig,
                    smtpConfig: gmailSmtpConfig,
                });

                if (gmailImapConfig?.auth?.user) {
                    setAccountEmail(gmailImapConfig.auth.user);
                    setAccountName(deriveDisplayName(gmailImapConfig.auth.user));
                }

                console.log('✅ Auto-login successful!');
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Auto-login failed';
                console.error('❌ ' + message, err);
                setError(message);
            }
        };

        initializeAutoLogin();
    }, []);

    return (
        <EmailContext.Provider value={{ 
            inboxMessageList, 
            sentMessageList, 
            draftMessageList, 
            spamMessageList, 
            trashMessageList, 
            showSubNav, 
            setShowSubNav, 
            selectedPage, 
            setSelectedPage, 
            selectedEmail, 
            setSelectedEmail, 
            accountEmail,
            accountName,
            decodeBase64, 
            getHeader, 
            getEmailBody,
            loadEmails,
            refreshInbox,
            isLoading,
            error,
            connectToMailServer,
            isConnected,
            folderStats,
            loadFolderStats,
        }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmailContext = () => useContext(EmailContext);
