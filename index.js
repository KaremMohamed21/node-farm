const fs = require("fs");
const http = require("http");
const url = require("url");

// Render Html Templates
const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

// Render API
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

// Template Replace
const templateReplace = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
}

// Create A server
const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Routing
    // Overview
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    const tempHtml = dataObj.map(el => templateReplace(tempCard, el));

    res.end(tempOverview)

    // Product Details
  } else if (pathName === "/product") {
    res.end("Hello from the PRODUCT");

    // API
  } else if (pathName === "/api") {
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
    res.end("<h1>404: Page not found!</h1>");
  }
});

// Lister to server
server.listen(4000, "127.0.0.1", () => {
  console.log("server Will be listening on port 4000");
});
