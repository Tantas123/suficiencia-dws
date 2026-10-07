# Sistema para Controle de Feedback com o Usuário

Sistema web em Node.js (sem frameworks) para coletar feedbacks de usuários e gerenciá-los em uma área administrativa.

## Como rodar

```bash
npm install
cp .env.example .env
mysql -u root -p < database/schema.sql
npm start
```

Acesse http://localhost:3000.
