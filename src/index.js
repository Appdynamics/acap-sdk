import  BaseComponent  from './BaseComponent';
import  CustomComponent  from './CustomComponent/CustomComponent';
import BoxChartComponent from './BoxChartComponent/BoxChartComponent';
import { PieChart, PieChartComponent } from './PieChartComponent/PieChartComponent';
import { Table, TableComponent} from './TableComponent/TableComponent';
import { DonutChart, DonutChartComponent} from './DonutChartComponent/DonutChartComponent';
import { TimeChart, TimeChartComponent} from './TimeChartComponent/TimeChartComponent';
import FilterComponent from './FilterComponent/FilterComponent';
import FilterDateRangeComponent from './FilterDateRangeComponent/FilterDateRangeComponent';
import TimeRangeComponent from './TimeRangeComponent/TimeRangeComponent';
import DateTimeRangeComponent from './DateTimeRangeComponent/DateTimeRangeComponent';
import SankeyChart from './SankeyChart/SankeyChart';
import TimeLineComponent from './TimeLineComponent/TimeLineComponent';
import { Location, GeoMapComponent} from './GeoMapComponent/GeoMapComponent';
import { BarChartComponent, BarChart} from './BarChartComponent/BarChartComponent';
import BoxComponent from './BoxComponent/BoxComponent';
import DropList from './DropList/DropList';

import  { hideElements, showElements, biqUpdateQuery, appLogCompObject, appLogCompMessage, appLogMessage, appLogObject, abbreviateNumber, generateRandomTimeData, generateColumnData, animateDiv  } from './helpers';
import { startDate, getSelectedTimeDescription, getTimeBucketFromDate, jsonDates, getTimeRange, getTimeRangeStartingFromDate, getTimeRangeBasedOnSelection, applyTimeBasedOnSelection,  applyTimeForSelection, getTimeBucket, updateDateBasedOnSelection, getTimeBucketAsMinutes, stopAnim, startAnim, replaceNulls,  postQuery, makeGetCall, makePostCall, getHealthColor, lookup, lookupArray, endDate, copyTextToClipBoard, roundValue, escapeQuery, shortTime, formatDateLong, formatDate,getDateTimeRangeDescription, includeClauses, numberClause, stringClause, getTimeRangeText, autoCompleteOnFilter,buildQueryForAutoCompleteOnFilter, autoComplete, autoCompleteArray, openAdql} from './biq-app.js';

import $ from 'jquery';
require('imports-loader?window.jQuery=jquery!../node_modules/jsrender/jsrender.min.js');
require('imports-loader?window.jQuery=jquery!../node_modules/datatables/media/js/jquery.dataTables.min.js');
import tablecss from '../node_modules/datatables/media/css/jquery.dataTables.min.css';
import fontawesome5 from '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import fontawesome4 from '../node_modules/font-awesome/css/font-awesome.min.css';

import moment from '../node_modules/moment/moment.js';

import d3 from '../node_modules/d3/dist/d3.min.js';

import bb from '../node_modules/billboard.js/dist/billboard.min.js';
import bbcss from '../node_modules/billboard.js/dist/billboard.min.css';

import bootstrap from '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import bootstrapcss from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import appdynamics_bootstrap_css from './css/appdynamics_bootstrap.css';

import multipleselect from '../node_modules/multiple-select/dist/multiple-select.min.js';
import multipleselectcss from '../node_modules/multiple-select/dist/multiple-select.min.css';
import multipleselectbootstrapcss from '../node_modules/multiple-select/dist/themes/bootstrap.min.css';

export { openAdql, Location, GeoMapComponent, DonutChart, DonutChartComponent, BarChartComponent, BarChart, BoxComponent, FilterComponent, FilterDateRangeComponent, Table, TableComponent, 
        PieChart, PieChartComponent, BoxChartComponent, BaseComponent, CustomComponent, 
        TimeChartComponent, TimeChart, SankeyChart,TimeRangeComponent, DateTimeRangeComponent, TimeLineComponent, DropList,
        biqUpdateQuery, abbreviateNumber, generateRandomTimeData, generateColumnData, animateDiv,
        hideElements, showElements, getSelectedTimeDescription, getTimeBucketFromDate, jsonDates, getTimeRange, 
        getTimeRangeStartingFromDate, getTimeRangeBasedOnSelection, applyTimeBasedOnSelection,  applyTimeForSelection, 
        getTimeBucket, updateDateBasedOnSelection, getTimeBucketAsMinutes, stopAnim, startAnim, appLogMessage, appLogObject, appLogCompMessage, appLogCompObject, replaceNulls,  
        postQuery, makeGetCall, makePostCall, getHealthColor, lookup, lookupArray, startDate, endDate, copyTextToClipBoard, 
        roundValue, escapeQuery, shortTime, formatDateLong, formatDate,getDateTimeRangeDescription, includeClauses, numberClause, 
        stringClause, getTimeRangeText, autoCompleteOnFilter,buildQueryForAutoCompleteOnFilter, autoComplete, autoCompleteArray}