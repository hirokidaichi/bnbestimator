var moment = require("moment");
var flumine = require("flumine");
var Vue = require("vue");

var panel = module.exports = function(selector) {
    var today = moment();
    var tomorrow = moment(today).add(1, "days");
    var targetUrl = "https://www.airbnb.jp/s/%E6%B8%8B%E8%B0%B7%E5%8C%BA-%E9%81%93%E7%8E%84%E5%9D%82?checkin=&guests=&zoom=15&search_by_map=true&sw_lat=35.64875538622148&sw_lng=139.68532994547854&ne_lat=35.66911333439984&ne_lng=139.70665887156497&ss_id=2pci3kzw";
    return new Vue({
        el: selector,
        data: {
            fromMin: today.format("YYYY-MM-DD"),
            from: today.format("YYYY-MM-DD"),
            toMin: tomorrow.format("YYYY-MM-DD"),
            to: tomorrow.format("YYYY-MM-DD"),
            url: targetUrl
        },
        methods: {
            submit: function() {
                var data = this.$data;
                this.$emit("submit", [data.url, data.from, data.to]);
            }
        }
    });
};
