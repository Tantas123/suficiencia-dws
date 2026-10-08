import bodyParser from './bodyParser.js';

export default class Router {
  #rotas = [];

  get(caminho, acao) {
    return this.#adicionar('GET', caminho, acao);
  }

  post(caminho, acao) {
    return this.#adicionar('POST', caminho, acao);
  }

  #adicionar(metodo, caminho, acao) {
    const nomesParametros = [];
    const padrao = Router.#normalizar(caminho)
      .split('/')
      .map((segmento) => {
        const parametro = segmento.match(/^\{(\w+)\}$/);
        if (parametro) {
          nomesParametros.push(parametro[1]);
          return '([^/]+)';
        }
        return segmento.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');

    this.#rotas.push({
      metodo,
      regex: new RegExp(`^${padrao}$`),
      nomesParametros,
      acao,
    });
    return this;
  }

  static #normalizar(caminho) {
    const semBarra = caminho.replace(/\/+$/, '');
    return semBarra === '' ? '/' : semBarra;
  }

  static #responderTexto(res, statusCode, mensagem) {
    if (res.headersSent) {
      res.end();
      return;
    }
    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>${statusCode}</title></head>` +
        `<body style="font-family:sans-serif;margin:2rem"><h1>${statusCode}</h1><p>${mensagem}</p>` +
        `<p><a href="/">Voltar ao início</a></p></body></html>`
    );
  }

  async resolver(req, res) {
    try {
      const url = new URL(req.url, 'http://localhost');
      const caminho = Router.#normalizar(decodeURIComponent(url.pathname));
      let metodo = req.method.toUpperCase();

      let corpo = {};
      if (metodo === 'POST' || metodo === 'PUT' || metodo === 'DELETE') {
        corpo = await bodyParser(req);
      }

      const metodoBusca = metodo === 'HEAD' ? 'GET' : metodo;
      let caminhoExiste = false;

      for (const rota of this.#rotas) {
        const correspondencia = caminho.match(rota.regex);
        if (!correspondencia) continue;
        caminhoExiste = true;
        if (rota.metodo !== metodoBusca) continue;

        const parametros = rota.nomesParametros.map((_, i) => correspondencia[i + 1]);
        const [ClasseController, nomeMetodo] = rota.acao;
        const controller = new ClasseController(req, res, {
          corpo,
          query: Object.fromEntries(url.searchParams),
        });
        await controller[nomeMetodo](...parametros);
        return;
      }

      if (caminhoExiste) {
        Router.#responderTexto(res, 405, 'Método não permitido.');
      } else {
        Router.#responderTexto(res, 404, 'Página não encontrada.');
      }
    } catch (erro) {
      console.error('[ERRO]', req.method, req.url, erro);
      Router.#responderTexto(res, 500, 'Erro interno do servidor. Tente novamente mais tarde.');
    }
  }
}
