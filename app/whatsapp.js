require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
// const path = require("path");

// Exported client for integration with other modules
let client = null;

async function sendMessageToN8n(msg) {

  try {
    const sendToWebhook = await fetch(
      // process.env.N8N_WEBHOOK_URL,
      "http://localhost:5678/webhook/webhook",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      }
    );

    if (!sendToWebhook.ok) {
      console.log("Erro ao enviar mensagem ao n8n. Motivo provável: conexão com webhook falhou.");
      return
    }

  } catch (e) {
    console.error("Error ao enviar mensagem ao n8n:", e.message);
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

  // console.log("Funções disponíveis no client: \n", Object.getOwnPropertyNames(Object.getPrototypeOf(client)));

  const filaMensagens = {};
  const TEMPO_AGUARDAR = 12000;

  client.on("message", async (msg) => {

    try {

      if (msg.fromMe) return;
      if (!msg.from.endsWith('@c.us')) return;
      if (msg.type !== 'chat') return;
      if (!msg.body) return;

      const numero = msg.from;

      // Verifica se já é um contato salvo
      const contato = await client.getContactById(numero);
      if (contato.isMyContact && msg.body !== "--test") return;

      // Inicializa fila se não existir
      if (!filaMensagens[numero]) {
        console.log("fila de mensagens iniciada");
        filaMensagens[numero] = {
          mensagens: [],
          timeout: null
        };
      }

      // Armazena a mensagem recebida
      filaMensagens[numero].mensagens.push(msg.body);

      // Reseta o timer, se já estava contando
      if (filaMensagens[numero].timeout) {
        console.log("chegou mais uma mensagem, timeout reiniciado")
        clearTimeout(filaMensagens[numero].timeout);
      }

      // Inicia/reinicia o timer
      filaMensagens[numero].timeout = setTimeout(async () => {
        const mensagemFinal = filaMensagens[numero].mensagens.join(' ').trim();
        delete filaMensagens[numero]; // limpa da fila

        // Marcar como lido
        await client.sendSeen(numero);

        
        const payload = {
          message: mensagemFinal,
          from: msg.from,
          fromMe: msg.id.fromMe,
          timestamp: msg.timestamp,
          fromName: msg.notifyName
        }
        
        await sendMessageToN8n(payload);

      }, TEMPO_AGUARDAR);


    } catch (e) {
      console.error("Error creating contact/conversation:", e.message);
    }
  });

  client.initialize();
}

// Export functions and WhatsApp client instance
module.exports = {
  startWhatsApp,
  getClient: () => client,
};
