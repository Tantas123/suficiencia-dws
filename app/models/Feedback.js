import Conexao from '../core/Conexao.js';

export default class Feedback extends Conexao {
  static TIPOS = ['bug', 'sugestão', 'reclamação', 'feedback'];
  static STATUS = ['recebido', 'em análise', 'em desenvolvimento', 'finalizado'];
  static STATUS_PADRAO = 'recebido';

  async listarTodos() {
    return this.query('SELECT id, titulo, descricao, tipo, status FROM feedbacks ORDER BY id DESC');
  }

  async buscarPorId(id) {
    const linhas = await this.query(
      'SELECT id, titulo, descricao, tipo, status FROM feedbacks WHERE id = ?',
      [id]
    );
    return linhas[0] || null;
  }

  async cadastrar(titulo, descricao, tipo) {
    const resultado = await this.query(
      'INSERT INTO feedbacks (titulo, descricao, tipo, status) VALUES (?, ?, ?, ?)',
      [titulo, descricao, tipo, Feedback.STATUS_PADRAO]
    );
    return resultado.insertId;
  }

  async atualizarStatus(id, status) {
    const resultado = await this.query('UPDATE feedbacks SET status = ? WHERE id = ?', [status, id]);
    return resultado.affectedRows > 0;
  }

  static tipoValido(tipo) {
    return Feedback.TIPOS.includes(tipo);
  }

  static statusValido(status) {
    return Feedback.STATUS.includes(status);
  }
}
