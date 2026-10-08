import layout, { escapeHtml } from './layout.js';

export default function feedbacksView({ feedbacks = [] }) {
  const linhas = feedbacks.length
    ? feedbacks
        .map(
          (f) => `<tr>
      <td>${escapeHtml(f.id)}</td>
      <td>${escapeHtml(f.titulo)}</td>
      <td>${escapeHtml(f.tipo)}</td>
      <td>${escapeHtml(f.status)}</td>
      <td><a href="/feedbacks/${encodeURIComponent(f.id)}">Detalhes</a></td>
    </tr>`
        )
        .join('\n')
    : '<tr><td colspan="5">Nenhum feedback cadastrado.</td></tr>';

  return layout(
    'Feedbacks',
    `<div class="topo"><h1>Feedbacks</h1></div>
<table>
  <thead>
    <tr><th>ID</th><th>Título</th><th>Tipo</th><th>Status</th><th></th></tr>
  </thead>
  <tbody>
    ${linhas}
  </tbody>
</table>`
  );
}
