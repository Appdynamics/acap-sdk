import BaseComponent  from '../BaseComponent';
import _filterComponentTemplate from './FilterDateRangeComponent.html';
import DateTimeRangeComponent from '../DateTimeRangeComponent/DateTimeRangeComponent';
import FilterComponent from '../FilterComponent/FilterComponent';

export default class FilterDateRangeComponent extends FilterComponent {
    constructor(options) {
        super(options);
        options.template = _filterComponentTemplate;
        this._biqFilters = [];
    }

    _drawFilterComponent(){
        new DateTimeRangeComponent({
            targetId: "daterange_container"
        }).draw();
    }
}