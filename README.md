# ZapNode - Integração WhatsApp + Chatwoot

## 🎯 Objetivo do Projeto

O **ZapNode** é uma integração que conecta o WhatsApp Web ao Chatwoot, permitindo centralizar o atendimento ao cliente em uma plataforma unificada. O projeto utiliza Node.js para criar uma ponte entre essas duas plataformas, possibilitando:

- Receber mensagens do WhatsApp e encaminhá-las para o Chatwoot
- Enviar respostas do Chatwoot de volta para o WhatsApp
- Gerenciar contatos e conversas de forma automática
- Manter um histórico de conversas no banco de dados SQLite

## ⚠️ Aviso Importante

**Este é um protótipo em desenvolvimento e NÃO está pronto para produção.** Antes de usar em ambiente de produção, são necessários os seguintes aprimoramentos:

- [ ] Implementar tratamento robusto de erros
- [ ] Adicionar logs estruturados
- [ ] Configurar rate limiting para webhooks
- [ ] Implementar autenticação e autorização
- [ ] Adicionar testes unitários e de integração
- [ ] Configurar monitoramento e observabilidade
- [ ] Implementar reconexão automática em caso de falhas
- [ ] Adicionar validação de dados de entrada
- [ ] Configurar backup e recuperação do banco de dados
- [ ] Implementar segurança adicional (HTTPS, tokens seguros)

## 🛠️ Requisitos

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Chrome/Chromium** (para o Puppeteer)
- **Conta no Chatwoot** com API habilitada

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd zapnode
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Chatwoot
CHATWOOT_URL=https://app.chatwoot.com
CHATWOOT_ACCOUNT_ID=id_da_sua_conta
CHATWOOT_API_TOKEN=seu_token_aqui
CHATWOOT_INBOX_ID=id_da_caixa_de_entrada_criada

# Configurações do servidor
PORT=3000
```

### 4. Crie a pasta do banco de dados

```bash
mkdir db
```

## 🚀 Como Usar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

### Primeira execução

1. Execute o projeto
2. Escaneie o QR Code que aparecerá no terminal com o WhatsApp Web
3. Configure o webhook no Chatwoot apontando para: `http://seu-servidor:3000/webhook`

## 🏗️ Estrutura do Projeto

```text
zapnode.codigofonte.tv/
├── app/
│   ├── server.js      # Servidor principal
│   ├── whatsapp.js    # Integração com WhatsApp Web
│   └── webhook.js     # Endpoint para receber webhooks do Chatwoot
├── db/                # Banco de dados SQLite (criado automaticamente)
├── package.json       # Dependências e scripts
├── .env              # Variáveis de ambiente (criar)
└── README.md         # Este arquivo
```

## 🔧 Configuração do Chatwoot

1. Acesse as configurações da sua conta no Chatwoot
2. Vá para "Caixas de Entrada" > "Adicionar Caixa de Entrada"
3. Escolha "API"

- Nome do canal: `WhatsApp`
- URL do webhook: `http://seu-servidor:3000/webhook`

## 📝 Funcionalidades Atuais

- ✅ Conecta ao WhatsApp Web via puppeteer
- ✅ Recebe mensagens do WhatsApp e envia para o Chatwoot
- ✅ Recebe respostas do Chatwoot e envia para o WhatsApp
- ✅ Armazena contatos em banco SQLite
- ✅ Gera QR Code para autenticação

## 🐛 Problemas Conhecidos

- Autenticação do WhatsApp pode expirar e precisar ser refeita
- Sem tratamento de reconexão automática
- Logs limitados para debugging
- Falta validação de dados de entrada

---

**⚠️ Lembrete:** Este é um protótipo experimental. Use apenas para testes e desenvolvimento. Não recomendado para produção sem os devidos aprimoramentos de segurança e estabilidade.
