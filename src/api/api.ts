// api.ts
/* 
  Gmail API + Google Identity Services (GIS)
  Works in React + TypeScript
*/

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";

const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

let accessToken: string | null = null;

/* ---------------------------
   Load Google API client
---------------------------- */
export async function loadGapiClient() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      gapi.load("client", async () => {
        try {
          await gapi.client.init({
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
   Google Identity Services
---------------------------- */
export function initGoogleAuth(onSuccess: () => void) {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;

  script.onload = () => {
    google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        accessToken = response.access_token;
        onSuccess();
      },
    }).requestAccessToken();
  };

  document.body.appendChild(script);
}

/* ---------------------------
   Fetch Gmail Messages
---------------------------- */
export async function listEmails(maxResults = 20) {
  if (!accessToken) throw new Error("User not authenticated");

  const response = await gapi.client.gmail.users.messages.list({
    userId: "me",
    maxResults,
  });

  return response.result.messages || [];
}

/* ---------------------------
   Fetch Single Email
---------------------------- */
export async function getEmail(messageId: string) {
  if (!accessToken) throw new Error("User not authenticated");

  const response = await gapi.client.gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  return response.result;
}
