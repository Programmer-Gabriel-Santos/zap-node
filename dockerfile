# versão otimizada

FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive

# Instala Chromium + somente libs essenciais para headless
RUN apt-get update && apt-get install -y \
    chromium \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    libx11-xcb1 \
    wget \
    curl \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório da aplicação
WORKDIR /app

# Copiar apenas arquivos de dependência primeiro
COPY package.json yarn.lock ./

# Instalar dependências via Yarn
RUN yarn install

# Copiar o restante da aplicação
COPY . .

# Porta padrão da sua aplicação
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["yarn", "start"]



# versão anterior

# FROM node:20-slim

# # Variáveis de ambiente para evitar prompts
# ENV DEBIAN_FRONTEND=noninteractive

# # Instalar dependências do sistema + Chromium
# RUN apt-get update && apt-get install -y \
#     chromium \
#     fonts-liberation \
#     libasound2 \
#     libatk-bridge2.0-0 \
#     libatk1.0-0 \
#     libc6 \
#     libcairo2 \
#     libcups2 \
#     libdbus-1-3 \
#     libexpat1 \
#     libfontconfig1 \
#     libgbm1 \
#     libgcc1 \
#     libglib2.0-0 \
#     libgtk-3-0 \
#     libnspr4 \
#     libnss3 \
#     libpango-1.0-0 \
#     libx11-6 \
#     libxcomposite1 \
#     libxdamage1 \
#     libxext6 \
#     libxfixes3 \
#     libxrandr2 \
#     libxss1 \
#     libxtst6 \
#     wget \
#     curl \
#     gnupg \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Definir diretório da aplicação
# WORKDIR /app

# # Copiar os arquivos do projeto
# COPY package.json yarn.lock ./
# RUN yarn install

# COPY . .

# # Expor a porta da aplicação (ajuste se for diferente)
# EXPOSE 3000

# # Comando para iniciar a aplicação
# CMD ["yarn", "start"]
