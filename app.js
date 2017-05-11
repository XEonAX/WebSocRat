const env = process.env;
const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");
const port = env.NODE_PORT || 3000;
const ip = env.NODE_IP || "127.0.0.1";
const app = express();
const crypto = require("crypto");
app.use(express.static('static'));
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
    msgType: "onOpenConnection",
    msg: {
      connectionId: connId
    }
  }));


  ws.on("message", function (data, flags) {
    console.log("websocket received a message");
    var clientMsg = data;

    ws.send(JSON.stringify({
      msg: {
        connectionId: userId,
        zame: clientMsg
      }
    }));


  });

  ws.on("close", function () {
    console.log("websocket connection close");
    for (var connectionId in connections) {
      if (connections.hasOwnProperty(connectionId)) {
        var connection = connections[connectionId];
        connection.ws.send(JSON.stringify({
          type: "notif",
          on: "close",
          id: connId
        }))
      }
    }
    delete connections[connId];
  });
});


console.log("websocket server starting on " + ip + ":" + port);
server.listen(port, ip);