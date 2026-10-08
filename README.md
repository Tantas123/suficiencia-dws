# Sistema para Controle de Feedback com o Usuário

Aplicação web em **Node.js puro** (sem frameworks) para coletar feedbacks de usuários (bugs, sugestões, reclamações e feedbacks gerais) por meio de um formulário público, com uma área administrativa protegida por login para listar os feedbacks, ver detalhes e alterar o status.

## Arquitetura

- **Servidor HTTP:** módulo nativo `node:http`, sem Express ou qualquer outro framework.
- **Padrão MVC:**
  - `app/models/` — Model `Feedback`, que **herda** da classe `Conexao` (`class Feedback extends Conexao`).
  - `app/views/` — cada view é uma função JavaScript que recebe dados e devolve HTML (template literals). Toda saída dinâmica passa por `escapeHtml()`.
  - `app/controllers/` — `Controller` (classe base com `render` e `redirect`), `FeedbackController` e `AuthController`.
- **Núcleo próprio (`app/core/`):**
  - `Conexao.js` — cria e reaproveita (propriedade estática) um pool `mysql2/promise` com `charset: 'utf8mb4'`; expõe `getConexao()` e `query(sql, params)` aos filhos. Todas as queries são parametrizadas (`?`).
  - `Router.js` — roteador próprio com URLs amigáveis e parâmetros dinâmicos (`/feedbacks/{idFeedback}`), rotas protegidas, *method spoofing*, respostas 404/405 e tratamento de erros (500 sem derrubar o servidor).
  - `bodyParser.js` — lê o corpo `application/x-www-form-urlencoded` com `URLSearchParams`.
  - `Sessao.js` — sessões em memória (`Map`) identificadas pelo cookie `sid` (`HttpOnly; Path=/; SameSite=Lax`).
- **Rotas:** todas definidas em `rotas.js`, que é importado pelo arquivo principal `index.js`.
- **Única dependência:** `mysql2` (driver de banco de dados).

```
├── app/
│   ├── controllers/  Controller.js, FeedbackController.js, AuthController.js
│   ├── core/         Conexao.js, Router.js, Sessao.js, bodyParser.js
│   ├── models/       Feedback.js
│   └── views/        layout.js, formulario_view.js, feedbacks_view.js,
│                     feedbacks_show_view.js, login_view.js
├── database/schema.sql
├── index.js          servidor HTTP (importa rotas.js)
├── rotas.js          definição de todas as rotas
├── .env.example
└── package.json
```

## Pré-requisitos

- **Node.js 22 ou superior** (usa a flag nativa `--env-file`)
- **npm**
- **MySQL 8+** ou **MariaDB 10.5+**

## Instalação e configuração

1. **Instalar as dependências**

   ```bash
   npm install
   ```

2. **Configurar o ambiente** — copie o arquivo de exemplo e ajuste as credenciais do banco:

   ```bash
   cp .env.example .env
   ```

   No Windows (PowerShell): `Copy-Item .env.example .env`

   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=controle_feedback
   ```

3. **Criar o banco de dados** executando o script `database/schema.sql`:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

   Ou copie e execute o esquema abaixo em um cliente MySQL (Workbench, phpMyAdmin, HeidiSQL etc.):

   ```sql
   SET NAMES utf8mb4;

   CREATE DATABASE IF NOT EXISTS controle_feedback
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   USE controle_feedback;

   CREATE TABLE IF NOT EXISTS feedbacks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     titulo VARCHAR(255) NOT NULL,
     descricao TEXT NOT NULL,
     tipo ENUM('bug','sugestão','reclamação','feedback') NOT NULL,
     status ENUM('recebido','em análise','em desenvolvimento','finalizado') NOT NULL DEFAULT 'recebido'
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

4. **Iniciar o servidor**

   ```bash
   npm start
   ```

   (ou `npm run dev` para reiniciar automaticamente ao alterar arquivos)

5. Acesse **http://localhost:3000**.

## Credenciais de acesso

| Usuário | Senha    |
|---------|----------|
| `admin` | `123456` |

## Rotas

| Método | Rota                      | Ação                                    | Acesso    |
|--------|---------------------------|-----------------------------------------|-----------|
| GET    | `/`                       | `FeedbackController.create` — formulário de novo feedback | Pública |
| POST   | `/feedback/cadastrar`     | `FeedbackController.store`              | Pública (ação do formulário) |
| GET    | `/feedbacks`              | `FeedbackController.index`              | Protegida |
| GET    | `/feedbacks/{idFeedback}` | `FeedbackController.show(id)`           | Protegida |
| PUT    | `/feedback/atualizar`     | `FeedbackController.update(id, status)` | Protegida |
| GET    | `/login`                  | `AuthController.form` — formulário de login | Pública |
| POST   | `/login`                  | `AuthController.login`                  | Pública |
| GET    | `/logout`                 | `AuthController.logout`                 | —         |

Usuários não logados que acessam uma rota protegida são redirecionados (302) para `/login`. Rotas inexistentes retornam **404** e métodos não permitidos retornam **405**.

## Decisões tomadas

- **Method spoofing para PUT:** formulários HTML só enviam GET e POST. O formulário de atualização envia `POST` com o campo oculto `_method=PUT`; o `Router` lê o corpo e passa a tratar a requisição como `PUT`.
- **`/feedback/cadastrar` acessível sem login:** o enunciado indica `/` como única rota pública, porém o formulário público precisa enviar os dados para `/feedback/cadastrar`. Por isso essa rota também é pública. Após cadastrar, o usuário é redirecionado para `/?sucesso=1`, que exibe uma mensagem de sucesso.
- **Status sempre `recebido` no cadastro:** o formulário público não possui campo de status e qualquer `status` enviado na requisição é ignorado.
- **`update(id, status)`:** o `id` e o `status` vêm do corpo do formulário (campos `id` e `status`); a assinatura do método mantém esses parâmetros com valores padrão lidos da requisição. Após atualizar, redireciona para `/feedbacks/{id}` com uma mensagem de confirmação.
- **Sessões em memória:** as sessões ficam em um `Map` no processo do servidor, portanto **são perdidas quando o servidor é reiniciado** (basta fazer login novamente).
- **Credencial fixa:** por simplicidade, há um único usuário (`admin` / `123456`) definido no `AuthController`, sem tabela de usuários.
- **Tratamento de erros:** a execução de cada rota é envolvida em `try/catch`; erros (ex.: banco indisponível) são registrados no console e o usuário recebe uma página **500** simples, sem derrubar o servidor.
- **Segurança básica:** queries parametrizadas em todo acesso ao banco e escape de toda saída HTML (`escapeHtml`).

## Funcionalidades não desenvolvidas

Todas as funcionalidades obrigatórias do enunciado foram implementadas. Itens que ficaram fora do escopo, por não serem exigidos:

- Cadastro/gerenciamento de usuários administradores (há apenas a credencial fixa).
- Persistência das sessões (são mantidas apenas em memória).
- Proteção CSRF nos formulários.
- Paginação, filtros e busca na listagem de feedbacks.
- Exclusão de feedbacks.
