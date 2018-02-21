'use strict';

var moment = require('moment');

function calculateBetween(start, end, format = 'YYYY-MM-DD') {
    return moment(end, format).diff(moment(start, format), 'days');
}

function fixOrder(arr, format = 'YYYY-MM-DD') {

    arr = arr.sort(function (a, b) {

        var a = moment(a.date, format).valueOf();
        var b = moment(b.date, format).valueOf();
        var sortByDate = a - b;

        if (sortByDate == 0) {
            return a.start ? -1 : +1;
        }

        return sortByDate;

    });

    return arr;

}

function each(periods, stack = [], dateFormat = 'YYYY-MM-DD') {

    var days = 0;

    periods.forEach(function (value) {

        var date = value.date;
        var start = value.start;

        if (start) {
            stack.push(date);
        } else {

            var pop = stack.pop(date);

            if (!stack.length) {
                if (date == pop) {
                    days++;
                } else {
                    days += calculateBetween(pop, date, dateFormat);
                }
            }

        }

    });

    return days;

}

function separate(periods, format = 'YYYY-MM-DD') {

    var arr = [];
    var already = [];

    periods.forEach(function (period) {

        if (already.indexOf(period[0] + ',' + period[1]) != -1) {
            return false;
        }

        arr.push({
            date: period[0],
            start: 1
        }, {
            date: period[1],
            start: 0
        });

        already.push(period[0] + ',' + period[1]);

    });

    return fixOrder(arr, format);

}

function parse(periods, dateFormat = 'YYYY-MM-DD') {
    return each(separate(periods), [], dateFormat);
}

module.exports = {
    parse: parse,
    separate: separate,
    each: each,
    fixOrder: fixOrder,
    calculateBetween: calculateBetween
};