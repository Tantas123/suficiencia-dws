import layout, { escapeHtml } from './layout.js';

export default function loginView({ erro = '', usuario = '' }) {
  return layout(
    'Login',
    `<h1>Login - Área administrativa</h1>
${erro ? `<p class="erro">${escapeHtml(erro)}</p>` : ''}
<form method="POST" action="/login">
  <label for="usuario">Usuário</label>
  <input type="text" id="usuario" name="usuario" required value="${escapeHtml(usuario)}">

  <label for="senha">Senha</label>
  <input type="password" id="senha" name="senha" required>

  <button type="submit">Entrar</button>
</form>
<p><a href="/">Voltar ao formulário de feedback</a></p>`
  );
}
