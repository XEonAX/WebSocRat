'use strict';
$("#txtInput").keypress(function (event) {
    if (event.keyCode == 13) {
        $('#btnSend').click();
    }
});

var LogoChanger = function () {
    $("#LOGO").removeClass();
    var logo = Math.floor((Math.random() * 5) + 1);
    switch (logo) {
        case 1:
            $("#LOGO").addClass("fa fa-hand-rock-o");
            break;
        case 2:
            $("#LOGO").addClass("fa fa-hand-paper-o");
            break;
        case 3:
            $("#LOGO").addClass("fa fa-hand-scissors-o");
            break;
        case 4:
            $("#LOGO").addClass("fa fa-hand-lizard-o");
            break;
        case 5:
            $("#LOGO").addClass("fa fa-hand-spock-o");
            break;
    }
}
setInterval(LogoChanger,1234);

$("body").fadeIn();