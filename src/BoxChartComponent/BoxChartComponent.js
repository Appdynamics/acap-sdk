
import BaseComponent  from '../BaseComponent';
import  SparkLineChart  from '../SparkLineChart/SparkLineChart';
import { abbreviateNumber, roundValue } from '../helpers';
import template from './BoxChartComponent.html';
export default class BoxChartComponent extends BaseComponent {
    constructor(options) {
        options.div = options.targetId + "-chart";
        options.hasChart = true;
        if (!options.cardStyle) {
            options.cardStyle = "card";
        }
        super(options, new SparkLineChart(options));
    }

    preProcess(options, data) {

        if (!options.value) {
            if (!options.rollup) {
                box_getTotal(options, data);
            } else if (options.rollup == 'max') {
                box_getMax(options, data);
            } else if (options.rollup == 'avg') {
                box_getAvg(options, data);
            } else {
                box_getTotal(options, data);
            }
        }
        return data;
    }

    preRender(chart, options, data) {
        $("#" + options.targetId).html(
            $.templates(template).render(options)
        );
    }
}


var box_setAbbreviation = function (options, value) {
    value = roundValue(value);
    if (!options.hasOwnProperty('abbreviate')) {
        options.value = abbreviateNumber(value);
    } else if (options.abbreviate) {
        options.value = abbreviateNumber(value);
    } else {
        options.value = value;
    }
}
var box_getTotal = function (options, data) {
    try {
        var total = 0;
        data.forEach(function (rec) {
            total += rec[1];
        });
        box_setAbbreviation(options, total);
    } catch (error) {
        console.log(error);
    }
}

var box_getMax = function (options, data) {
    try {
        var max = 0;
        data.forEach(function (rec) {
            if (rec[1] > max) {
                max = rec[1];
            }
        });
        box_setAbbreviation(options, max);
    } catch (error) {
        console.log(error);
    }
}

var box_getAvg = function (options, data) {
    try {
        var total = 0;
        data.forEach(function (rec) {
            total += rec[1];
        });
        var avg = 0;
        if (total > 0) {
            avg = total / data.length;
        }
        box_setAbbreviation(options, avg);
    } catch (error) {
        console.log(error);
    }
}

