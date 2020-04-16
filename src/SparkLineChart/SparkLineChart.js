import { TimeChart } from '../TimeChartComponent/TimeChartComponent';
import bb from 'billboard.js';

export default class SparkLineChart extends TimeChart {
    constructor(options) {
      super(options);
    }
  
    renderGraph(dataKey, data, clickFunction) {
      var type = "area-spline";
      if (this.getTypeOverride()) {
        type = this.getTypeOverride();
      }
      var chartOptions = {
        bindto: super.getDiv(),
        data: {
          x: "dates",
          type: type,
          onclick: function (e) {
            var date = new Date(e.x.getTime());
            if (clickFunction) {
              clickFunction({ id: e.id, date: date });
            }
          }
        },
        legend: { show: false },
        tooltip: { show: false },
        axis: {
          x: { show: false },
          y: { show: false }
        },
        point: {
          show: false
        }
      };
      chartOptions.data[dataKey] = data;
      super.applyExtraOptions(chartOptions);

      this.chart = bb.generate(chartOptions);
    }
  }
  