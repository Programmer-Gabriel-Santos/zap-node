

const express = require("express");
const whatsapp = require("./whatsapp.js");
const webhookApp = require("./webhook.js");
const qrcode = require("qrcode-terminal");

const PORT = process.env.PORT || 3000;

const app = express();

// Start WhatsApp client
whatsapp.startWhatsApp();

// Mount webhook endpoint
app.use("/", webhookApp);

// app.get("/", (req, res) => {
//   res.send("WhatsApp Webhook funcionando!");
// })

// Start Express server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
