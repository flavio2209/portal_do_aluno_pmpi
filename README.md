
# EduConnect - Portal i-Educar & i-Diário

## 🚀 Requisitos
- Node.js v20+
- MySQL ou PostgreSQL

## 🛠️ Instalação
1. `npm install`
2. `npm run dev`

## 🆘 Problemas Comuns: Tela em Branco
Se a página inicial não aparecer:
1. **Console do Navegador**: Aperte `F12` e veja se há erros de importação (geralmente causados por versões antigas do navegador ou cache).
2. **Limpar LocalStorage**: No console, digite `localStorage.clear()` e recarregue. Isso forçará o reaparecimento do instalador.
3. **Versão do Node**: Verifique se `node -v` retorna v20 ou superior. Versões v12/v14 do Ubuntu antigo causam erro de sintaxe nos novos pacotes do React 19.

## 🗄️ Banco de Dados
O arquivo `setup.sql` contém o esquema universal. Durante a instalação via interface, o sistema simula a conexão e preparação deste esquema.
