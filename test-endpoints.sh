#!/bin/bash

# Script para testar os endpoints do WhatsApp Webhook
# Uso: ./test-endpoints.sh [URL_BASE]
# Exemplo: ./test-endpoints.sh http://localhost:3000

BASE_URL=${1:-"http://localhost:3000"}

echo "=== Testando Endpoints do WhatsApp Webhook ==="
echo "URL Base: $BASE_URL"
echo ""

# Teste 1: Status da aplicação
echo "1. Testando endpoint principal..."
curl -s "$BASE_URL/" || echo "Erro ao acessar endpoint principal"
echo ""
echo ""

# Teste 2: Status da conexão
echo "2. Verificando status da conexão..."
curl -s "$BASE_URL/status" | jq . 2>/dev/null || curl -s "$BASE_URL/status"
echo ""
echo ""

# Teste 3: QR Code (se disponível)
echo "3. Verificando QR Code..."
QR_RESPONSE=$(curl -s "$BASE_URL/qr/json")
echo "$QR_RESPONSE" | jq . 2>/dev/null || echo "$QR_RESPONSE"
echo ""
echo ""

# Teste 4: Instruções
echo "=== Instruções ==="
echo "Para visualizar o QR code no navegador, acesse:"
echo "$BASE_URL/qr"
echo ""
echo "Para verificar o status da conexão:"
echo "curl $BASE_URL/status"
echo ""
echo "Para obter o QR code em JSON:"
echo "curl $BASE_URL/qr/json" 