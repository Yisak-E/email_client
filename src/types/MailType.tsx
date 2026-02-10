export type MessageType = {
  id: number | string;
  sender: string;
  subject: string;
  content: string;
  time: string;
  status: string;
  read: boolean;
  preview?: string;
  to?: string;
};