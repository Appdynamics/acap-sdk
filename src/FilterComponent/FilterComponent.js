import BaseComponent  from '../BaseComponent';
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
        var options = this.getOptions();
        this.template = $.templates(options.template);
        $("#" + options.targetId).html(this.template.render(options));
        options.filters.forEach(function (filter) {
            if (filter.query) {
                autoCompleteOnFilter(
                    "#" + filter.id,
                    filter.query,
                    filter.adqlField,
                    function (selection) { }
                );
            }
        });

        $("#_submitFilter").on("click", function () {
            var results = [];
            options.filters.forEach(function (filter) {
                var value = $("#" + filter.id).val();
                if (value && value.length > 0) {
                    results.push({ field: filter.adqlField, value: value });
                }
            });
            console.log(results);
            this._biqFilters = results;
            if (onClick) {
                onClick(this._biqFilters);
            }
        });
        $("#_resetFilter").on("click", function () {
            options.filters.forEach(function (filter) {
                $("#" + filter.id).val("");
            });
            this._biqFilters = [];
        });
        if (callback) {
            callback(options);
        }
        new TimeRangeComponent({
            targetId: "_timeSelector"
        }).draw();
    }

    updateQuery(query) {
        return this.updateQueryWithFilters(query);
    }
}