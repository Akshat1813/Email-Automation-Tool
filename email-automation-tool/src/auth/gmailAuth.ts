import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function getGmailAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  return url;
}

export async function getGmailToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
  
}
export async function fetchGmailMessages(){
    try {
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const response = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults: 5,
      });
  
      const messages = response.data.messages;
      if (!messages || messages.length === 0) {
        console.log('No messages found.');
        return;
      }
  
      const completeMsg: { messageId: string; emailBody: string | null | undefined }[] = [];
      for (const message of messages) {
        if (!message.id) continue;
        
        const msgResponse = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });
        const emailBody = msgResponse.data.snippet;
        completeMsg.push({ messageId: message.id, emailBody });
      }
  
      return completeMsg;
    } catch (error) {
      console.error('Error fetching Gmail messages:', error);
    }
}
