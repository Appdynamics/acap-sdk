import BaseComponent  from '../BaseComponent';
import {autoCompleteOnFilter} from '../biq-app';
import _filterComponentTemplate from './FilterComponent.html';
import TimeRangeComponent from '../TimeRangeComponent/TimeRangeComponent';

export default class FilterComponent extends BaseComponent {
    constructor(options) {
        super(options);
        options.template = _filterComponentTemplate;
        this._biqFilters = [];

    }

    updateQueryWithFilters(query) {
        if (this._biqFilters && this._biqFilters.length > 0) {
            this._biqFilters.forEach(function (filter) {
                var noSpaceQuery = query.replace(/\s/g, "");
                if (!noSpaceQuery.includes(filter.field + "=")) {
                    query += " AND " + filter.field + " = '" + filter.value + "'";
                }
            });
        }
        return query;
    }

    draw(onClick, callback) {
        var fc = this;
        var options = this.getOptions();
        this.template = $.templates(options.template);
        $("#" + options.targetId).html(this.template.render(options));
        let timeSelector = this.getTimeSelector();
        options.filters.forEach(function (filter) {
            if (filter.query) {
                autoCompleteOnFilter(
                    "#" + filter.id,
                    filter.query,
                    filter.adqlField,
                    timeSelector,
                    function (selection) { }
                );
            }
        });

        $("#"+ options.targetId+"_submitFilter").on("click", function () {
            var results = [];
            options.filters.forEach(function (filter) {
                var value = $("#" + filter.id).val();
                if (value && value.length > 0) {
                    results.push({ field: filter.adqlField, value: value });
                }
            });
            fc._biqFilters = results;
            if (onClick) {
                onClick(fc._biqFilters);
            }
        });
        $("#"+ options.targetId+"_resetFilter").on("click", function () {
            options.filters.forEach(function (filter) {
                $("#" + filter.id).val("");
            });
            this._biqFilters = [];
        });
        if (callback) {
            callback(options);
        }
        
        this._drawFilterComponent(options);
    }

    getTimeSelector(){
        return this.getOptions().targetId+"_time_timeRange";
    }

    updateQuery(query) {
        return this.updateQueryWithFilters(query);
    }

    _drawFilterComponent(options){
        new TimeRangeComponent({
            targetId: this.getOptions().targetId+"_time"
        }).draw();
    }

}