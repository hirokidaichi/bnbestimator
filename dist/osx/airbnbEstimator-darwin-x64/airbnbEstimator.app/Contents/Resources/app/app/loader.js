var flumine = require("flumine");

var loader = module.exports = function(selector) {
    var loaderElement = $(selector);
    loaderElement.hide();

    var appearLoading = flumine.through(function() {
        loaderElement.show();
    });
    var hideLoading = flumine.through(function() {
        loaderElement.hide();
    });
    var whenLoading = function(f) {
        return appearLoading.and(f).and(hideLoading);
    };
    return {
        whenLoading: whenLoading
    };
};
