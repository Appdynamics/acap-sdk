import BaseComponent from '../BaseComponent';
import $ from 'jquery';
import { getTimeBucket, getTimeRangeText, getTimeRange } from '../biq-app';
import _dateRangeComponentTemplate from './DateTimeRangeComponent.html';
import moment from 'moment';

export default class DateTimeRangeComponent extends BaseComponent {
    constructor(options) {
        options.template = _dateRangeComponentTemplate;
        super(options);
        this.timeRange = {
            start: moment().subtract(15, 'minutes').valueOf(),
            end: moment().valueOf()
        }
        if (options.retention) {
            this.retention = options.retention;

        } else {
            this.retention = 8;
        }
    }
    
    update() {
        var drc = this;
        var drp = $(compId).data('daterangepicker');
        var now = moment();
        drp.ranges = {
            'Last 15 Minutes': [now.clone().subtract(15, 'minutes'), now],
            'Last 30 Minutes': [now.clone().subtract(30, 'minutes'), now],
            'Last 1 Hour': [now.clone().subtract(1, 'hours'), now],
            'Last 3 Hours': [now.clone().subtract(3, 'hours'), now],
            'Last 6 Hours': [now.clone().subtract(6, 'hours'), now],
            'Last 12 Hours': [now.clone().subtract(12, 'hours'), now],
            'Last 1 Day': [now.clone().subtract(1, 'days'), now],
            'Last 2 Days': [now.clone().subtract(2, 'days'), now],
            'Last 3 days': [now.clone().subtract(3, 'days'), now],
            'Last 1 Week': [now.clone().subtract(7, 'days'), now],
        };

        var diff = now.diff(drc.lastupdate);
        var isCustom = $('.ranges > ul > li.active').data('range-key') === 'Custom Range';
        if (!isCustom) {
            var newstart = drp.startDate.clone().add(diff, 'ms');
            var newend = drp.endDate.clone().add(diff, 'ms');
            drp.setStartDate(newstart);
            drp.setEndDate(newend);
            drc.timeRange.start = newstart.valueOf();
            drc.timeRange.end = newend.valueOf();
        }
        drc.lastupdate = now;
    }

    getTimeSelector(){
        return this.getOptions().targetId+"_daterange";
    }

    getTimeRange(){
        return this.timeRange;
    }

    draw(onClick, callback) {
        var drc = this;
        var options = this.getOptions();
        this.template = $.templates(options.template);
        drc.lastupdate = moment();
        let divSelector = "#" + options.targetId;
        
        $(divSelector).html(this.template.render(options));
        var now = moment();
        var ranges = {
            'Last 15 Minutes': [now.clone().subtract(15, 'minutes'), now],
            'Last 30 Minutes': [now.clone().subtract(30, 'minutes'), now],
            'Last 1 Hour': [now.clone().subtract(1, 'hours'), now],
            'Last 3 Hours': [now.clone().subtract(3, 'hours'), now],
            'Last 6 Hours': [now.clone().subtract(6, 'hours'), now],
            'Last 12 Hours': [now.clone().subtract(12, 'hours'), now],
            'Last 1 Day': [now.clone().subtract(1, 'days'), now],
            'Last 2 Days': [now.clone().subtract(2, 'days'), now],
            'Last 3 days': [now.clone().subtract(3, 'days'), now],
            'Last 1 Week': [now.clone().subtract(7, 'days'), now],
        };

        var pickerOptions = {
            "showDropdowns": true,
            "timePicker": true,
            "autoUpdateInput": true,
            "minDate": now.clone().subtract(drc.retention, 'days').startOf('day'),
            "maxDate": now.clone().endOf('day'),
            locale: {
                format: 'M/DD hh:mm A'
            },
            ranges: ranges,
            "startDate": now.clone().subtract(1, 'hours'),
            "endDate": now
        };

        super.applyExtraOptions(pickerOptions);

        let inputSelect = this.getTimeSelector();
        $("#"+inputSelect).daterangepicker(pickerOptions, function (start, end, label) {
            drc.timeRange.start = start.valueOf();
            drc.timeRange.end = end.valueOf();
            if (onClick) {
                onClick({
                  timebucket: drc.timeRange,
                  text: label,
                  start: drc.timeRange.start,
                  end: drc.timeRange.end
                });
            }
        });

        if (callback) {
            callback(options);
        }
        return this;
    }
}