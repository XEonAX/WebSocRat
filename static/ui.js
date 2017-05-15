'use strict';
$("#txtInput").keypress(function(event){
    if(event.keyCode == 13){
     $('#btnSend').click();
    }
});
var logo = Math.floor((Math.random() * 5) + 1);
switch (logo) {
    case 1:
        $("#LOGO").addClass("fa-hand-rock-o");
        break;
    case 2:
        $("#LOGO").addClass("fa-hand-paper-o");
        break;
    case 3:
        $("#LOGO").addClass("fa-hand-scissors-o");
        break;
    case 4:
        $("#LOGO").addClass("fa-hand-lizard-o");
        break;
    case 5:
        $("#LOGO").addClass("fa-hand-spock-o");
        break;
}