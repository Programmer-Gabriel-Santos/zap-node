const express = require("express");
const bodyParser = require("body-parser");
const qrcode = require("qrcode");
const { getClient, getCurrentQR } = require("./whatsapp.js");

const app = express();
app.use(bodyParser.json());

// Webhook principal
app.get("/", (req, res) => {
  res.send("WhatsApp Webhook funcionando!");
})

// Endpoint para exibir QR code
app.get("/qr", async (req, res) => {
  const currentQR = getCurrentQR();
  if (!currentQR) {
    return res.status(404).send("Nenhum QR code gerado ainda.");
  }

  try {
    const base64QR = await qrcode.toDataURL(currentQR);
    res.send(`
      <html>
        <body style="text-align:center;">
          <h1>Escaneie o QR Code para conectar</h1>
          <img src="${base64QR}" />
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Erro ao gerar QR: " + err.message);
  }
});

// Endpoint para retornar QR code como JSON
app.get("/qr/json", async (req, res) => {
  const currentQR = getCurrentQR();
  if (!currentQR) {
    return res.status(404).json({ 
      error: "Nenhum QR code gerado ainda.",
      status: "waiting"
    });
  }

  try {
    const base64QR = await qrcode.toDataURL(currentQR);
    res.json({
      qr: base64QR,
      status: "ready"
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erro ao gerar QR: " + err.message,
      status: "error"
    });
  }
});

// Endpoint para verificar status da conexão
app.get("/status", (req, res) => {
  const client = getClient();
  const currentQR = getCurrentQR();
  
  if (!client) {
    return res.json({
      status: "initializing",
      message: "WhatsApp client está sendo inicializado"
    });
  }
  
  if (currentQR) {
    return res.json({
      status: "qr_ready",
      message: "QR code disponível para escaneamento"
    });
  }
  
  if (client.info) {
    return res.json({
      status: "connected",
      message: "WhatsApp conectado",
      info: {
        wid: client.info.wid._serialized,
        platform: client.info.platform
      }
    });
  }
  
  res.json({
    status: "connecting",
    message: "Tentando conectar ao WhatsApp"
  });
});

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
