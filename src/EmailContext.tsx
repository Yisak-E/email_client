import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import messagesData from "../public/data/messages.json";
import  { type MessageType } from "./types/MailType";

type EmailContextType = {
  selectedEmail: MessageType | null;
  setSelectedEmail: (email: MessageType | null) => void;
  filter: string;
  setFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedView: string;
  setSelectedView: (view: string) => void;
  mailbox: "inbox" | "sent";
  setMailbox: (mailbox: "inbox" | "sent") => void;
  emailList: MessageType[];
  setEmailList: (emails: MessageType[]) => void;
};

const EmailContext = createContext<EmailContextType | undefined>(undefined);

type EmailProviderProps = {
  children: ReactNode;
};

export const EmailProvider = ({ children }: EmailProviderProps) => {
  const [selectedEmail, setSelectedEmail] = useState<MessageType | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("view");
  const [mailbox, setMailbox] = useState<"inbox" | "sent">("inbox");
  const [emailList, setEmailList] = useState<MessageType[]>(
    messagesData.emails as MessageType[]
  );

  useEffect(() => {
    let baseList = messagesData.emails as MessageType[];

    if (filter === "Read") {
      baseList = baseList.filter((email) => email.read);
    } else if (filter === "Unread") {
      baseList = baseList.filter((email) => !email.read);
    } else if (filter === "Today") {
      const todayLabel = "Now";
      baseList = baseList.filter((email) => email.time === todayLabel);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      baseList = baseList.filter(
        (email) =>
          email.sender.toLowerCase().includes(lowerSearchTerm) ||
          email.subject.toLowerCase().includes(lowerSearchTerm) ||
          email.content.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setEmailList(baseList);
  }, [filter, searchTerm]);

  const value: EmailContextType = {
    selectedEmail,
    setSelectedEmail,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    selectedView,
    setSelectedView,
    mailbox,
    setMailbox,
    emailList,
    setEmailList,
  };

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};

export const useEmailContext = () => {
  const ctx = useContext(EmailContext);
  if (!ctx) {
    throw new Error("useEmailContext must be used within an EmailProvider");
  }
  return ctx;
};

export default EmailContext;