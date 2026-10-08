import layout, { escapeHtml } from './layout.js';

export default function feedbacksShowView({ feedback, statusDisponiveis = [], atualizado = false, erro = '' }) {
  const opcoes = statusDisponiveis
    .map(
      (status) =>
        `<option value="${escapeHtml(status)}"${feedback.status === status ? ' selected' : ''}>${escapeHtml(status)}</option>`
    )
    .join('');

  return layout(
    `Feedback #${feedback.id}`,
    `<div class="topo"><h1>Feedback #${escapeHtml(feedback.id)}</h1></div>
<p><a href="/feedbacks">&larr; Voltar para a lista de feedbacks</a></p>
${atualizado ? '<p class="sucesso">Status atualizado com sucesso.</p>' : ''}
${erro ? `<p class="erro">${escapeHtml(erro)}</p>` : ''}
<table>
  <tr><th>ID</th><td>${escapeHtml(feedback.id)}</td></tr>
  <tr><th>Título</th><td>${escapeHtml(feedback.titulo)}</td></tr>
  <tr><th>Descrição</th><td class="pre">${escapeHtml(feedback.descricao)}</td></tr>
  <tr><th>Tipo</th><td>${escapeHtml(feedback.tipo)}</td></tr>
  <tr><th>Status</th><td>${escapeHtml(feedback.status)}</td></tr>
</table>

<form method="POST" action="/feedback/atualizar">
  <input type="hidden" name="_method" value="PUT">
  <input type="hidden" name="id" value="${escapeHtml(feedback.id)}">
  <label for="status">Status</label>
  <select id="status" name="status">
    ${opcoes}
  </select>
  <button type="submit">Atualizar Status</button>
</form>`
  );
}
