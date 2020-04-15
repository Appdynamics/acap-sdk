import _template from './HorizontalBarComponent.html';
import BaseComponent  from '../BaseComponent'
export default class HorizontalBarChart extends BaseComponent {
    constructor(options) {
        super(options);
        options.template = _template;

    }

}