export function escapeHtml(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function layout(titulo, conteudo) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(titulo)} - Controle de Feedback</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1rem; color: #222; }
    h1 { font-size: 1.6rem; }
    label { display: block; margin-top: 1rem; font-weight: bold; }
    input[type=text], input[type=password], textarea, select { width: 100%; padding: .5rem; box-sizing: border-box; font: inherit; }
    textarea { min-height: 120px; }
    button { margin-top: 1rem; padding: .5rem 1.2rem; font: inherit; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: .5rem; text-align: left; }
    th { background: #f0f0f0; }
    .sucesso { background: #e3f6e3; border: 1px solid #7bc47b; padding: .75rem; }
    .erro { background: #fbe4e4; border: 1px solid #e08a8a; padding: .75rem; }
    .topo { display: flex; justify-content: space-between; align-items: center; }
    .pre { white-space: pre-wrap; }
  </style>
</head>
<body>
${conteudo}
</body>
</html>`;
}

export function paginaErro(titulo, mensagem, linkVoltar = '/') {
  return layout(
    titulo,
    `<h1>${escapeHtml(titulo)}</h1>
<p>${escapeHtml(mensagem)}</p>
<p><a href="${escapeHtml(linkVoltar)}">Voltar</a></p>`
  );
}
