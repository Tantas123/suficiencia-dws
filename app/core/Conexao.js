import mysql from 'mysql2/promise';

export default class Conexao {
  static #pool = null;

  static #criarPool() {
    if (!Conexao.#pool) {
      Conexao.#pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'controle_feedback',
        charset: 'utf8mb4',
        waitForConnections: true,
        connectionLimit: 10,
      });
    }
    return Conexao.#pool;
  }

  getConexao() {
    return Conexao.#criarPool();
  }

  async query(sql, params = []) {
    const [resultado] = await this.getConexao().execute(sql, params);
    return resultado;
  }

  static async encerrar() {
    if (Conexao.#pool) {
      await Conexao.#pool.end();
      Conexao.#pool = null;
    }
  }
}
