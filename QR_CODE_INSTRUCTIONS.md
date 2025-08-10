# Instruções para QR Code - WhatsApp Webhook

## Problema Resolvido

O problema original era que o QR code não aparecia nos logs do container Docker. A solução implementada permite acessar o QR code via endpoints HTTP.

## Novos Endpoints Disponíveis

### 1. `/qr` - Visualizar QR Code no Navegador
- **URL**: `http://seu-servidor:3000/qr`
- **Método**: GET
- **Descrição**: Exibe uma página HTML com o QR code para escaneamento
- **Uso**: Acesse diretamente no navegador para escanear o QR code

### 2. `/qr/json` - QR Code em Formato JSON
- **URL**: `http://seu-servidor:3000/qr/json`
- **Método**: GET
- **Descrição**: Retorna o QR code como base64 em formato JSON
- **Resposta de sucesso**:
```json
{
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "status": "ready"
}
```
- **Resposta quando não há QR**:
```json
{
  "error": "Nenhum QR code gerado ainda.",
  "status": "waiting"
}
```

### 3. `/status` - Status da Conexão
- **URL**: `http://seu-servidor:3000/status`
- **Método**: GET
- **Descrição**: Verifica o status atual da conexão do WhatsApp
- **Possíveis status**:
  - `initializing`: Client sendo inicializado
  - `qr_ready`: QR code disponível
  - `connected`: WhatsApp conectado
  - `connecting`: Tentando conectar

## Como Usar

### Opção 1: Acesso Direto via Navegador
1. Inicie o container Docker
2. Acesse `http://seu-servidor:3000/qr` no navegador
3. Escaneie o QR code com o WhatsApp

### Opção 2: Verificar Status via API
```bash
# Verificar se há QR code disponível
curl http://seu-servidor:3000/status

# Obter QR code em JSON
curl http://seu-servidor:3000/qr/json
```

### Opção 3: Integração com Outras Aplicações
```javascript
// Exemplo de como usar o endpoint JSON
fetch('http://seu-servidor:3000/qr/json')
  .then(response => response.json())
  .then(data => {
    if (data.status === 'ready') {
      // Exibir QR code usando data.qr
      const img = document.createElement('img');
      img.src = data.qr;
      document.body.appendChild(img);
    }
  });
```

## Fluxo de Funcionamento

1. **Inicialização**: O WhatsApp client é iniciado
2. **QR Code Gerado**: Quando necessário, um QR code é gerado e armazenado
3. **Acesso via Endpoint**: O QR code pode ser acessado via `/qr` ou `/qr/json`
4. **Escaneamento**: Usuário escaneia o QR code com o WhatsApp
5. **Conexão**: Após escaneamento bem-sucedido, o client se conecta
6. **QR Limpo**: O QR code é removido da memória após conexão

## Observações Importantes

- O QR code é armazenado apenas em memória
- Após a conexão ser estabelecida, o QR code é automaticamente limpo
- Se a conexão for perdida, um novo QR code será gerado automaticamente
- Os endpoints funcionam tanto em ambiente local quanto em containers Docker 