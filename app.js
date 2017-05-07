const env = process.env;
const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");
const port = env.NODE_PORT || 3000;
const ip = env.NODE_IP || "127.0.0.1";
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
console.log(ws.upgradeReq.url);
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
        connectionId: userId,
        zame:clientMsg
      }
    }));


  });

  ws.on("close", function () {
    console.log("websocket connection close");
  });
});


console.log("websocket server starting on " + ip + ":" + port);
server.listen(port, ip);