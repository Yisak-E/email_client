import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loadGapiClient,
  initGoogleAuth,
  listEmails,
  getEmail,
} from "../api/api";

type GmailContextType = {
  isAuthenticated: boolean;
  messages: any[];
  login: () => void;
  refreshEmails: () => Promise<void>;
  getEmailById: (id: string) => Promise<any>;
};

const GmailContext = createContext<GmailContextType | null>(null);


export default function GmailProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    loadGapiClient().catch((err) => console.error("GAPI load error:", err));
  }, []);

  const login = () => {
    initGoogleAuth(async () => {
      setIsAuthenticated(true);
      await refreshEmails();
    });
  };
  const refreshEmails = async () => {
    try {
      const msgs = await listEmails(20);
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    }
  };
  const getEmailById = async (id: string) => {
    try {
      return await getEmail(id);
    } catch (err) {
      console.error("Failed to fetch email:", err);
      return null;
    }
  };

  return (
    <GmailContext.Provider
      value={{
        isAuthenticated,
        messages,
        login,
        refreshEmails,
        getEmailById,
      }}
    >
      {children}
    </GmailContext.Provider>
  )
}

export const useGmail = () => {
  const ctx = useContext(GmailContext);
  if (!ctx) {
    throw new Error("useGmail must be used inside GmailProvider");
  }
  return ctx;
};
