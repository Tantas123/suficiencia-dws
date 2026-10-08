import Controller from './Controller.js';
import Feedback from '../models/Feedback.js';
import formularioView from '../views/formulario_view.js';
import feedbacksView from '../views/feedbacks_view.js';
import feedbacksShowView from '../views/feedbacks_show_view.js';
import { paginaErro } from '../views/layout.js';

export default class FeedbackController extends Controller {
  static #idValido(id) {
    return /^\d+$/.test(String(id ?? '')) && Number(id) > 0 ? Number(id) : null;
  }

  async create() {
    const html = formularioView({
      tipos: Feedback.TIPOS,
      sucesso: this.query.sucesso === '1',
    });
    this.render(this.res, html);
  }

  async index() {
    const feedbacks = await new Feedback().listarTodos();
    this.render(this.res, feedbacksView({ feedbacks }));
  }

  async show(id) {
    const idNumerico = FeedbackController.#idValido(id);
    const feedback = idNumerico ? await new Feedback().buscarPorId(idNumerico) : null;

    if (!feedback) {
      this.render(this.res, paginaErro('Feedback não encontrado', 'O feedback solicitado não existe.', '/feedbacks'), 404);
      return;
    }

    this.render(
      this.res,
      feedbacksShowView({ feedback })
    );
  }

  async store() {
    const titulo = String(this.corpo.titulo ?? '').trim();
    const descricao = String(this.corpo.descricao ?? '').trim();
    const tipo = String(this.corpo.tipo ?? '').trim();

    const erros = [];
    if (!titulo) erros.push('Informe o título.');
    if (titulo.length > 255) erros.push('O título deve ter no máximo 255 caracteres.');
    if (!descricao) erros.push('Informe a descrição.');
    if (!Feedback.tipoValido(tipo)) erros.push('Selecione um tipo válido.');

    if (erros.length > 0) {
      const html = formularioView({
        tipos: Feedback.TIPOS,
        erros,
        valores: { titulo, descricao, tipo },
      });
      this.render(this.res, html, 400);
      return;
    }

    const feedback = new Feedback();
    await feedback.cadastrar(titulo, descricao, tipo);
    this.redirect(this.res, '/?sucesso=1');
  }
}
