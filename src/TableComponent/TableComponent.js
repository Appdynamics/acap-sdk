import BaseComponent  from '../BaseComponent';
import BaseChart from '../BaseChart';
import { generateColumnData } from '../helpers';
import template from './TableComponent.html';
import tabletemplate from './Table.html';
 class TableComponent extends BaseComponent {
    constructor(options) {
      if (!options.template) {
        options.template = template;
      }
      super(options, new Table(options));
    }
  
    generateRandomData() {
      return generateColumnData();
    }
  
    clearSelection(){
      this.getChart().clearSelection();
    }

    data(records){
      this.getChart().data(records);
    }
  }
  
class Table extends BaseChart {
    constructor(options) {
      if (!options.template) {
        options.template = tabletemplate;
      }
      super(options);
    }
  
    clearSelection(){
      var id = this.getDiv();
      var tablesvc = this;
      if ($.fn.DataTable.isDataTable(id)) {
        var table = $(id);
        tablesvc.table.$("tr.selected").removeClass("selected");
      }
    }

    data(records){
      if(this.table){
        this.table.clear();
        this.table.rows.add(records);
        this.table.draw();
      }   
    }
  
    renderChart(data, clickFunction) {
      var tablesvc = this;
      super.renderOuterComponent(this.template);
      super.setTitle(super.getOptions());
      var id = this.getDiv();
      var $elem = $(id);
  
      if (!$.fn.DataTable.isDataTable(id)) {
        var initOptions = super.getOptions().options;
        if (!initOptions) {
          initOptions = {};
        } else {
          initOptions = jQuery.extend({}, initOptions);
        }
        initOptions.data = data;
        initOptions.columns = super.getOptions().columns;
        if(!initOptions.order){
          initOptions.order = [[initOptions.columns.length - 1, "desc"]];
        }
  
        tablesvc.table = $elem.DataTable(initOptions);
        $elem.on("click", 'tr[role="row"]', function () {
          tablesvc.table
            .$("tr.selected")
            .removeClass("selected");
          var tr = $(this);
          tr.toggleClass("selected");
          var row = tablesvc.table.row(tr);
          if (clickFunction) {
            clickFunction(row.data());
          }
        });
      } else {
        let table = $(id).DataTable();
        if(table) {
          tablesvc.table = table;
          tablesvc.table.clear();
          tablesvc.table.rows.add(data);
          tablesvc.table.draw();
        }
      }
  
      if (super.getOptions().class) {
        $(id).addClass(super.getOptions().class);
      }
      super.show();
      super.animate();
    }
  }

  export { Table, TableComponent}