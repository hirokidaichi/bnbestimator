var flumine = require("flumine");
var Vue = require("vue");

var request = module.exports = function(selector) {
    return new Vue({
        el: selector,
        data: {
            items: []
        },
        methods: {
            update: function() {
                var that = this;
                return flumine.as("request").through(function(d) {
                    var items = Object.keys(d).map(function(k) {
                        return {
                            key: k,
                            value: d[k]
                        };
                    });
                    that.$data = {
                        items: items
                    };
                });
            }
        }
    });
};
