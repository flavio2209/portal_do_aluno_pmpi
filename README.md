
# EduConnect - Portal i-Educar & i-Diário

Portal moderno e responsivo para pais e alunos acompanharem a vida acadêmica. Integrado com as APIs do ecossistema i-Educar.

## 🚀 Requisitos do Sistema

- **Sistema Operacional**: Ubuntu 22.04 LTS ou superior.
- **Node.js**: v20.x (LTS) - *Obrigatório*.
- **Banco de Dados**: MySQL 8.0+ ou PostgreSQL 14+.
- **Servidor Web**: Nginx ou Apache (para servir o build).

## 🛠️ Instalação Passo a Passo

### 1. Atualizar o Ambiente (Correção de SyntaxError)

Se você recebeu erros de `Unexpected reserved word`, sua versão do Node está obsoleta. Execute:

```bash
sudo apt-get remove -y nodejs npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Clonar e Instalar Dependências

```bash
cd /var/www/educonnect
npm install
```

### 3. Preparar o Banco de Dados

Crie um banco de dados vazio no seu MySQL ou Postgres:

```sql
CREATE DATABASE educonnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Build e Execução

Para ambiente de desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm run build
```

## 🪄 Assistente de Instalação (Wizard)

Ao acessar o portal pela primeira vez através do navegador, o **EduConnect Installation Wizard** será iniciado automaticamente.

1.  **Seleção de Banco**: Escolha entre MySQL ou PostgreSQL.
2.  **Credenciais**: Insira Host, Porta, Usuário e Senha.
3.  **Execução**: O sistema executará o arquivo `setup.sql` automaticamente para criar a estrutura.
4.  **Finalização**: O portal criará o estado de "Instalado" e redirecionará para a tela de login.

## 🔑 Acessos Padrão (Ambiente de Teste)

- **Administrador**: `admin@escola.com` / `admin123`
- **Aluno**: `aluno@escola.com` / `aluno123`

## 📡 Integração i-Educar

Para configurar a sincronização em tempo real:
1. Acesse o Painel Admin.
2. Vá na aba **Integração**.
3. Insira a URL da API do seu Core i-Educar e o Token JWT gerado no servidor.
4. Clique em "Sincronizar Agora".

## 📄 Licença

Distribuído sob a licença MIT. Livre para uso governamental e privado.
