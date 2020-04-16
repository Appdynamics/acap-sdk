import BaseComponent from '../BaseComponent';
import BaseChart from '../BaseChart';
import { generateColumnData } from '../helpers';
import _chartComponentTemplate from '../chartComponentTemplate.html';
import bb from 'billboard.js';

class PieChartComponent extends BaseComponent {
    constructor(options) {
        options.template = _chartComponentTemplate;
        super(options, new PieChart(options));
    }

    generateRandomData() {
        return generateColumnData();
    }
}

var defaultColorPattern = ['#2ca02c', '#1f77b4', '#ff7f0e', '#d62728', '#9467bd'];

class PieChart extends BaseChart {
    constructor(options) {
        super(options);
    }

    renderChart(data, clickFunction) {
        super.renderOuterComponent(this.template);
        super.setTitle(super.getOptions());
        var chartOptions = {
            bindto: super.getDiv(),
            data: {
                columns: data,
                type: "pie",
                onclick: function (d, i) {
                    if (clickFunction) {
                        clickFunction(d);
                    }
                }
            },
            legend: { show: true }
        };

        if (!super.getExtraOptions().color) {
            super.getExtraOptions().color = { pattern: defaultColorPattern };
        }
        super.applyExtraOptions(chartOptions);

        this.chart = bb.generate(chartOptions);
        super.show();
        super.animate();
    }
}
export { PieChart, PieChartComponent }