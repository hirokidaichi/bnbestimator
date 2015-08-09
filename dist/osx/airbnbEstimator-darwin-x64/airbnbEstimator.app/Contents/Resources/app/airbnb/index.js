var flumine = require("flumine");
var client = require("cheerio-httpcli");
var moment = require("moment");
var merge = require("merge");
var sprintf = require("sprintf");
var airbnb = module.exports = {};

var BASE_URL = airbnb.BASE_URL = "https://www.airbnb.com/search/search_results";

var parseQueryObject = function(urlString) {
    if (typeof urlString !== "string") {
        return urlString;
    }
    var url = require("url");
    var querystring = require("querystring");
    var urlObj = url.parse(urlString);

    var qobj = querystring.parse(urlObj.query);
    var locate = decodeURI(urlObj.pathname.split(/\//).pop());
    qobj.location = locate;
    return qobj;
};

airbnb.search = flumine.to(function(params) {
    return client.fetch(BASE_URL, parseQueryObject(params)).then(function(r) {
        return JSON.parse(r.body);
    }).then(function(r) {
        delete r.filters;
        delete r.results;
        delete r.pagination_footer;
        return r;
    });
});

var DATE_REGEX = /\d{4}-\d{2}-\d{2}/;
var getSearchRange = flumine.to(function(d) {
    var params = d[0];
    var from = d[1];
    var to = d[2];
    if (!DATE_REGEX.test(from)) {
        throw new Error("from is illigal");
    }
    if (!DATE_REGEX.test(to)) {
        throw new Error("to is illigal");

    }
    var fromDate = moment(from);
    var toDate = moment(to);
    var diffDate = toDate.diff(fromDate, 'days');
    if (!(0 < diffDate && diffDate <= 60)) {
        throw new Error("1日以上60日未満で指定してください。" + diffDate + "日指定しています。");
    }
    var queryObj = parseQueryObject(params);
    var list = [];
    list.push({
        delay: 0,
        query: queryObj
    });

    for (var i = 0; i < diffDate; i++) {
        var checkin = fromDate.format("YYYY-MM-DD");
        var checkout = fromDate.add(1, "days").format("YYYY-MM-DD");
        list.push({
            delay: (i + 1) * 500,
            query: merge(merge({}, queryObj), {
                checkin: checkin,
                checkout: checkout
            }),
        });
    }
    return list;
});
airbnb.searchByDateRange = getSearchRange.each(
    flumine.through(function(d, ok, ng) {
        setTimeout(ok, d.delay);
    }).as("query").set({
        request: flumine.pass,
        results: airbnb.search,
    })
);

airbnb.estimateRate = airbnb.searchByDateRange.and(function(d) {
    var total = d[0].results.visible_results_count;
    var result = [];
    for (var i = 1; i < d.length; i++) {
        var e = d[i];
        var count = e.results.visible_results_count;
        var price = e.results.average_price;
        result.push([e.request.checkin, Number(sprintf("%0.2f", ((total - count) / total))), price]);
    }
    return {
        lists: result,
        request: d[0].request
    };
});
