

# Dockerfile
FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Instala dependências antes de copiar o resto
COPY package.json yarn.lock ./
RUN yarn install

# Copia o restante da aplicação
COPY . .

# Cria os diretórios necessários e define permissões
# USER root
# RUN mkdir -p /app/.wwebjs_auth /app/.wwebjs_cache \
#     && chown -R pptruser:pptruser /app/.wwebjs_auth /app/.wwebjs_cache \
#     && chmod -R 755 /app/.wwebjs_auth /app/.wwebjs_cache

# Volta para o usuário pptruser
# USER pptruser

# Expõe porta da aplicação
EXPOSE 3000

# Usa o entrypoint que corrige permissões e inicia app
CMD ["yarn", "start"]



##### ---------------------------------

# # Imagem base do Chrome + Puppeteer com usuário não-root já configurado
# FROM ghcr.io/puppeteer/puppeteer:latest

# USER root
# WORKDIR /app

# # Cria os diretórios (usados apenas se não houver volume montado)
# RUN mkdir -p /app/.wwebjs_auth/session /app/.wwebjs_cache \
#     && chown -R pptruser:pptruser /app/.wwebjs_auth /app/.wwebjs_cache

# # Copia os arquivos da aplicação
# COPY --chown=pptruser:pptruser . .

# RUN yarn install

# # Cria o entrypoint diretamente via Dockerfile
# RUN echo '#!/bin/bash\n\
# chown -R pptruser:pptruser /app/.wwebjs_auth /app/.wwebjs_cache\n\
# exec gosu pptruser yarn start' > /app/entrypoint.sh \
#     && chmod +x /app/entrypoint.sh

# # Expõe a porta da aplicação
# EXPOSE 3000

# # Usa o novo entrypoint
# CMD ["/app/entrypoint.sh"]





##### -----------------------------------------------------------

# FROM ghcr.io/puppeteer/puppeteer:latest

# WORKDIR /app

# COPY package*.json ./

# ENV PUPPETEER_PRODUCT=chrome
# ENV PUPPETEER_SKIP_DOWNLOAD=false

# # Instala dependências da aplicação
# RUN yarn install

# # Copia o restante da aplicação
# COPY . .

# # Cria as pastas necessárias e define permissões
# USER root
# RUN mkdir -p /app/wwebjs_auth/session /app/wwebjs_cache \
#  && chown -R pptruser:pptruser /app/wwebjs_auth /app/wwebjs_cache

# USER pptruser

# CMD ["node", "index.js"]



##### -------------------------

# versão otimizada

# FROM node:20-slim

# ENV DEBIAN_FRONTEND=noninteractive

# # Instala Chromium + somente libs essenciais para headless
# #//

# RUN apt-get update && apt-get install -y \
#   chromium \
#   fonts-liberation \
#   libasound2 \
#   libatk-bridge2.0-0 \
#   libatk1.0-0 \
#   libc6 \
#   libcairo2 \
#   libcups2 \
#   libdbus-1-3 \
#   libexpat1 \
#   libfontconfig1 \
#   libgbm1 \
#   libgcc1 \
#   libglib2.0-0 \
#   libgtk-3-0 \
#   libnspr4 \
#   libnss3 \
#   libpango-1.0-0 \
#   libx11-6 \
#   libxcomposite1 \
#   libxdamage1 \
#   libxext6 \
#   libxfixes3 \
#   libxrandr2 \
#   libxss1 \
#   libxtst6 \
#   wget \
#   curl \
#   gnupg \
#   && apt-get clean && rm -rf /var/lib/apt/lists/*

# # Definir diretório da aplicação
# WORKDIR /app

# # Copiar apenas arquivos de dependência primeiro
# COPY package.json yarn.lock ./

# # Instalar dependências via Yarn
# RUN yarn install

# # Copiar o restante da aplicação
# COPY . .

# # Porta padrão da sua aplicação
# EXPOSE 3000

# # Comando para rodar a aplicação
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
