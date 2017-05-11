'use strict';
var ws;
var connectLI = document.getElementById("connLI");
var wsc = function () {
    var self = this;
    self.Connect = function Connect() {
        ws = new WebSocket("ws://" + document.location.hostname + ":3000/Xyzzy");
        ws.onopen = function onopen(evt){
            connectLI.classList.add("active");
        };
        ws.onmessage = function onmessage(evt){

        };
        ws.onerror = function onerror(evt){

        };
        ws.onclose = function onclose(evt){
            connectLI.classList.remove("active");
        };
    };
    self.SendMessage = function SendMessage() {};
}

var client = new wsc();