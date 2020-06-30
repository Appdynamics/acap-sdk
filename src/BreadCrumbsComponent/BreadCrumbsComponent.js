import BaseComponent  from '../BaseComponent';
import _template from './BreadCrumbsComponent.html';

export default class BreadCrumbsComponent extends BaseComponent {
    constructor(options) {
        super(options);
        if(!options.template){
            options.template = _template;
        }
        this.crumbs = [];
        this._resetCrumbs(options.data);
        this.lastCrumb = "";
        this.template = $.templates(options.template);
    }

    _resetCrumbs(data){
        data.forEach(crumb =>{
            this.crumbs.push({name:crumb,active:false});
        });
    }

    addCrumb(name,value){
        this.crumbs.forEach(crumb =>{
            crumb.active = false;
        })
        let newCrumb = {name:name,value:value,active:true};
        if(this.lastCrumb && this.lastCrumb.name !== name){
            this.lastCrumb = newCrumb;
        }
        this.crumbs.push(newCrumb);
        this._redraw();
    }

    removeCrumb(name){
        var newList = [];
        this.crumbs.some(function (crumb) {
            newList.push(crumb);
            var match = crumb.name === name;
            if(match){
                crumb.active = true;
            }
            return match;
        });
        this.crumbs = newList;
        if(this.crumbs.length > 0){
            this.lastCrumb = this.crumbs[this.crumbs.length-1];
        }
        this._redraw();
    }

    makeActive(crumb){
        this.crumbs.forEach(crumbObj =>{
            if(crumbObj.name === crumb){
                crumbObj.active = true;
            }
        });
        this._redraw();
    }

    _redraw(){
        var options = this.getOptions();
        $("#"+options.targetId).empty();
        this.draw(this.onClick,null);
    }

    draw(onClick, callback) {
        this.onClick = onClick;
        this.callback = callback;
        var options = this.getOptions();
        $("#" + options.targetId).html(this.template.render({crumbs:this.crumbs, clickFunction:options.clickFunction}));

        if (callback) {
            callback(options);
        }
        return this;
    }

    breadCrumbComponentClicked(name){
        if(this.onClick){
            this.onClick(name);
        }
    }
}