export default class Controller {
  constructor(req, res, { corpo = {}, query = {} } = {}) {
    this.req = req;
    this.res = res;
    this.corpo = corpo;
    this.query = query;
  }

  render(res, html, statusCode = 200) {
    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }

  redirect(res, url) {
    res.writeHead(302, { Location: url });
    res.end();
  }
}
