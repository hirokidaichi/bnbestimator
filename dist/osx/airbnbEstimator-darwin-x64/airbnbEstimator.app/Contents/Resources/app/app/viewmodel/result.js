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
                return flumine.as("lists").through(function(lists) {
                    var items = lists.map(function(e) {
                        return {
                            date: e[0],
                            rate: e[1] * 100,
                            price: e[2]
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
