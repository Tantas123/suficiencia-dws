import layout, { escapeHtml } from './layout.js';

export default function formularioView({ tipos = [], sucesso = false, erros = [], valores = {} }) {
  const mensagens = [];
  if (sucesso) {
    mensagens.push('<p class="sucesso">Feedback enviado com sucesso! Obrigado pela sua contribuição.</p>');
  }
  if (erros.length > 0) {
    mensagens.push(
      `<div class="erro"><strong>Não foi possível enviar o feedback:</strong><ul>${erros
        .map((erro) => `<li>${escapeHtml(erro)}</li>`)
        .join('')}</ul></div>`
    );
  }

  const opcoes = tipos
    .map(
      (tipo) =>
        `<option value="${escapeHtml(tipo)}"${valores.tipo === tipo ? ' selected' : ''}>${escapeHtml(tipo)}</option>`
    )
    .join('');

  return layout(
    'Novo feedback',
    `<div class="topo"><h1>Envie seu feedback</h1><a href="/login">Área administrativa</a></div>
${mensagens.join('\n')}
<form method="POST" action="/feedback/cadastrar">
  <label for="titulo">Título</label>
  <input type="text" id="titulo" name="titulo" maxlength="255" required value="${escapeHtml(valores.titulo)}">

  <label for="descricao">Descrição</label>
  <textarea id="descricao" name="descricao" required>${escapeHtml(valores.descricao)}</textarea>

  <label for="tipo">Tipo</label>
  <select id="tipo" name="tipo" required>
    <option value="">Selecione...</option>
    ${opcoes}
  </select>

  <button type="submit">Enviar</button>
</form>`
  );
}
