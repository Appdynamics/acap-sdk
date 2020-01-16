export default class CoreComponent {

    constructor(options) {
        this.options = options;
    }

    getOptions() {
        return this.options;
    }

    getChartOptions() {
        if (this.getOptions().options) {
            return this.getOptions().options;
        }
        if (this.getOptions().chartOptions) {
            return this.getOptions().chartOptions;
        }
    }
}
