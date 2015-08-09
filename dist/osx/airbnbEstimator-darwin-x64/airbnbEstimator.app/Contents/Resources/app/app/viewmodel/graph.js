var flumine = require("flumine");
var Vue = require("vue");
var sprintf = require("sprintf");
var Chart = require("bower_components/Chart.js/Chart.min.js");


var graph = module.exports = function(selector) {
    var priceFormat = function(min, max) {
        if (min && max) {
            return sprintf("%d円 ~ %d円", min, max);
        }
        if (min && !max) {
            return sprintf("%d円 ~", min);
        }
        if (!min && max) {
            return sprintf(" ~ %d円", max);
        }
        return "全価格帯";
    };
    var vm = new Vue({
        el: selector,
        data: {
            dataset: false,
            location: false,
            minPrice: false,
            maxPrice: false
        },
        computed: {
            title: function() {
                var loc = this.location || "不明";
                var price = priceFormat(Number(this.minPrice), Number(this.maxPrice));
                return sprintf("%s (%s)", loc, price);
            }
        },
        methods: {
            update: function() {
                var that = this;
                return flumine.through(function(d) {
                    that.$data = {
                        dataset: d.lists,
                        location: d.request.location,
                        minPrice: d.request.price_min,
                        maxPrice: d.request.price_max,
                    };
                }).delay(100).and(this.updateChart());
            },
            updateChart: function() {
                var that = this;
                return flumine.through(function() {
                    var dataset = that.dataset;
                    var area = $(that.$el).find("#graphArea").get(0);
                    area.innerHTML = "";
                    var c1 = document.createElement("canvas");
                    var c2 = document.createElement("canvas");
                    c1.width = 160;
                    c1.height = 90;
                    c2.width = 160;
                    c2.height = 90;
                    var g1 = c1.getContext('2d');
                    var g2 = c2.getContext('2d');
                    area.appendChild(c1);
                    area.appendChild(c2);
                    var labels = dataset.map(function(e) {
                        return e[0];
                    });
                    var data = dataset.map(function(e) {
                        return Number(e[1]) * 100;
                    });
                    var prices = dataset.map(function(e) {
                        return e[2];
                    });
                    var maxPrice = Math.max.apply(null, prices);
                    var minPrice = Math.min.apply(null, prices);
                    var scaleMin = (Math.round(minPrice / 1000) - 1) * 1000;
                    var scaleMax = (Math.round(maxPrice / 1000) + 1) * 1000;

                    var scaleSteps = (scaleMax - scaleMin) / 1000;
                    var graphData = {
                        labels: labels,
                        datasets: [{
                            label: "ああ",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: data
                        }]
                    };
                    var priceData = {
                        labels: labels,
                        datasets: [{
                            label: "ああ",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: prices
                        }]
                    };

                    new Chart(g1).Line(graphData, {
                        responsive: true,
                        scaleOverride: true,
                        //Number - 目盛りの間隔
                        scaleSteps: 10,
                        //Number - 目盛り区切りの間隔
                        scaleStepWidth: 10,
                        //Number - 目盛りの最小値
                        scaleStartValue: 0,
                        //String - 目盛りの線の色 
                        scaleLineColor: "rgba(0,0,0,.1)",
                        //Number - 目盛りの線の幅  
                        scaleLineWidth: 10,
                        //Boolean - 目盛りを表示するかどうか  
                        scaleShowLabels: true,
                        //String - 目盛りのフォント
                        scaleFontFamily: "'Arial'",
                        //Number - 目盛りのフォントサイズ 
                        scaleFontSize: 10,
                        //String - 目盛りのフォントスタイル bold→太字  
                        scaleFontStyle: "normal",
                        //String - 目盛りのフォント 
                        scaleFontColor: "#666",
                        ///Boolean - チャートの背景にグリッドを描画するか
                        scaleShowGridLines: true,
                        //String - チャート背景のグリッド色
                        scaleGridLineColor: "rgba(0,0,0,.05)",
                        //Number - チャート背景のグリッドの太さ
                        scaleGridLineWidth: 1,
                        scaleLabel: "<%=value %>%"
                    });
                    new Chart(g2).Line(priceData, {
                        responsive: true,
                        scaleOverride: true,
                        //Number - 目盛りの間隔
                        scaleSteps: scaleSteps,
                        //Number - 目盛り区切りの間隔
                        scaleStepWidth: 1000,
                        //Number - 目盛りの最小値
                        scaleStartValue: scaleMin,
                        //String - 目盛りの線の色 
                        scaleLineColor: "rgba(0,0,0,.1)",
                        scaleLineWidth: 10,
                        //Boolean - 目盛りを表示するかどうか  
                        scaleShowLabels: true,
                        //String - 目盛りのフォント
                        scaleFontFamily: "'Arial'",
                        //Number - 目盛りのフォントサイズ 
                        scaleFontSize: 10,
                        //String - 目盛りのフォントスタイル bold→太字  
                        scaleFontStyle: "normal",
                        //String - 目盛りのフォント 
                        scaleFontColor: "#666",
                        ///Boolean - チャートの背景にグリッドを描画するか
                        scaleShowGridLines: true,
                        //String - チャート背景のグリッド色
                        scaleGridLineColor: "rgba(0,0,0,.05)",
                        //Number - チャート背景のグリッドの太さ
                        scaleGridLineWidth: 1,
                        scaleLabel: "<%=value %>円"
                    });

                });
            }
        }
    });
    return vm;
};
