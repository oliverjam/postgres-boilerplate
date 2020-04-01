const handlers = require("./handlers");

function router(request, response) {
  const { url } = request;
  if (url === "/") {
    handlers.home(request, response);
  } else {
    response.writeHead(404, { "content-type": "text/html" });
    response.end(`<h1>Not found</h1>`);
  }
}

module.exports = router;
