import BaseComponent from '../BaseComponent';
import BaseChart from '../BaseChart';
import { generateColumnData } from '../helpers';
import _chartComponentTemplate from '../chartComponentTemplate.html';
import bb from 'billboard.js';


import cavnaspiechartcss from './CanvasPieChart.css';

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

        var extraOptions = super.getExtraOptions();

        if (extraOptions && !extraOptions.color) {
            extraOptions.color = { pattern: defaultColorPattern };
        }
        super.applyExtraOptions(chartOptions);

        this.chart = bb.generate(chartOptions);
        super.show();
        super.animate();
    }
}



class CanvasPieChart {
    constructor(options) {
      this.options = options;
  
  
    }
  
    draw() {
  
  
      var colors = ['#00D270', '#FFD00E', '#FF7F32', '#8415A6', '#F0203A'];
      if(this.options.colors) {
          colors = this.options.colors;
      }
      this.options.size = this.options.size <= 1 ? 2 : this.options.size;
      var sumOfAngles = 2 * Math.PI;//2pi is 360 degrees;
      var canvas = document.getElementById(this.options.targetId);
      var angles = [];
      var data = this.options.data;
      var datatotal = 0;
      for (var i = 0; i < data.length; i++) {
        datatotal += data[i][1];
        angles.push(sumOfAngles / 100 * data[i][1]);
      }
  
      var ctx = canvas.getContext('2d');
      var beginAngle = 3 * 2 / 4 * Math.PI;
      var endAngle = 3 * 2 / 4 * Math.PI;
      if (Number.isNaN(datatotal)) {
        ctx.beginPath();
  
        // Same code as before
        ctx.moveTo(this.options.size, this.options.size);
        ctx.arc(this.options.size, this.options.size, this.options.size - 1, 0, 2* Math.PI);
        ctx.lineTo(this.options.size, this.options.size);
        ctx.closePath();
        ctx.stroke();
        // Fill color
        ctx.fillStyle = '#2151A1';
  
  
        // Fill
        ctx.fill();
        return;
  
      }
      for (var i = 0; i < angles.length; i++) {
        beginAngle = endAngle;
        endAngle = endAngle + angles[i];
        
        if (angles[i] > 0) {
          ctx.beginPath();
  
          // Same code as before
          ctx.moveTo(this.options.size, this.options.size);
          ctx.arc(this.options.size, this.options.size, this.options.size - 1, beginAngle, endAngle);
          ctx.lineTo(this.options.size, this.options.size);
          ctx.closePath();
          ctx.stroke();
          // Fill color
          ctx.fillStyle = colors[i % colors.length];
  
  
          // Fill
          ctx.fill();
  
        }
  
  
      }
  
    }
  
  }
export { PieChart, PieChartComponent, CanvasPieChart }