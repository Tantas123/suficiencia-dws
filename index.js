import http from 'node:http';

const PORT = Number(process.env.PORT) || 3000;

const servidor = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Sistema de Controle de Feedback - em construção');
});

servidor.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
