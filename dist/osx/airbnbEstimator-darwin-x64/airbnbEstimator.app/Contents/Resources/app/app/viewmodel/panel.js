var moment = require("moment");
var flumine = require("flumine");
var Vue = require("vue");

var panel = module.exports = function(selector) {
    var today = moment();
    var tomorrow = moment(today).add(1, "days");

    return new Vue({
        el: selector,
        data: {
            fromMin: today.format("YYYY-MM-DD"),
            from: today.format("YYYY-MM-DD"),
            toMin: tomorrow.format("YYYY-MM-DD"),
            to: tomorrow.format("YYYY-MM-DD"),
            url: ""
        },
        methods: {
            submit: function() {
                var data = this.$data;
                this.$emit("submit", [data.url, data.from, data.to]);
            }
        }
    });
};
