import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";


import inboxMessages from "./data/inboxMessages.json";
import sentMessages from "./data/sentMessages.json";
import type { MessageType } from "./types/MailType";


type EmailContextType = {
    inboxMessageList: MessageType[];
    sentMessageList: MessageType[];
};

const EmailContext = createContext<EmailContextType>({
    inboxMessageList: [],
    sentMessageList: [],
});


export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inboxMessageList, setInboxMessages] = useState<MessageType[]>([]);
    const [sentMessageList, setSentMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        setInboxMessages(inboxMessages.emails as MessageType[]);
        setSentMessages(sentMessages.emails as MessageType[]);
    }, []);

    return (
        <EmailContext.Provider value={{ inboxMessageList, sentMessageList }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmailContext = () => useContext(EmailContext);
