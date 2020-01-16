import { BaseComponent } from '../BaseComponent';
import  template from './CustomComponent.html';


class CustomComponent extends BaseComponent {
    constructor(options) {
      options.hasChart = false;
      if (!options.template) {
        options.template = template;
      }
      super(options, null);
    }

}
export { CustomComponent }
