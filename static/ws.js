'use strict';
var ws;
var connectLI = document.getElementById("connLI");
var txtMessages = document.getElementById("txtMessages");
var txtInput = document.getElementById("txtInput");
var wsc = function () {
    var self = this;
    self.Connect = function Connect() {
        ws = new WebSocket("ws://" + document.location.hostname + ":3000/Xyzzy");
        ws.onopen = function onopen(evt) {
            connectLI.children[0].innerText = "Connected";
        };
        ws.onmessage = function onmessage(evt) {
            var msg = JSON.parse(evt.data);
            if (msg.type == "message") {
                var chat = document.createElement("div");
                chat.classList.add("echo" + msg.echo)
                var chathead = document.createElement("div");
                chathead.classList.add("msgHead");
                var chatbody = document.createElement("div");
                chatbody.classList.add("msgBody");

                chathead.innerText = msg.sender;
                chatbody.innerText = msg.message;
                chat.appendChild(chathead);
                chat.appendChild(chatbody);
                txtMessages.appendChild(chat);
            };
        };
        ws.onerror = function onerror(evt) {

        };
        ws.onclose = function onclose(evt) {
            connectLI.children[0].innerText = "Connect";
        };
    };
    self.SendMessage = function SendMessage() {
        if (ws.readyState == WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "message",
                sender: "AEonAX",
                to:"ALL",
                message: txtInput.value,
                timestamp: Date.now()
            }))
            txtInput.value = "";
        };
    };
}

var client = new wsc();