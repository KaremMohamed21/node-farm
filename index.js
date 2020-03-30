const fs = require("fs");
const http = require("http");
const url = require("url");
const templateReplace = require("./modules/templateReplace")

// Render Html Templates
const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

// Render API
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);


// Create A server
const server = http.createServer((req, res) => {

  const { query, pathname } = url.parse(req.url, true);

  // Routing
    // Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      'content-type': 'text/html'
    });

    const tempHtml = dataObj.map(el => templateReplace(tempCard, el)).join();
    const output = tempOverview.replace('{%PRODUCT_CARD%}', tempHtml);
    res.end(output);

    // Product Details
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html"
    });

    const product = dataObj[query.id];
    const output = templateReplace(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json"
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "kareem"
    });
    res.end("<h1>Error 404: Page not found!</h1>");
  }
});

// Lister to server
server.listen(4000, "127.0.0.1", () => {
  console.log("server Will be listening on port 4000");
});
