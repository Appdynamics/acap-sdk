import BaseChart from '../BaseChart';
import { debug } from '../helpers';
import bb from 'billboard.js';
export default class GaugeChart extends BaseChart {
    constructor(options) {
      super(options);
    }
  
    renderChart(data, clickFunction) {
      super.renderOuterComponent(this.template);
  
      var chartOptions = {
        bindto: super.getDiv(),
        data: {
          columns: data,
          type: "gauge",
          onclick: function (d, i) {
            if (clickFunction) {
              debug(this, JSON.stringify(d));
              clickFunction(d);
            }
          }
        },
        legend: { show: true }
      };
  
      super.updateChartOptions(chartOptions);
      this.chart = bb.generate(chartOptions);
      super.show();
      super.animate();
    }
  }