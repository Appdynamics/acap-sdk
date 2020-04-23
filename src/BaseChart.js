import CoreComponent  from './CoreComponent';
import nopaneltemplate from './noPanelComponent.html';

export default class BaseChart extends CoreComponent {
    constructor(options) {
      super(options);
      this.animate = true;
      this.updateDivs(options);
      this.options = options;
      var template = options.template ? options.template : nopaneltemplate;
      super.debugMessage("chart template : " + template);
      try {
        this.template = $.templates(template);
      } catch (error) {
        //typically fails because jquery is not loaded in our unit tests
      }
    }
  
    setAnimation(flag) {
      this.animate = flag;
    }
  
    isAnimation() {
      return this.animate;
    }
  
    animate() {
      if (this.isAnimation()) {
        var animateOption = this.getOptions().animate;
        if (animateOption) {
          super.debugMessage("animating " + this.getDivId() + " : " + animateOption);
          animateDiv(this.getDivId(), animateOption);
        }
      }
    }
  
    getTypeOverride() {
      var chartOptions = this.getExtraOptions();
      if (chartOptions && chartOptions.type) {
        return chartOptions.type;
      } else {
        return null;
      }
    }
  
    updateDivs(options) {
      if (options.targetId && !options.parentDiv && !options.div) {
        options.parentDiv = options.targetId;
        options.div = options.parentDiv + "-chart";
      }
    }

    renderOuterComponent(template) {
      if (!$("#" + this.getDivId()).length && this.options.parentDiv) {
        super.debugMessage("Rendering template to div : " + this.options.parentDiv);
        $("#" + this.options.parentDiv).html(template.render(this.options));
      }
    }
  
    setTitle(options) {
      var id = "#" + this.getDivId() + "-title";
      $(id).html(options.title);
    }
  
    getDiv() {
      return "#" + this.getDivId();
    }
  
    getDivId() {
      return this.options.div;
    }
  
    reset() {
      $(this.getDiv()).hide();
    }
  
    show() {
      $("#" + this.options.parentDiv).show();
      $(this.getDiv()).show();
    }
  
    renderChart(data, clickFunction) {
      //implemented by subclasses
    }
  
    draw(onClick, callback) {
      this.renderChart(this.options.data, onClick);
      if (callback) {
        callback(this.options);
      }
      return this;
    }
  }
  