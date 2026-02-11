import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";


import inboxMessages from "./data/inboxMessages.json";
import sentMessages from "./data/sentMessages.json";
import trashMessages from "./data/trashMessages.json";
import spamMessages from "./data/spamMessages.json";
import draftMessages from "./data/draftMessages.json";
import type { MessageType } from "./types/MailType";


type EmailContextType = {
    inboxMessageList: MessageType[];
    sentMessageList: MessageType[];
    draftMessageList?: MessageType[];
    spamMessageList?: MessageType[];
    trashMessageList?: MessageType[];
    showSubNav: boolean;
    setShowSubNav: (show: boolean) => void;
    selectedPage: "newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash";
    setSelectedPage: (page: "newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash") => void;
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
    
});


export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inboxMessageList, setInboxMessages] = useState<MessageType[]>([]);
    const [sentMessageList, setSentMessages] = useState<MessageType[]>([]);
    const [draftMessageList, setDraftMessages] = useState<MessageType[]>([]);
    const [spamMessageList, setSpamMessages] = useState<MessageType[]>([]);
    const [trashMessageList, setTrashMessages] = useState<MessageType[]>([]);
    const [showSubNav, setShowSubNav] = useState(false);
    const [selectedPage, setSelectedPage] = useState<"newMail" | "inbox" | "sent" | "drafts" | "spam" | "trash">("inbox");


    useEffect(() => {
        setInboxMessages(inboxMessages.emails as MessageType[]);
        setSentMessages(sentMessages.emails as MessageType[]);
        setDraftMessages(draftMessages.emails as MessageType[]);
        setSpamMessages(spamMessages.emails as MessageType[]);
        setTrashMessages(trashMessages.emails as MessageType[]);
    }, []);

    return (
        <EmailContext.Provider value={{ inboxMessageList, sentMessageList, draftMessageList, spamMessageList, trashMessageList, showSubNav, setShowSubNav, selectedPage, setSelectedPage }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmailContext = () => useContext(EmailContext);
