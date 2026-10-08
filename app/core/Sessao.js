import { randomUUID } from 'node:crypto';

export default class Sessao {
  static #sessoes = new Map();
  static NOME_COOKIE = 'sid';

  static #lerCookies(req) {
    const cookies = {};
    const cabecalho = req.headers.cookie || '';
    for (const par of cabecalho.split(';')) {
      const indice = par.indexOf('=');
      if (indice === -1) continue;
      const nome = par.slice(0, indice).trim();
      const valor = par.slice(indice + 1).trim();
      try {
        cookies[nome] = decodeURIComponent(valor);
      } catch {
        cookies[nome] = valor;
      }
    }
    return cookies;
  }

  static #obterId(req) {
    return Sessao.#lerCookies(req)[Sessao.NOME_COOKIE] || null;
  }

  static criar(res, usuario) {
    const id = randomUUID();
    Sessao.#sessoes.set(id, { usuario, criadaEm: Date.now() });
    res.setHeader('Set-Cookie', `${Sessao.NOME_COOKIE}=${id}; HttpOnly; Path=/; SameSite=Lax`);
    return id;
  }

  static obter(req) {
    const id = Sessao.#obterId(req);
    return id ? Sessao.#sessoes.get(id) || null : null;
  }

  static estaLogado(req) {
    return Sessao.obter(req) !== null;
  }

  static destruir(req, res) {
    const id = Sessao.#obterId(req);
    if (id) Sessao.#sessoes.delete(id);
    res.setHeader(
      'Set-Cookie',
      `${Sessao.NOME_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );
  }
}
