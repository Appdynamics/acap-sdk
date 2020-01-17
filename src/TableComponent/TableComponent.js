import BaseComponent  from '../BaseComponent';
import BaseChart from '../BaseChart';
export default class TableComponent extends BaseComponent {
    constructor(options) {
      if (!options.template) {
        options.template = _tableComponentTemplate;
      }
      super(options, new Table(options));
    }
  
    generateRandomData() {
      return generateColumnData();
    }
  
    clearSelection(){
      this.getChart().clearSelection();
    }
  }
  
class Table extends BaseChart {
    constructor(options) {
      if (!options.template) {
        options.template = _tableTemplate;
      }
      super(options);
      this.order = options.order;
      if (!this.order) {
        this.order = [[options.columns.length - 1, "desc"]];
      }
    }
  
    clearSelection(){
      var id = this.getDiv();
      if ($.fn.DataTable.isDataTable(id)) {
        var table = $(id);
        table.DataTable().$("tr.selected").removeClass("selected");
      }
    }
  
    renderChart(data, clickFunction) {
      super.renderOuterComponent(this.template);
      super.setTitle(super.getOptions());
      var id = this.getDiv();
      var table = $(id);
  
      if (!$.fn.DataTable.isDataTable(id)) {
        var initOptions = super.getOptions().options;
        if (!initOptions) {
          initOptions = {};
        } else {
          initOptions = jQuery.extend({}, initOptions);
        }
        initOptions.data = data;
        initOptions.columns = super.getOptions().columns;
        initOptions.order = this.order;
  
        table.DataTable(initOptions);
        table.DataTable().on("click", 'tr[role="row"]', function () {
          table
            .DataTable()
            .$("tr.selected")
            .removeClass("selected");
          var tr = $(this);
          tr.toggleClass("selected");
          var row = table.DataTable().row(tr);
          if (clickFunction) {
            clickFunction(row.data());
          }
        });
      } else {
        table.DataTable().clear();
        table.DataTable().rows.add(data);
        table.DataTable().draw();
      }
  
      if (super.getOptions().class) {
        $(id).addClass(super.getOptions().class);
      }
      super.show();
      super.animate();
    }
  }