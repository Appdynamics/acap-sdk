import BaseComponent  from '../BaseComponent';
export default class BoxComponent extends BaseComponent {
    constructor(options) {
      if (!options.action) {
        options.action = options.title;
      }
      options.hasChart = false;
      if(!options.cardStyle){
        options.cardStyle = "card";
      }
      super(options, null);
    }
  
    draw(onClick, callback) {
      var options = super.getOptions();
      $("#" + options.targetId).html(
        $.templates(_boxComponentTemplate).render(options)
      );
      if (options.animate) {
        animateDiv(options.targetId, options.animate);
      }
    }
  }
  