const LIMITE_BYTES = 1024 * 1024;

export default function bodyParser(req) {
  return new Promise((resolve, reject) => {
    let corpo = '';
    let tamanho = 0;

    req.setEncoding('utf8');
    req.on('data', (parte) => {
      tamanho += Buffer.byteLength(parte);
      if (tamanho > LIMITE_BYTES) {
        reject(new Error('Corpo da requisição muito grande'));
        req.destroy();
        return;
      }
      corpo += parte;
    });
    req.on('end', () => {
      const dados = {};
      for (const [chave, valor] of new URLSearchParams(corpo)) {
        dados[chave] = valor;
      }
      resolve(dados);
    });
    req.on('error', reject);
  });
}
