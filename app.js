// const http         = require('http'),
//       fs           = require('fs'),
//       path         = require('path'),
//       contentTypes = require('./utils/content-types'),
//       sysInfo      = require('./utils/sys-info'),
//       env          = process.env;

// let server = http.createServer(function (req, res) {
//   let url = req.url;
//   if (url == '/') {
//     url += 'index.html';
//   }

//   // IMPORTANT: Your application HAS to respond to GET /health with status 200
//   //            for OpenShift health monitoring

//   if (url == '/health') {
//     res.writeHead(200);
//     res.end();
//   } else if (url == '/info/gen' || url == '/info/poll') {
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Cache-Control', 'no-cache, no-store');
//     res.end(JSON.stringify(sysInfo[url.slice(6)]()));
//   } else {
//     fs.readFile('./static' + url, function (err, data) {
//       if (err) {
//         res.writeHead(404);
//         res.end('Not found');
//       } else {
//         let ext = path.extname(url).slice(1);
//         res.setHeader('Content-Type', contentTypes[ext]);
//         if (ext === 'html') {
//           res.setHeader('Cache-Control', 'no-cache, no-store');
//         }
//         res.end(data);
//       }
//     });
//   }
// });

// server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
//   console.log(`Application worker ${process.pid} started...`);
// });

const env = process.env;;
const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");
const port = env.NODE_PORT || 3000;

const app = express();
app.use(express.static('static'));
app.get('/health', function (req, res, next) {
  res.writeHead(200);
  res.end();
});

var server = http.createServer(app);

var userId;
var wss = new WebSocketServer({
  server: server
});
wss.on("connection", function (ws) {

  console.info("websocket connection open");

  var timestamp = new Date().getTime();
  userId = timestamp;

  ws.send(JSON.stringify({
    msgType: "onOpenConnection",
    msg: {
      connectionId: timestamp
    }
  }));


  ws.on("message", function (data, flags) {
    console.log("websocket received a message");
    var clientMsg = data;

    ws.send(JSON.stringify({
      msg: {
        connectionId: userId
      }
    }));


  });

  ws.on("close", function () {
    console.log("websocket connection close");
  });
});
console.log("websocket server created");
server.listen(port);