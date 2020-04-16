
import BaseComponent from '../BaseComponent';
import BaseChart from '../BaseChart';
import { generateColumnData } from '../helpers';
import _chartComponentTemplate from '../chartComponentTemplate.html';
import bb from 'billboard.js';

class DonutChartComponent extends BaseComponent {
  constructor(options) {
    if (!options.template) {
      options.template = _chartComponentTemplate;
    }
    super(options, new DonutChart(options));
  }

  generateRandomData() {
    return generateColumnData();
  }
}

class DonutChart extends BaseChart {
  constructor(options) {
    super(options);
  }

  renderChart(data, clickFunction) {
    super.renderOuterComponent(this.template);
    var chartOptions = {
      bindto: super.getDiv(),
      data: {
        columns: data,
        type: "donut",
        onclick: function (d, i) {
          if (clickFunction) {
            clickFunction(d);
          }
        }
      },
      legend: { show: true },
      donut: {
        title: this.options.title
      }
    };

    super.applyExtraOptions(chartOptions);
    this.chart = bb.generate(chartOptions);
    super.show();
    super.animate();
  }
}

export { DonutChart, DonutChartComponent }