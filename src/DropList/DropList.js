import BaseChart from '../BaseChart';
import { debug } from '../helpers';

export default class DropList extends BaseChart {
    constructor(options) {
      super(options);
    }

    _selectComp(){
      var targetId = super.getTargetId();
      var comp = $("#"+targetId);
      if(!comp){
        throw "Attempting to locate targetId :"+targetId+" unable to find element using $('#"+targetId+"')";
      }else{
        return comp;
      }
    }
  
    renderChart(data, clickFunction) {
      var options = super.getChartOptions();
      /**
       * in case they pass the data attribute similar to other components
       */
      if(data){
        options.data = data;
      }
      if(clickFunction){
        options.onClick = clickFunction;
      }

      this._selectComp().multipleSelect(options);
    }

    multipleSelect(command){
       return this._selectComp().multipleSelect(command);
    }
  }