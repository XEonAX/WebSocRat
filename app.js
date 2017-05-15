const env = process.env;
const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");
const port = env.NODE_PORT || 8000;
const ip = env.NODE_IP || "0.0.0.0";
const app = express();
const crypto = require("crypto");
const faker = require('faker');
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
  var username = faker.internet.userName();
  connections[connId] = {
    id: connId,
    ws: ws,
    user : username
  };
  console.log(ws.upgradeReq.url);
  console.info("websocket connection open");

  var timestamp = new Date().getTime();

  ws.send(JSON.stringify({
    type: "notif",
    on: "open",
    id: connId,
    user: username
  }));


  ws.on("message", function (data, flags) {
    console.log("websocket message received");
    var msg = JSON.parse(data);
    if (msg.type == "message" && msg.to == "ALL")
      for (var connectionId in connections) {
        if (connections.hasOwnProperty(connectionId)) {
          var connection = connections[connectionId];
          if (connection.ws.readyState == 1)
            connection.ws.send(JSON.stringify({
              type: "message",
              message: msg.message,
              timestamp: Date.now().toString(),
              fromId: connId,
              sender: connection.user,//msg.sender,
              echo: connection.id == connId
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