import BaseChart from '../BaseChart';
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
              clickFunction(d);
            }
          }
        },
        legend: { show: true }
      };
  
      super.applyExtraOptions(chartOptions);

      this.chart = bb.generate(chartOptions);
      super.show();
      super.animate();
    }
  }