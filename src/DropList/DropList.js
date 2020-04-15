import BaseChart from '../BaseChart';
import { debug } from '../helpers';

export default class DropList extends BaseChart {
    constructor(options) {
      super(options);
    }
  
    renderChart(data, clickFunction) {
      var options = super.getChartOptions();
      var targetId = super.getTargetId();
      var selectComp = $("#"+targetId);
     
      /**
       * in case they pass the data attribute similar to other components
       */
      if(data){
        options.data = data;
      }

      selectComp.multipleSelect(options);
    }

    multipleSelect(command){
        var targetId = super.getDiv();
        var selectComp = $("a#"+targetId);
        selectComp.multipleSelect(command);
    }
  }