import Controller from './Controller.js';
import Sessao from '../core/Sessao.js';
import loginView from '../views/login_view.js';

export default class AuthController extends Controller {
  static #USUARIO = 'admin';
  static #SENHA = '123456';

  async form() {
    if (Sessao.estaLogado(this.req)) {
      this.redirect(this.res, '/feedbacks');
      return;
    }
    this.render(this.res, loginView({}));
  }

  async login() {
    const usuario = String(this.corpo.usuario ?? '').trim();
    const senha = String(this.corpo.senha ?? '');

    if (usuario === AuthController.#USUARIO && senha === AuthController.#SENHA) {
      Sessao.criar(this.res, usuario);
      this.redirect(this.res, '/feedbacks');
      return;
    }

    this.render(this.res, loginView({ erro: 'Usuário ou senha inválidos.', usuario }), 401);
  }

  async logout() {
    Sessao.destruir(this.req, this.res);
    this.redirect(this.res, '/login');
  }
}
