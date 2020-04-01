const model = require("./model");

function home(request, response) {
  response.writeHead(200, { "content-type": "text/html" });
  response.end(`<h1>Hello world</h1>`);
}

module.exports = { home };
