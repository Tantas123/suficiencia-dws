import layout, { escapeHtml } from './layout.js';

export default function feedbacksShowView({ feedback }) {
  return layout(
    `Feedback #${feedback.id}`,
    `<div class="topo"><h1>Feedback #${escapeHtml(feedback.id)}</h1></div>
<p><a href="/feedbacks">&larr; Voltar para a lista de feedbacks</a></p>
<table>
  <tr><th>ID</th><td>${escapeHtml(feedback.id)}</td></tr>
  <tr><th>Título</th><td>${escapeHtml(feedback.titulo)}</td></tr>
  <tr><th>Descrição</th><td class="pre">${escapeHtml(feedback.descricao)}</td></tr>
  <tr><th>Tipo</th><td>${escapeHtml(feedback.tipo)}</td></tr>
  <tr><th>Status</th><td>${escapeHtml(feedback.status)}</td></tr>
</table>`
  );
}
