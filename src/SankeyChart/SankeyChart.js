import BaseChart from '../BaseChart';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

export default class SankeyChart extends BaseChart {
    constructor(options) {
      options.div = options.targetId;
      super(options);
    }
  
    generateSampleData() {
      return {
        nodes: [{ "id": 0, "name": "RuntimeException" },
        { "id": 1, "name": "Login Service" },
        { "id": 2, "name": "DB Service" },
        { "id": 3, "name": "Customer A" },
        { "id": 4, "name": "Customer B" }],
        links: [{ "source": 0, "target": 1, "value": 15 },
        { "source": 0, "target": 2, "value": 5 },
        { "source": 1, "target": 3, "value": 10 },
        { "source": 1, "target": 4, "value": 5 }
        ]
      };
    }
  
    renderChart(onClick) {
      var sankeyId = "#" + super.getDivId();
      var data = this.getOptions().data;
      if (!data) {
        data = this.generateSampleData();
      }
      var chartOptions = this.getExtraOptions();
      let width = 800;
      let height = 600;
      if(chartOptions.size){
        width = chartOptions.size.width;
        height = chartOptions.size.height;
      }

      //input/output/path
      let edgeColor =  chartOptions.pathColor || 'input';
      
      const _sankey = sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 5]]);
      const sankeyobj = ({ nodes, links }) => _sankey({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: links.map(d => Object.assign({}, d))
      });
  
   
      const f = d3.format(",.0f");
      const format = d => `${f(d)} TWh`;
  
      const _color = d3.scaleOrdinal(d3.schemeCategory10);
      const color = name => _color(name.replace(/ .*/, ""));
  
      const svg = d3.select(sankeyId)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", width)
        .style("height", height);
  
      const { nodes, links } = sankeyobj(data);
  
      svg.append("g")
        .attr("stroke", "#000")
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        .on("click", function (d) {
          if (d3.event.defaultPrevented) return;
          if (onClick) { onClick(d); }
        })
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.name))
        .attr("class", "sankeyNode")
        .append("title")
        .text(d => `${d.name}\n${format(d.value)}`)
        ;
  
      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll("g")
        .data(links)
        .join("g")
        .style("mix-blend-mode", "multiply");
  
  
  
      function update() {
        if (edgeColor === "path") {
          const gradient = link.append("linearGradient")
            .attr("id", (d, i) => {
              //  (d.uid = DOM.uid("link")).id
              const id = `link-${i}`;
              d.uid = `url(#${id})`;
              return id;
            })
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", d => d.source.x1)
            .attr("x2", d => d.target.x0);
  
          gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", d => color(d.source.name));
  
          gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", d => color(d.target.name));
        }
  
        link.append("path")
          .attr("d", sankeyLinkHorizontal())
          .attr("stroke", d => edgeColor === "path" ? d.uid
            : edgeColor === "input" ? color(d.source.name)
              : color(d.target.name))
          .attr("stroke-width", d => Math.max(1, d.width))
          .attr("class", "sankeyLink");
      }
  
      update();
  
      link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);
  
      svg.append("g")
  
        .style("font", "10px sans-serif")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name);
      d3.selectAll('.sankeyLink').on('mouseover', function () {
        d3.select(this).style("stroke-opacity", ".5");
      })
    }
  
  }