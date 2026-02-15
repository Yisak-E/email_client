import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loadGapiClient,
  initGoogleAuth,
  listEmails,
  getEmail,
  getUserProfile,
} from "../api/api";

export type UserProfile = {
  email: string;
  name?: string;
  picture?: string;
  messagesTotal?: number;
  messagesUnread?: number;
};

export type GmailContextType = {
  isAuthenticated: boolean;
  messages: any[];
  userProfile: UserProfile | null;
  login: () => void;
  logout: () => void;
  refreshEmails: () => Promise<void>;
  getEmailById: (id: string) => Promise<any>;
  loadMoreEmails: () => Promise<void>;
};

const GmailContext = createContext<GmailContextType | null>(null);


export default function GmailProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadGapiClient().catch((err) => console.error("GAPI load error:", err));
  }, []);

  const login = () => {
    initGoogleAuth(async () => {
      try {
        console.log("🔐 Google Auth initiated...");
        const profile = await getUserProfile();
        console.log("👤 User profile fetched:", profile.emailAddress);
        setUserProfile({
          email: profile.emailAddress || "",
          messagesTotal: profile.messagesTotal || 0,
          messagesUnread: profile.messagesUnread || 0,
        });
        setIsAuthenticated(true);
        console.log("✅ Authenticated, refreshing emails...");
        await refreshEmails();
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setIsAuthenticated(true);
        await refreshEmails();
      }
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setMessages([]);
    setUserProfile(null);
    setNextPageToken(null);
  };

  const refreshEmails = async () => {
    try {
      console.log("📧 Fetching emails...");
      const result = await listEmails(100, null);
      console.log("📨 Emails fetched:", result.messages?.length || 0, "messages");
      if (result.messages?.length > 0) {
        console.log("First email:", result.messages[0]);
      }
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
        userProfile,
        login,
        logout,
        refreshEmails,
        getEmailById,
        loadMoreEmails,
      }}
    >
      {children}
    </GmailContext.Provider>
  )
}

export const useGmail = (): GmailContextType => {
  const ctx = useContext(GmailContext);
  if (!ctx) {
    throw new Error("useGmail must be used inside GmailProvider");
  }
  return ctx;
};
