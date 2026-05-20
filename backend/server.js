const express = require('express');
const cors = require('cors');
const { Expo } = require('expo-server-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// In‑memory storage for push tokens (replace with a database in production)
let pushTokens = [];

// Endpoint to register a device token (optional but recommended)
app.post('/register-token', (req, res) => {
  const { token } = req.body;
  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  if (!pushTokens.includes(token)) {
    pushTokens.push(token);
  }
  res.json({ success: true });
});

// Endpoint to send a notification
app.post('/send-notification', async (req, res) => {
  const { title, body, data } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }

  const expo = new Expo();
  const messages = pushTokens
    .filter(token => Expo.isExpoPushToken(token))
    .map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {},
    }));

  if (messages.length === 0) {
    return res.json({ message: 'No tokens to send to' });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const receipts = [];
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      receipts.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending chunk:', error);
    }
  }
  res.json({ success: true, receipts });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Push notification server running on port ${PORT}`);
});