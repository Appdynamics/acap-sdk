import BaseComponent  from '../BaseComponent';
import BaseChart from '../BaseChart';
import _chartComponentTemplate from '../chartComponentTemplate.html';
import bb from 'billboard.js';

class BarChartComponent extends BaseComponent {
    constructor(options) {
        options.template = _chartComponentTemplate;
        super(options, new BarChart(options));
    }

    generateRandomData() {
        return generateColumnData();
    }
}

class BarChart extends BaseChart {
    constructor(options) {
        super(options);
    }

    renderChart(data, clickFunction) {
        super.renderOuterComponent(this.template);
        super.setTitle(super.getOptions());
        var groups = this.getExtraOptions().groups;
        var chartOptions = {
            bindto: super.getDiv(),
            data: {
                columns: data,
                type: "bar",
                onclick: function (d, i) {
                    if (clickFunction) {
                        clickFunction(d);
                    }
                },
                groups:groups
            },
            legend: { show: true }
        };

        super.applyExtraOptions(chartOptions);
        
        this.chart = bb.generate(chartOptions);
        super.show();
        super.animate();
    }
}
export { BarChart, BarChartComponent }