# Inbox Messages API Structure

This document explains how the Gmail API returns inbox messages and the structure of the data received from the API.

## Overview

The email client fetches inbox messages from the **Gmail API** using the `listEmails()` function. The API returns raw Gmail message objects that are then converted to the internal `MessageType` format for use throughout the application.

## Gmail API Response Structure

### List Messages Response

When calling `listEmails(maxResults, pageToken)`, the API returns:

```json
{
  "messages": [
    {
      "id": "18936c26b234f123",
      "threadId": "18936c26b234f123"
    },
    {
      "id": "18936c1a9b2f1234",
      "threadId": "18936c1a9b2f1234"
    }
  ],
  "nextPageToken": "03927a1709fbc907",
  "resultSizeEstimate": 1234
}
```

#### List Response Fields:
- **messages**: Array of message metadata objects with `id` and `threadId`
- **nextPageToken**: Token for pagination to fetch the next batch of emails (optional, null if no more results)
- **resultSizeEstimate**: Estimated total number of messages in the mailbox

---

### Get Full Message Response

Each message in the list needs to be fetched individually using `getEmail(messageId)` to get the full content:

```json
{
  "id": "18936c26b234f123",
  "threadId": "18936c26b234f123",
  "labelIds": ["INBOX", "IMPORTANT"],
  "snippet": "This is a preview of the email content that appears in the list...",
  "payload": {
    "mimeType": "multipart/alternative",
    "filename": "",
    "headers": [
      {
        "name": "From",
        "value": "sender@example.com"
      },
      {
        "name": "To",
        "value": "recipient@gmail.com"
      },
      {
        "name": "Subject",
        "value": "Email Subject Line"
      },
      {
        "name": "Date",
        "value": "Mon, 14 Feb 2026 10:30:00 +0000"
      },
      {
        "name": "Content-Type",
        "value": "multipart/alternative; boundary=\"boundary123\""
      }
    ],
    "parts": [
      {
        "partId": "0",
        "mimeType": "text/plain",
        "filename": "",
        "headers": [
          {
            "name": "Content-Type",
            "value": "text/plain; charset=\"UTF-8\""
          }
        ],
        "body": {
          "size": 1234,
          "data": "VGhpcyBpcyB0aGUgcGxhaW4gdGV4dCBib2R5IG9mIHRoZSBlbWFpbC4uLg=="
        }
      },
      {
        "partId": "1",
        "mimeType": "text/html",
        "filename": "",
        "headers": [
          {
            "name": "Content-Type",
            "value": "text/html; charset=\"UTF-8\""
          }
        ],
        "body": {
          "size": 2345,
          "data": "PGh0bWw+PGJvZHk+VGhpcyBpcyB0aGUgSFRNTCB2ZXJzaW9uIG9mIHRoZSBlbWFpbC4uLjwvYm9keT48L2h0bWw+"
        }
      }
    ]
  },
  "sizeEstimate": 3456
}
```

#### Full Message Fields:

| Field | Type | Description |
|-------|------|-------------|
| **id** | string | Unique identifier for the message |
| **threadId** | string | The ID of the thread containing this message |
| **labelIds** | array | Labels associated with the message (e.g., "INBOX", "UNREAD", "STARRED") |
| **snippet** | string | Short preview text of the email (max 150 characters) |
| **sizeEstimate** | number | Approximate size of the message in bytes |
| **payload** | object | The message mime structure and content |
| **payload.mimeType** | string | MIME type (usually "multipart/alternative" for emails with both plain text and HTML) |
| **payload.headers** | array | Message headers (From, To, Subject, Date, etc.) |
| **payload.parts** | array | Message body parts (text/plain, text/html, attachments, etc.) |

#### Payload.Headers:
Each header is an object with:
- **name**: Header name (e.g., "From", "To", "Subject", "Date")
- **value**: Header value (the actual data)

#### Payload.Parts:
Each part represents a section of the email:
- **partId**: Identifier within the message
- **mimeType**: Type of content (text/plain, text/html, image/jpeg, etc.)
- **filename**: For attachments, the file name
- **body.data**: Base64-encoded content (see **Base64 Encoding** section below)
- **body.size**: Size of the decoded content in bytes

---

## Base64 Encoding

Gmail API returns email body content encoded in **Base64** format. The content needs to be decoded before displaying.

### Decoding Function

```typescript
const decodeBase64 = (str: string): string => {
  try {
    // Replace URL-safe characters with standard Base64 characters
    const decoded = atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
    // Decode UTF-8 characters
    return decodeURIComponent(decoded.split('').map((c) => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
  } catch (e) {
    return str;
  }
};
```

