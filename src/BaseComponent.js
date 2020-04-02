import CoreComponent from './CoreComponent';
import { biqUpdateQuery, debug, abbreviateNumber, generateRandomTimeData, generateColumnData, animateDiv  } from './helpers';
import $ from 'jquery';
import { search } from './biq-app';
import _chartComponentTemplate from './chartComponentTemplate.html';
require('jsrender')($);

export default class BaseComponent extends CoreComponent {
    constructor(options, chart) {
        super(options)
        this.chart = chart;
        this.filtercomponent = options.filtercomponent || null;
        if (this.options.preProcessFn) {
            this.preProcess = this.options.preProcessFn;
        }
        if (this.options.preRenderFn) {
            this.preRender = this.options.preRenderFn;
        }
        if (this.options.postRenderFn) {
            this.postRender = this.options.postRenderFn;
        }
        if (!options.template) {
            options.template = _chartComponentTemplate;
          }
        if (this.chart) {
            this.chart.setAnimation(false);
        }
    }

    resetChildren(children) {
        if (children) {
            children.forEach(function (child) {
                $("#" + child).hide();
            });
        }
    }

    getChart() {
        return this.chart;
    }

    _updateQuery(options, query) {
        var _biqFilters = [];
        if(this.filtercomponent) {

            _biqFilters = this.filtercomponent._biqFilters;

        }
        return biqUpdateQuery(options, query, _biqFilters);
    }

    draw(onClick, callback) {
        var options = this.getOptions();
        var chart = this.getChart();
        this._draw(
            options,
            chart,
            this.resetChildren,
            this.preProcess,
            onClick,
            this._render,
            this.preRender,
            this.postRender,
            callback
        );
    }

    _draw(
        options,
        chart,
        resetChildrenFunction,
        preProcess,
        onClick,
        _render,
        preRender,
        postRender,
        callback
    ) {
        if (options.query) {
            var queryOptions = options.query;
            if (typeof queryOptions == "string") {
                queryOptions = { query: this._updateQuery(options, options.query) };
            } else {
                queryOptions.query = this._updateQuery(options, queryOptions.query);
            }
            search(queryOptions, function (data) {
                _render(
                    chart,
                    options,
                    onClick,
                    resetChildrenFunction,
                    preProcess,
                    data,
                    preRender,
                    postRender,
                    callback
                );
            });
        } else {
            var data;
            if (options.data == true || !options.data) {
                data = this.generateRandomData();
            } else {
                data = options.data;
            }
            if (!data) {
                data = [];
            }
            _render(
                chart,
                options,
                onClick,
                resetChildrenFunction,
                preProcess,
                data,
                preRender,
                postRender,
                callback
            );
        }
    }

    generateRandomData() {
        var max = 1000;
        if (this.getChartOptions() && this.getChartOptions().max) {
            max = this.getChartOptions().max;
        }

        var intervals = 60;
        if (this.getChartOptions() && this.getChartOptions().intervals) {
            intervals = this.getChartOptions().intervals;
        }

        var bucket = "mins";
        if (this.getChartOptions() && this.getChartOptions().bucket) {
            bucket = this.getChartOptions().bucket;
        }

        var xmin = 0;
        if (this.getChartOptions() && this.getChartOptions().xmin) {
            xmin = this.getChartOptions().xmin;
        }

        var xmax = intervals;
        if (this.getChartOptions() && this.getChartOptions().xmax) {
            xmax = this.getChartOptions().xmax;
        }

        return generateRandomTimeData(max, intervals, bucket, xmin, xmax);
    }

    _render(
        chart,
        options,
        onClick,
        resetChildrenFunction,
        preProcess,
        data,
        preRender,
        postRender,
        callback
    ) {
        if (preProcess) {
            data = preProcess(options, data);
        }
        if (preRender) {
            preRender(chart, options, data);
        }
        if (chart) {
            chart.renderChart(data, function (result) {
                resetChildrenFunction(options.reset);
                if (onClick) {
                    onClick(result);
                }
            });
        } else {
            $("#" + options.targetId).html(
                $.templates(options.template).render(options)
              );
              $("#" + options.targetId).click(function() {
                if (onClick) {
                  onClick(data);
                }
              });

        }

        if (postRender) {
            postRender(chart, options, data);
        }
        if (callback) {
            callback(options, data);
        }
    }
}
