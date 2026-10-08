import http from 'node:http';
import router from './rotas.js';
import Conexao from './app/core/Conexao.js';

const PORT = Number(process.env.PORT) || 3000;

const servidor = http.createServer((req, res) => {
  router.resolver(req, res);
});

servidor.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

process.on('unhandledRejection', (erro) => {
  console.error('[unhandledRejection]', erro);
});

const encerrar = async () => {
  servidor.close();
  await Conexao.encerrar().catch(() => {});
  process.exit(0);
};
process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
