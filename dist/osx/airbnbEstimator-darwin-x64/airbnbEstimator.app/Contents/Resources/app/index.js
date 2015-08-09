var client = require("cheerio-httpcli");
var flumine = require("flumine");

var moment = require("moment");
var sprintf = require("sprintf");
var merge = require("merge");

var search = function(params) {
    var BASE_URL = "https://www.airbnb.com/search/search_results";
    return client.fetch(BASE_URL, params).then(function(r) {
        return JSON.parse(r.body);
    }).then(function(r) {
        if (r.visible_results_count >= 1000) {
            throw new Error("指定範囲が広すぎます。");
        }
        return r;
    });
};

var DAYS = 60;

var argsToQueries = flumine.to(function(d) {
    var today = moment().format("YYYY-MM-DD");
    var todayMoment = moment(today);
    var list = [];
    list.push({
        delay: 0,
        query: d,
    });
    for (var i = 0; i < DAYS; i++) {
        var date = {
            checkin: todayMoment.format("YYYY-MM-DD"),
            checkout: todayMoment.add(1, "days").format("YYYY-MM-DD"),
        };
        list.push({
            delay: (i + 1) * 500,
            query: merge(merge({}, d), date),
        });
    }
    return list;
});
var searchCount = flumine.to(search).as("visible_results_count");

var searchPair = flumine.set({
    request: flumine.pass,
    count: flumine.and(searchCount)
}).through(function() {
    console.log(".");
});

var delayed = flumine(function(d, ok, ng) {
    setTimeout(function() {
        ok(d.query);
    }, d.delay);
});

var summary = flumine.to(function(d) {
    var total = d[0].count;
    for (var i = 1; i < d.length; i++) {
        var e = d[i];
        var count = e.count;
        console.log([e.request.checkin, sprintf("%2.2f", ((total - count) / total) * 100)].join("\t"));
    }
});



var TARGET = "https://www.airbnb.jp/s/%E6%B8%8B%E8%B0%B7%E5%8C%BA-%E9%81%93%E7%8E%84%E5%9D%82?price_min=24&price_max=30000&zoom=18&search_by_map=true&sw_lat=35.656312584503986&sw_lng=139.69482545091125&ne_lat=35.6592409393208&ne_lng=139.69770077897522&ss_id=4ai93syb";

var TARGET2 = "https://www.airbnb.jp/s/%E8%A1%A8%E5%8F%82%E9%81%93?room_types%5B%5D=Entire+home%2Fapt&price_min=15000&zoom=14&search_by_map=true&sw_lat=35.64200476360869&sw_lng=139.6891440006733&ne_lat=35.6888531048087&ne_lng=139.73514924969675&ss_id=rbqei5h1";

var TARGET3 = "https://www.airbnb.jp/s/%E6%B8%8B%E8%B0%B7?room_types%5B%5D=Entire+home%2Fapt&price_min=9940&zoom=15&search_by_map=true&sw_lat=35.64825957893755&sw_lng=139.68425303233698&ne_lat=35.67168562808833&ne_lng=139.7072556568487&ss_id=rbqei5h1";

var parseQueryObject = function(urlString) {
    var url = require("url");
    var querystring = require("querystring");
    var urlObj = url.parse(urlString);

    var qobj = querystring.parse(urlObj.query);
    var locate = urlObj.pathname.split(/\//).pop();
    qobj.location = locate;
    return qobj;
};

var app =
    argsToQueries.each(delayed.and(searchPair)).and(summary);


app(parseQueryObject(TARGET3));
