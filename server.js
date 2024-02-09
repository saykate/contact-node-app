const http = require("http");
const fs = require("fs");
const path = require('path');
const querystring = require('querystring');

const port = 3000;

const server = http.createServer((req, res) => {
  if(req.method === 'POST' && req.url === '/contact') {
    let body = '';
    //listen for 'data' events and concatenate the chunks
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const formData = querystring.parse(body);
      console.log("Form Data:", formData)
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Form submission received');
    })
  } else {
    //serve static files
    let filePath = path.join(
      __dirname, 
      "./react-app/dist", 
      req.url === '/' ? "index.html" : req.url
    );

    let extName = path.extname(filePath);

    let contentType = "text/html";
    switch (extName) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpg";
        break;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.write(`Error found: ${err}`)
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data, 'utf-8')
      }
      res.end();
    })
  }
});

server.listen(port, (err) => {
  if (err) {
    console.log("Uh, oh! Something went wrong!", err);
  } else {
    console.log("The server is listening...on port " + port);
  }
});