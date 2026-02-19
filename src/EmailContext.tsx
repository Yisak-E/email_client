import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

import type { MessageType } from "./types/MailType";
import { decodeBase64, getHeader, getEmailBody } from "./utils/emailUtils";
import * as api from "./api/api";

type EmailContextType = {
    inboxMessageList: MessageType[];
    sentMessageList: MessageType[];
    draftMessageList?: MessageType[];
    spamMessageList?: MessageType[];
    trashMessageList?: MessageType[];
    showSubNav: boolean;
    setShowSubNav: (show: boolean) => void;
    selectedPage: "newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash" | "settings";
    setSelectedPage: (page: "newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash" | "settings") => void;
    selectedEmail?: MessageType;
    setSelectedEmail?: (email: MessageType) => void;
    // Email utility methods
    decodeBase64: (str: string) => string;
    getHeader: (email: MessageType | undefined, name: string) => string;
    getEmailBody: (email: MessageType | undefined) => string;
    // IPC Methods
    loadEmails: (folder: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    connectToMailServer: (config: any) => Promise<void>;
    connectWithAutoConfig: () => Promise<void>;
    isConnected: boolean;
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
    decodeBase64: decodeBase64,
    getHeader: getHeader,
    getEmailBody: getEmailBody,
    loadEmails: async () => { },
    isLoading: false,
    error: null,
    connectToMailServer: async () => { },
    connectWithAutoConfig: async () => { },
    isConnected: false,
});


export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inboxMessageList, setInboxMessages] = useState<MessageType[]>([]);
    const [sentMessageList, setSentMessages] = useState<MessageType[]>([]);
    const [draftMessageList, setDraftMessages] = useState<MessageType[]>([]);
    const [spamMessageList, setSpamMessages] = useState<MessageType[]>([]);
    const [trashMessageList, setTrashMessages] = useState<MessageType[]>([]);
    const [showSubNav, setShowSubNav] = useState(false);
    const [selectedPage, setSelectedPage] = useState<"newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash" | "settings">("inbox");
    const [selectedEmail, setSelectedEmail] = useState<MessageType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

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
            // Load inbox after connecting
            await loadEmails('INBOX');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect');
            setIsConnected(false);
            console.error('Connection error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const connectWithAutoConfig = async () => {
        const autoConfig = await api.getAutoConfig();
        const gmailImapConfig = autoConfig?.gmail?.imap;
        const gmailSmtpConfig = autoConfig?.gmail?.smtp;

        if (!autoConfig?.hasGmailCredentials || !gmailImapConfig?.auth?.user || !gmailImapConfig?.auth?.pass) {
            throw new Error('Gmail credentials were not found in .env');
        }

        await connectToMailServer(gmailImapConfig);

        if (gmailSmtpConfig?.auth?.user && gmailSmtpConfig?.auth?.pass) {
            await api.configureSMTP(gmailSmtpConfig);
        }

        await api.saveSettings({
            imapProvider: 'gmail',
            imapConfig: gmailImapConfig,
            smtpConfig: gmailSmtpConfig,
        });
    };

    // Optional: Load from saved server config on mount
    useEffect(() => {
        const initializeConnection = async () => {
            try {
                const settings = await api.getSettings();
                if (settings.imapConfig) {
                    await connectToMailServer(settings.imapConfig);
                    return;
                }

                await connectWithAutoConfig();
            } catch (err) {
                console.log('No saved config, waiting for manual connection');
            }
        };
        initializeConnection();
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
            decodeBase64, 
            getHeader, 
            getEmailBody,
            loadEmails,
            isLoading,
            error,
            connectToMailServer,
            connectWithAutoConfig,
            isConnected,
        }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmailContext = () => useContext(EmailContext);