### Example:
- **Encoded**: `VGhpcyBpcyB0aGUgcGxhaW4gdGV4dCBib2R5IG9mIHRoZSBlbWFpbC4uLg==`
- **Decoded**: `This is the plain text body of the email...`

---

## MessageType (Internal Format)

After fetching from the Gmail API, the data is converted to the `MessageType` format used internally:

```typescript
type MessageType = {
  id: number | string;
  sender: string;              // Extracted from "From" header
  subject: string;             // Extracted from "Subject" header
  content: string;             // Decoded email body content
  time: string;                // Extracted from "Date" header
  status: string;              // Usually "new"
  read: boolean;               // True if "UNREAD" label is absent
  preview?: string;            // Email snippet from Gmail API
  to?: string;                 // Extracted from "To" header
};
```

---

## Data Conversion Process

### Step 1: List Messages
```typescript
const result = await listEmails(100, null);
// Returns: { messages: [...], nextPageToken, resultSizeEstimate }
```

### Step 2: Convert to MessageType
```typescript
const convertGmailToMessage = (gmailMsg: any): MessageType => {
  const headers = gmailMsg.payload?.headers || [];
  const getHeader = (name: string) => 
    headers.find((h: any) => h.name === name)?.value || "";
  
  // Extract body content
  let emailBody = "";
  if (gmailMsg.payload?.parts) {
    const textPart = gmailMsg.payload.parts.find(
      (part: any) => part.mimeType === "text/plain"
    );
    if (textPart?.body?.data) {
      emailBody = decodeBase64(textPart.body.data);
    }
  } else if (gmailMsg.payload?.body?.data) {
    emailBody = decodeBase64(gmailMsg.payload.body.data);
  }
  
  return {
    id: gmailMsg.id,
    sender: getHeader("From"),
    subject: getHeader("Subject") || "(No Subject)",
    content: emailBody || gmailMsg.snippet || "",
    time: getHeader("Date"),
    status: "new",
    read: !gmailMsg.labelIds?.includes("UNREAD"),
    preview: gmailMsg.snippet,
    to: getHeader("To"),
  };
};
```

---

## Label IDs Reference

Common Gmail labels used:
- **INBOX**: Email is in the inbox
- **UNREAD**: Email has not been read
- **STARRED**: Email is starred/flagged
- **SENT**: Email is in sent folder
- **DRAFT**: Email is a draft
- **SPAM**: Email is spam
- **TRASH**: Email is in trash
- **IMPORTANT**: Gmail marked as important

### Checking Read Status:
```typescript
const isUnread = gmailMsg.labelIds?.includes("UNREAD");
const isRead = !isUnread;
```

---

## Pagination

The Gmail API limits results to the `maxResults` parameter (max 100). For large inboxes, use pagination:

```typescript
// First request
const result1 = await listEmails(100, null);
let allMessages = result1.messages;
let nextToken = result1.nextPageToken;

// Load more if available
if (nextToken) {
  const result2 = await listEmails(100, nextToken);
  allMessages = [...allMessages, ...result2.messages];
  nextToken = result2.nextPageToken;
}
```

---

## Error Handling

Common errors from Gmail API:

| Error | Cause | Solution |
|-------|-------|----------|
| "User not authenticated" | Missing access token | Call login() first |
| "Invalid Credentials" | Token expired | Request new token |
| "404 Not Found" | Message deleted | Check message ID |
| "rateLimitExceeded" | Too many requests | Implement exponential backoff |

---

## Example Workflow

1. **User clicks Login** → `login()` is called
2. **Google OAuth** → User grants permission
3. **Load GAPI Client** → `loadGapiClient()` initializes Gmail API
4. **Fetch Inbox** → `listEmails(100, null)` gets first 100 message IDs
5. **Get Full Messages** → `getEmail(id)` fetches complete message for each ID
6. **Convert Data** → `convertGmailToMessage()` transforms to MessageType
7. **Display in Sidebar** → Emails shown in list with sender, subject, preview
8. **Click Email** → Full content decoded and displayed in EmailView

---

## API Limits

- **Rate limits**: 1 billion quota per day per project
- **Batch requests**: Max 100 messages per request
- **Message size**: Max ~25 MB per message
- **Attachments**: Not included in response (use `attachmentId` if needed)

---

## References

- [Gmail API Documentation](https://developers.google.com/gmail/api/reference/rest)
- [Gmail API Message Resource](https://developers.google.com/gmail/api/reference/rest/v1/users.messages)
- [Gmail Labels](https://developers.google.com/gmail/api/guides/labels)
