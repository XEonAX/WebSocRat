const env = process.env;
const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");
const port = env.NODE_PORT || 3000;
const ip = env.NODE_IP || "0.0.0.0";
const app = express();
const crypto = require("crypto");
app.use(express.static('static'))
// app.use('/static', express.static('static'))
// app.use(express.static('bootstrap-gh-pages'));
app.get('/health', function (req, res, next) {
  res.writeHead(200);
  res.end();
});

var server = http.createServer(app);
var connections = {};
var wss = new WebSocketServer({
  server: server
});
wss.on("connection", function (ws) {
  var connId = crypto.randomBytes(16).toString("hex");
  connections[connId] = {
    Id: connId,
    ws: ws
  };
  console.log(ws.upgradeReq.url);
  console.info("websocket connection open");

  var timestamp = new Date().getTime();

  ws.send(JSON.stringify({
    type: "notif",
    on: "open",
    id: connId,
  }));


  ws.on("message", function (data, flags) {
    console.log("websocket message received");
    var msg = JSON.parse(data);
    if (msg.type=="message" && msg.to=="ALL")
    for (var connectionId in connections) {
      if (connections.hasOwnProperty(connectionId)) {
        var connection = connections[connectionId];
        if (connection.ws.readyState == 1)
          connection.ws.send(JSON.stringify({
            type: "message",
            message: msg.message,
            timestamp: Date.now().toString(),
            fromId: connId,
            sender: msg.sender,
            echo: connection.Id==connId
          }));
      };
    };
  });

  ws.on("close", function () {
    console.log("websocket connection close");
    delete connections[connId];
    for (var connectionId in connections) {
      if (connections.hasOwnProperty(connectionId)) {
        var connection = connections[connectionId];
        if (connection.ws.readyState == 1)
          connection.ws.send(JSON.stringify({
            type: "notif",
            on: "close",
            id: connId
          }));
      };
    };
  });
});


console.log("websocket server starting on " + ip + ":" + port);
server.listen(port, ip);