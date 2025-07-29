require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const path = require("path");

// Exported client for integration with other modules
let client = null;

// Initialize SQLite database
const db = new sqlite3.Database(path.resolve(__dirname, "../db/contacts.db"));
db.run(`CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number TEXT UNIQUE,
  contact_id TEXT,
  conversation_id TEXT
)`);

// Send incoming WhatsApp message to Chatwoot
async function sendMessageToChatwoot(contactId, conversationId, content) {
  try {
    await axios.post(
      `${process.env.CHATWOOT_URL}/api/v1/accounts/${process.env.CHATWOOT_ACCOUNT_ID}/conversations/${conversationId}/messages`,
      {
        content: content,
        message_type: "incoming",
        private: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          api_access_token: process.env.CHATWOOT_API_TOKEN,
        },
      }
    );
  } catch (e) {
    console.error("Error sending message to Chatwoot:", e.message);
  }
}

// Start WhatsApp client
function startWhatsApp() {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ["--no-sandbox"] },
  });

  client.on("qr", (qr) => qrcode.generate(qr, { small: true }));

  client.on("ready", () => {
    console.log("Connected to WhatsApp!");
  });

  client.on("message", async (msg) => {
    const rawNumber = msg.from;
    const messageText = msg.body;
    const numberE164 = `+${rawNumber.replace("@c.us", "")}`;

    db.get(
      "SELECT * FROM contacts WHERE number = ?",
      [numberE164],
      async (err, row) => {
        if (row) {
          await sendMessageToChatwoot(
            row.contact_id,
            row.conversation_id,
            messageText
          );
        } else {
          try {
            const contact = await axios.post(
              `${process.env.CHATWOOT_URL}/api/v1/accounts/${process.env.CHATWOOT_ACCOUNT_ID}/contacts`,
              {
                inbox_id: process.env.CHATWOOT_INBOX_ID,
                name: numberE164,
                identifier: numberE164,
                phone_number: numberE164,
                custom_attributes: { whatsapp: true },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  api_access_token: process.env.CHATWOOT_API_TOKEN,
                },
              }
            );

            console.log(`Contact created: ${JSON.stringify(contact.data)}`);

            const contactId = contact.data.payload.contact.id;

            const conversation = await axios.post(
              `${process.env.CHATWOOT_URL}/api/v1/accounts/${process.env.CHATWOOT_ACCOUNT_ID}/conversations`,
              {
                source_id: numberE164,
                inbox_id: process.env.CHATWOOT_INBOX_ID,
                contact_id: contactId,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  api_access_token: process.env.CHATWOOT_API_TOKEN,
                },
              }
            );

            const conversationId = conversation.data.id;

            db.run(
              "INSERT INTO contacts (number, contact_id, conversation_id) VALUES (?, ?, ?)",
              [numberE164, contactId, conversationId]
            );

            await sendMessageToChatwoot(contactId, conversationId, messageText);
          } catch (e) {
            console.error("Error creating contact/conversation:", e.message);
          }
        }
      }
    );
  });

  client.initialize();
}

// Export functions and WhatsApp client instance
module.exports = {
  startWhatsApp,
  getClient: () => client,
};
