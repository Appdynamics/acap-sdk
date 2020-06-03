import BaseComponent  from '../BaseComponent';
import _template from './DynamicComponent.html';
import { BoxChartComponent } from '..';

export default class DynamicComponent extends BaseComponent {
    constructor(options) {
        super(options);
        if(!options.template){
            options.template = _template;
        }
        this.template = $.templates(options.template);
    }

    _updateColumns(comps){
        let length = comps.length;
        let cols = Math.floor(12/length);
        let i=0;
        comps.forEach(comp =>{
            i++;
            comp.id = super.getTargetId()+"_"+i;
            comp.col = cols;
        });
    }

    chartBuilder(comp){
        let type = comp.type;
        if(!type){
            type = "BoxChartComponent";
        }
        let chart = null;
        let initOptions = {};

        initOptions.title = comp.name;
        initOptions.targetId = comp.id;
        //options.adql = 
        if(comp.options){
            initOptions.options = comp.options;
        }

        switch(type) {
            case "BoxChartComponent" :
                chart = new BoxChartComponent(initOptions);
                break;
        }
        return chart;
    }

    draw(onClick, callback) {
        var options = this.getOptions();

        let comps = options.data;
        this._updateColumns(comps);
        let html = this.template.render({comps:comps});
        $("#" + options.targetId).empty();
        $("#" + options.targetId).html(html);

        comps.forEach(comp =>{
            //verify there is json and it is not a chart object already.
            if(comp.name){
                let chart = this.chartBuilder(comp);
                chart.draw(onClick,null);
            }
        })

        if (callback) {
            callback(options);
        }
        return this;
    }
}