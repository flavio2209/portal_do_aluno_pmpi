
# EduConnect - Portal i-Educar & i-Diário

Portal moderno e responsivo para pais e alunos acompanharem a vida acadêmica. Integrado com as APIs do ecossistema i-Educar.

## 🚀 Requisitos do Sistema

- **S.O.**: Ubuntu 22.04 LTS ou superior.
- **Node.js**: v20.x (LTS).
- **Banco de Dados**: MySQL 8.0+ ou PostgreSQL 14+.
- **Servidor Web**: Nginx (Recomendado).

## 🛠️ 1. Preparação do Ambiente (Ubuntu)

Se você recebeu erros de `SyntaxError` ou tela em branco, atualize o Node.js:

```bash
# Remover versões antigas
sudo apt-get remove -y nodejs npm
# Instalar Node v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 📂 2. Instalação da Aplicação

```bash
cd /var/www/educonnect
npm install
npm run build
```

## ⚙️ 3. Configuração do Servidor Web (Nginx)

Crie o arquivo de configuração:
`sudo nano /etc/nginx/sites-available/educonnect`

Cole o conteúdo abaixo (ajustando seu domínio):

```nginx
server {
    listen 80;
    server_name seu-portal.com;

    location / {
        root /var/www/educonnect/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API (caso utilize backend separado no futuro)
    # location /api {
    #     proxy_pass http://localhost:3000;
    # }
}
```

Ative o site e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/educonnect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔄 4. Manter o App Rodando (PM2)

Para garantir que o portal não caia após fechar o terminal:

```bash
sudo npm install -g pm2
pm2 start npm --name "educonnect" -- run dev
pm2 save
pm2 startup
```

## 🪄 5. Assistente de Instalação (Wizard)

Ao acessar o portal pela primeira vez, o wizard será iniciado.
- **Configuração**: Insira os dados do seu MySQL/Postgres.
- **SQL**: O sistema tentará executar o `setup.sql` automaticamente.
- **Importante**: Se a página ficar branca, limpe o cache do navegador ou execute `localStorage.clear()` no console (F12).

## 🔑 Acessos Padrão (Teste)

- **Administrador**: `admin@escola.com` / `admin123`
- **Aluno**: `aluno@escola.com` / `aluno123`

## 📡 Integração i-Educar

1. Acesse o Painel Admin do EduConnect.
2. Vá em **Integração**.
3. Configure a URL da sua instância i-Educar (ex: `https://ieducar.suaprefeitura.gov.br/api`).
4. Clique em **Sincronizar** para importar alunos e notas.

---
Distribuído sob a licença MIT. Livre para uso governamental e privado.
