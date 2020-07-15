import BaseComponent from '../BaseComponent';
import { getTimeBucket, getTimeRangeText, getTimeRange } from '../biq-app';
import _timeRangeComponentTemplate from './TimeRangeComponent.html';


export default class TimeRangeComponent extends BaseComponent {
  constructor(options) {
    options.template = _timeRangeComponentTemplate;
    super(options);
  }

  getTimeSelector(){
    return this.options.targetId+"_timeRange";
  }

  getTime(){
    let timeSelector = this.getTimeSelector();
    return {
      timebucket: getTimeBucket(timeSelector),
      text: getTimeRangeText(timeSelector),
      start: getTimeRange(timeSelector).start,
      end: getTimeRange(timeSelector).end
    }
  }

  draw(onClick, callback) {
    var options = this.getOptions();
    this.template = $.templates(options.template);
    $("#" + options.targetId).html(this.template.render(options));
    let timeSelector = this.getTimeSelector();
    $("#"+timeSelector).on("change", function () {
      if (onClick) {
        onClick({
          timebucket: getTimeBucket(timeSelector),
          text: getTimeRangeText(timeSelector),
          start: getTimeRange(timeSelector).start,
          end: getTimeRange(timeSelector).end
        });
      }
    });
    if (callback) {
      callback(options);
    }
    return this;
  }
}