import { Queue, Worker } from 'bullmq';
import { fetchGmailMessages } from '../auth/gmailAuth';
import { getEmailResponse } from '../utils/geminiConfig';

const emailProcessingQueue = new Queue('email-processing-queue', {
  connection: { host: 'localhost', port: 6379 }
});

export async function scheduleEmailProcessing() {
  await emailProcessingQueue.add('process-email', { processUnreadEmails }, { repeat: { every: 180000 } });
}

export async function processUnreadEmails() {
  const unreadMessages = await fetchGmailMessages();
  if (!unreadMessages || unreadMessages.length === 0) {
    console.log('No unread messages found.');
    return;
  }

  for (const email of unreadMessages as { messageId: string; emailBody: string }[]) {
    if (!email.messageId || !email.emailBody) continue;

    console.log('Processing email with ID:', email.messageId);
    console.log('Email content:', email.emailBody);

    try {
      const generatedResponse = await getEmailResponse(email.emailBody);
      console.log('Generated response:', generatedResponse);
    } catch (error) {
      console.error('Error processing email:', error);
    }
  }
}

const emailWorker = new Worker(
  'email-processing-queue',
  async () => {
    await processUnreadEmails();
  },
  {
    connection: { host: 'localhost', port: 6379 },
  }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed.`);
});

emailWorker.on('failed', (job, err) => {
  if (job) {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
  } else {
    console.error(`Job failed with error: ${err.message}`);
  }
});
