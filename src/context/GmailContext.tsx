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
  loadMoreEmails: () => Promise<void>;
};

const GmailContext = createContext<GmailContextType | null>(null);


export default function GmailProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
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
      const result = await listEmails(100, null);
      setMessages(result.messages);
      setNextPageToken(result.nextPageToken);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    }
  };
  const loadMoreEmails = async () => {
    try {
      if (!nextPageToken) return;
      const result = await listEmails(100, nextPageToken);
      setMessages(prev => [...prev, ...result.messages]);
      setNextPageToken(result.nextPageToken);
    } catch (err) {
      console.error("Failed to load more emails:", err);
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
        loadMoreEmails,
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
