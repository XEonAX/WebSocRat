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
            $("#btnConnect").text("Connected").removeClass("btn-info").addClass("btn-success").prop("disabled", true);
        };
        ws.onmessage = function onmessage(evt) {
            var msg = JSON.parse(evt.data);
            if (msg.type == "message") {
                var chat = document.createElement("div");
                chat.classList.add("panel");
                chat.classList.add("panel-default");
                var chathead = document.createElement("div");
                chathead.classList.add("panel-heading");
                var chatecho = document.createElement("span");
                chatecho.classList.add("glyphicon");
                chatecho.classList.add(msg.echo ? "glyphicon-upload" : "glyphicon-download");
                chathead.appendChild(chatecho);

                var chatsender = document.createElement("span");

                chatsender.innerText = " " + msg.sender;
                chathead.appendChild(chatsender);

                var chatbody = document.createElement("div");
                chatbody.classList.add("panel-body");

                chatbody.innerText = msg.message;
                chat.appendChild(chathead);
                chat.appendChild(chatbody);
                txtMessages.appendChild(chat);
                chat.scrollIntoView();
            };
        };
        ws.onerror = function onerror(evt) {

        };
        ws.onclose = function onclose(evt) {
            $("#btnConnect").text("Connect").removeClass("btn-success").addClass("btn-info").prop("disabled", false);
        };
    };
    self.SendMessage = function SendMessage() {
        if (ws.readyState == WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "message",
                sender: "AEonAX",
                to: "ALL",
                message: txtInput.value,
                timestamp: Date.now()
            }))
            txtInput.value = "";
        };
    };
}

var client = new wsc();