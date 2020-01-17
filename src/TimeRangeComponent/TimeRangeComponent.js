import BaseComponent  from '../BaseComponent';
import _timeRangeComponentTemplate from './TimeRangeComponent.html';
export default class TimeRangeComponent extends BaseComponent {
    constructor(options) {
      options.template = _timeRangeComponentTemplate;
      super(options);
    }
  
    draw(onClick, callback) {
      var options = this.getOptions();
      this.template = $.templates(options.template);
      $("#" + options.targetId).html(this.template.render(options));
      $("#timeRange").on("change", function () {
        if (onClick) {
          onClick({
            timebucket: getTimeBucket(),
            text: getTimeRangeText(),
            start: getTimeRange().start,
            end: getTimeRange().end
          });
        }
      });
      if (callback) {
        callback(options);
      }
    }
  }