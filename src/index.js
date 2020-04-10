import  BaseComponent  from './BaseComponent';
import  CustomComponent  from './CustomComponent/CustomComponent';
import BoxChartComponent from './BoxChartComponent/BoxChartComponent';
import { PieChart, PieChartComponent } from './PieChartComponent/PieChartComponent';
import { Table, TableComponent} from './TableComponent/TableComponent';
import { DonutChart, DonutChartComponent} from './DonutChartComponent/DonutChartComponent';
import { TimeChart, TimeChartComponent} from './TimeChartComponent/TimeChartComponent';
import FilterComponent from './FilterComponent/FilterComponent';
import TimeRangeComponent from './TimeRangeComponent/TimeRangeComponent';
import SankeyChart from './SankeyChart/SankeyChart';
import TimeLineComponent from './TimeLineComponent/TimeLineComponent';
import { Location, GeoMapComponent} from './GeoMapComponent/GeoMapComponent';
import { BarChartComponent, BarChart} from './BarChartComponent/BarChartComponent';
import BoxComponent from './BoxComponent/BoxComponent';

import  { hideElements, showElements, biqUpdateQuery, debug, abbreviateNumber, generateRandomTimeData, generateColumnData, animateDiv  } from './helpers';
import { startDate, getSelectedTimeDescription, getTimeBucketFromDate, jsonDates, getTimeRange, getTimeRangeStartingFromDate, getTimeRangeBasedOnSelection, applyTimeBasedOnSelection,  applyTimeForSelection, getTimeBucket, updateDateBasedOnSelection, getTimeBucketAsMinutes, stopAnim, startAnim, appLog, replaceNulls,  postQuery, makeGetCall, makePostCall, getHealthColor, lookup, lookupArray, endDate, copyTextToClipBoard, roundValue, escapeQuery, shortTime, formatDateLong, formatDate,getDateTimeRangeDescription, includeClauses, numberClause, stringClause, getTimeRangeText, autoCompleteOnFilter,buildQueryForAutoCompleteOnFilter, autoComplete, autoCompleteArray, openAdql} from './biq-app.js';

import $ from 'jquery';
require('imports-loader?window.jQuery=jquery!../node_modules/jsrender/jsrender.min.js');
require('imports-loader?window.jQuery=jquery!../node_modules/datatables/media/js/jquery.dataTables.min.js');
import tablecss from '../node_modules/datatables/media/css/jquery.dataTables.min.css';
import fontawesome5 from '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import fontawesome4 from '../node_modules/font-awesome/css/font-awesome.min.css';

import d3 from '../node_modules/d3/dist/d3.min.js';

import bb from '../node_modules/billboard.js/dist/billboard.min.js';
import bbcss from '../node_modules/billboard.js/dist/billboard.min.css';

import bootstrap from '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import bootstrapcss from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import appdynamics_bootstrap_css from './css/appdynamics_bootstrap.css';

export { openAdql, Location, GeoMapComponent, DonutChart, DonutChartComponent, BarChartComponent, BarChart, BoxComponent, FilterComponent, Table, TableComponent, 
        PieChart, PieChartComponent, BoxChartComponent, BaseComponent, CustomComponent, 
        TimeChartComponent, TimeChart, SankeyChart,TimeRangeComponent, TimeLineComponent,
        biqUpdateQuery, debug, abbreviateNumber, generateRandomTimeData, generateColumnData, animateDiv,
        hideElements, showElements, getSelectedTimeDescription, getTimeBucketFromDate, jsonDates, getTimeRange, 
        getTimeRangeStartingFromDate, getTimeRangeBasedOnSelection, applyTimeBasedOnSelection,  applyTimeForSelection, 
        getTimeBucket, updateDateBasedOnSelection, getTimeBucketAsMinutes, stopAnim, startAnim, appLog, replaceNulls,  
        postQuery, makeGetCall, makePostCall, getHealthColor, lookup, lookupArray, startDate, endDate, copyTextToClipBoard, 
        roundValue, escapeQuery, shortTime, formatDateLong, formatDate,getDateTimeRangeDescription, includeClauses, numberClause, 
        stringClause, getTimeRangeText, autoCompleteOnFilter,buildQueryForAutoCompleteOnFilter, autoComplete, autoCompleteArray}