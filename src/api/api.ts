// api.ts
/* 
  Gmail API + Google Identity Services (GIS)
  Works in React + TypeScript
*/

// Declare global objects
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";

const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

let accessToken: string | null = null;
let tokenClient: any = null;

/* ---------------------------
   Load Google API client
---------------------------- */
export async function loadGapiClient() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/* ---------------------------
   Initialize Google Identity Services
---------------------------- */
export function initializeGIS(onSuccess: () => void) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      try {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response: any) => {
            if (response.access_token) {
              accessToken = response.access_token;
              onSuccess();
            }
          },
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/* ---------------------------
   Google Identity Services - Trigger Auth
---------------------------- */
export function initGoogleAuth(onSuccess: () => void) {
  console.log("🔑 Initializing Google Auth, tokenClient status:", !!tokenClient);
  if (tokenClient) {
    console.log("✅ TokenClient exists, requesting token...");
    tokenClient.requestAccessToken();
  } else {
    console.log("❌ TokenClient missing, initializing GIS...");
    initializeGIS(onSuccess).then(() => {
      if (tokenClient) {
        console.log("✅ GIS initialized, requesting token...");
        tokenClient.requestAccessToken();
      }
    }).catch(err => {
      console.error("GIS initialization failed:", err);
    });
  }
}

/* ---------------------------
   Fetch Gmail Messages with Pagination
---------------------------- */
export async function listEmails(maxResults = 100, pageToken: string | null = null) {
  if (!accessToken) {
    console.error("❌ No access token - user not authenticated");
    throw new Error("User not authenticated");
  }

  console.log("📡 Calling Gmail API - listEmails, maxResults:", maxResults);
  const params: any = {
    userId: "me",
    maxResults,
  };

  if (pageToken) {
    params.pageToken = pageToken;
  }

  const response = await window.gapi.client.gmail.users.messages.list(params);
  console.log("📥 Gmail API response received, messages:", response.result.messages?.length || 0);

  const messageIds = response.result.messages || [];
  
  // Fetch full details for each message to get headers
  console.log("📋 Fetching full details for", messageIds.length, "messages...");
  const fullMessages = await Promise.all(
    messageIds.map(async (msg: any) => {
      try {
        const fullMsg = await window.gapi.client.gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "full",
        });
        return fullMsg.result;
      } catch (err) {
        console.error("Error fetching message:", msg.id, err);
        return msg; // Return minimal message if full fetch fails
      }
    })
  );

  console.log("✅ Full messages fetched with headers");

  return {
    messages: fullMessages,
    nextPageToken: response.result.nextPageToken || null,
    resultSizeEstimate: response.result.resultSizeEstimate || 0,
  };
}

/* ---------------------------
   Fetch Single Email
---------------------------- */
export async function getEmail(messageId: string) {
  if (!accessToken) throw new Error("User not authenticated");

  const response = await window.gapi.client.gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  return response.result;
}

/* ---------------------------
   Fetch User Profile
---------------------------- */
export async function getUserProfile() {
  if (!accessToken) throw new Error("User not authenticated");

  const response = await window.gapi.client.gmail.users.getProfile({
    userId: "me",
  });

  return response.result;
}
