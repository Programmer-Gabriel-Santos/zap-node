const express = require("express");
const bodyParser = require("body-parser");
const { getClient } = require("./whatsapp.js");

const app = express();
app.use(bodyParser.json());

// Webhook principal
app.post("/webhook", async (req, res) => {
 
  const { message, number } = req.body;

  if (message && number) {
    const chatId = `${number.replace("+", "")}`;

    try {
      const client = getClient();

      if (client) {
        await client.sendMessage(chatId, message);
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
