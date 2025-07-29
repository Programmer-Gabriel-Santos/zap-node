const express = require("express");
const bodyParser = require("body-parser");
const { getClient } = require("./whatsapp.js");

const app = express();
app.use(bodyParser.json());

// Webhook principal
app.post("/webhook", async (req, res) => {
  const payload = req.body;

  // Ignora mensagens que não são de saída
  if (payload.message_type !== "outgoing") {
    return res.sendStatus(200);
  }

  // Ignora mensagens privadas (ex: anotações internas dos agentes)
  if (payload.private === true) {
    return res.sendStatus(200);
  }

  const conversation = payload.conversation;
  const whatsappNumber =
    conversation.meta?.sender?.phone_number ||
    conversation.meta?.sender?.identifier;
  const messageContent = payload.content;

  if (whatsappNumber && messageContent) {
    const chatId = `${whatsappNumber.replace("+", "")}@c.us`;

    try {
      const client = getClient();

      if (client) {
        await client.sendMessage(chatId, messageContent);
      } else {
        console.error("WhatsApp client is not ready yet.");
      }
    } catch (e) {
      console.error("Error sending message to WhatsApp:", e.message);
    }
  }

  res.sendStatus(200);
});

module.exports = app;
