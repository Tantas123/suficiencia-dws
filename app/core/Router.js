import bodyParser from './bodyParser.js';
import Sessao from './Sessao.js';

export default class Router {
  #rotas = [];

  get(caminho, acao, opcoes = {}) {
    return this.#adicionar('GET', caminho, acao, opcoes);
  }

  post(caminho, acao, opcoes = {}) {
    return this.#adicionar('POST', caminho, acao, opcoes);
  }

  put(caminho, acao, opcoes = {}) {
    return this.#adicionar('PUT', caminho, acao, opcoes);
  }

  delete(caminho, acao, opcoes = {}) {
    return this.#adicionar('DELETE', caminho, acao, opcoes);
  }

  #adicionar(metodo, caminho, acao, opcoes) {
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
      protegida: Boolean(opcoes.protegida),
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
        if (metodo === 'POST' && corpo._method) {
          const metodoReal = String(corpo._method).toUpperCase();
          if (['PUT', 'DELETE', 'PATCH'].includes(metodoReal)) metodo = metodoReal;
        }
      }

      const metodoBusca = metodo === 'HEAD' ? 'GET' : metodo;
      let caminhoExiste = false;

      for (const rota of this.#rotas) {
        const correspondencia = caminho.match(rota.regex);
        if (!correspondencia) continue;
        caminhoExiste = true;
        if (rota.metodo !== metodoBusca) continue;

        if (rota.protegida && !Sessao.estaLogado(req)) {
          res.writeHead(302, { Location: '/login' });
          res.end();
          return;
        }

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
