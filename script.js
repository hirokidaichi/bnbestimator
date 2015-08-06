var ipc = require("ipc-promise");
var flumine = require("flumine");

$(function() {
    var loader = require("./app/loader")("#loading");
    var panel = require("./app/viewmodel/panel")("#panel");
    var request = require("./app/viewmodel/request")("#requestTable");
    var result = require("./app/viewmodel/result")("#resultTable");
    var graph = require("./app/viewmodel/graph")("#graph");

    var estimate = flumine.to(function(request) {
        return ipc.send("estimate", request);
    });


    panel.$on("submit",
        loader.whenLoading(estimate
            .each([request.update(), result.update(), graph.update()])
        ).listener()
    );

    var prev = "";
    setInterval(function() {
        var clipboard = require("clipboard");
        var remote = require("remote");
        var text = clipboard.readText();
        if (text && text.match(/^https:\/\/www\.airbnb\.jp\/s\//)) {
            if (prev !== text) {
                var currentWindow = remote.getCurrentWindow();
                currentWindow.focus();
                if (window.confirm("クリップボードのURLを設定しますか？")) {
                    panel.url = text;
                }
            }
            prev = text;
        }
    }, 1000);
});
