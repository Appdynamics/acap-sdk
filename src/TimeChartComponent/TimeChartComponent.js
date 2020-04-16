
import BaseChart from '../BaseChart';
import BaseComponent  from '../BaseComponent';
import _chartComponentTemplate from '../chartComponentTemplate.html';
import bb from 'billboard.js';

class TimeChart extends BaseChart {
    constructor(options) {
        super(options);
    }

    isColumnData(data) {
        if (data && data[0] && data[0].length == 2) {
            return true;
        }
        return false;
    }

    isColumnGroupData(data) {
        if (data && data[0] && data[0].length == 3) {
            return true;
        }
        return false;
    }

    isRowData(data) {
        if (data && data[0] && data[0].length > 3) {
            return true;
        }
        return false;
    }

    prepColumnData(data) {
        var dates = ["dates"];
        var xLabel;
        if (super.getOptions().xLabel) {
            xLabel = super.getOptions().xLabel;
        } else {
            xLabel = "Counts";
        }
        var counts = [xLabel];
        var columnArrays = [];
        columnArrays.push(dates);
        columnArrays.push(counts);
        data.forEach(function (rec) {
            dates.push(parseInt(rec[0]));
            if (rec[1]) {
                counts.push(rec[1]);
            } else {
                counts.push(0);
            }
        });
        return columnArrays;
    }

    prepColumnGroupData(data) {
        return convertToGroupData(data, false);
    }

    prepRowData(data, options) {
        //set timestamp to int
        //row data is epected to be timestamp, group, count
        data.forEach(function (rec) {
            rec[0] = parseInt(rec[0]);
        });

        var headers = ["dates"];
        headers = headers.concat(options.rowHeaders);
        data.unshift(headers);
        return data;
    }

    prepKeyAndData(options, data) {
        var chartData = [];
        var key = options.dataKey;
        if (!key) {
            if (this.isColumnData(data)) {
                key = "columns";
                chartData = this.prepColumnData(data);
            } else if (this.isColumnGroupData(data)) {
                key = "columns";
                chartData = this.prepColumnGroupData(data);
            } else if (this.isRowData(data)) {
                key = "rows";
                chartData = this.prepRowData(data, options);
            } else {
                key = "columns";
                chartData = data;
            }
        } else if (key) {
            chartData = data;
        }
        return { key: key, chartData: chartData };
    }

    renderChart(data, clickFunction) {
        var options = super.getOptions();
        super.renderOuterComponent(this.template);
        super.show();
        super.setTitle(options);
        var keyAndData = this.prepKeyAndData(options, data);
        this.renderGraph(keyAndData.key, keyAndData.chartData, clickFunction);

        super.animate();
    }

    renderGraph(dataKey, data, clickFunction) {
        var type = "line";
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
            axis: {
                x: {
                    type: "timeseries",
                    tick: {
                        format: "%m-%d %H:%M %p",
                        fit: false,
                        rotate: 45
                    }
                }
            }
        };
        chartOptions.data[dataKey] = data;
        super.applyExtraOptions(chartOptions);

        this.chart = bb.generate(chartOptions);

    }
}
 class TimeChartComponent extends BaseComponent {
    constructor(options) {
        if (!options.template) {
            options.template = _chartComponentTemplate;
        }
        super(options, new TimeChart(options));
    }
}
export { TimeChart, TimeChartComponent}