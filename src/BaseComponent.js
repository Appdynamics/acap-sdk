import CoreComponent from './CoreComponent';
import { biqUpdateQuery, abbreviateNumber, generateRandomTimeData, generateColumnData, animateDiv } from './helpers';
import $ from 'jquery';
import { search } from './biq-app';
import _noPanelComponentTemplate from './noPanelComponent.html';
require('jsrender')($);

export default class BaseComponent extends CoreComponent {
    constructor(options, chart) {
        super(options)
        this.chart = chart;
        if (this.options.preProcessFn) {
            this.preProcess = this.options.preProcessFn;
        }
        if (this.options.preRenderFn) {
            this.preRender = this.options.preRenderFn;
        }
        if (this.options.postRenderFn) {
            this.postRender = this.options.postRenderFn;
        }
        
        if (options.template) {
            if (options.template.toLowerCase() === 'none') {
                options.template = _noPanelComponentTemplate;
            }
        }

        if (!options.style) {
            options.cardStyle = "card";
        } else {
            if (options.style.toLowerCase() === 'none') {
                options.cardStyle = null;
            }
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

    select(path){
        return $("#"+path);
    }

    getChart() {
        return this.chart;
    }

    _updateQuery(options, query) {
        let _biqFilters = [];
        if (options.filter) {
            _biqFilters = options.filter._biqFilters;
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
        return this;
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

            /**
             * time selector to determine the time range of the component
             */
            let filter = options.filter;
            if (filter) {
                queryOptions.timeSelector = filter.getTimeSelector();
                if (filter.getTimeRange) {
                    queryOptions.timeRange = filter.getTimeRange();
                }
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
        if (this.getExtraOptions() && this.getExtraOptions().max) {
            max = this.getExtraOptions().max;
        }

        var intervals = 60;
        if (this.getExtraOptions() && this.getExtraOptions().intervals) {
            intervals = this.getExtraOptions().intervals;
        }

        var bucket = "mins";
        if (this.getExtraOptions() && this.getExtraOptions().bucket) {
            bucket = this.getExtraOptions().bucket;
        }

        var xmin = 0;
        if (this.getExtraOptions() && this.getExtraOptions().xmin) {
            xmin = this.getExtraOptions().xmin;
        }

        var xmax = intervals;
        if (this.getExtraOptions() && this.getExtraOptions().xmax) {
            xmax = this.getExtraOptions().xmax;
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
            $("#" + options.targetId).click(function () {
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
