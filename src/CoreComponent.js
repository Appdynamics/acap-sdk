
import { appLogCompMessage, appLogCompObject } from './helpers';

export default class CoreComponent {

    constructor(options) {
        this.options = options;
    }

    getOptions() {
        return this.options;
    }

    getExtraOptions() {
        if (this.getOptions().options) {
            return this.getOptions().options;
        }
        if (this.getOptions().chartOptions) {
            return this.getOptions().chartOptions;
        }
    }

    applyExtraOptions(chartOptions) {
        var overrideOptions = this.getExtraOptions();
        if (overrideOptions) {
            for (var key in overrideOptions) {
                chartOptions[key] = overrideOptions[key];
            }
        }
        this.debugObject(chartOptions);
    }

    debugObject(obj){
        appLogCompObject(this,obj);
    }

    debugMessage(message){
        appLogCompMessage(this,message);
    }
}
