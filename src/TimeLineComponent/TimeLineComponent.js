import BaseChart from '../BaseChart';
import  TimelinesChart from 'timelines-chart';

export default class TimeLineComponent extends BaseChart {
    constructor(options) {
      options.div = options.targetId;
      super(options);
    }
  
    getRandomData(ordinal = false) {
      const NGROUPS = 4,
      MAXLINES = 5,
      MAXSEGMENTS = 5,
      MAXCATEGORIES = 5;
      var lastTwoWeeks = new Date(Date.now() - (24 * 60 * 60 * 1000 * 14));
      const MINTIME = lastTwoWeeks;
    
      const nCategories = Math.ceil(Math.random()*MAXCATEGORIES),
      categoryLabels = ['Normal','Slow','Very Slow','Stall','Error'];
  
      var chartOptions = super.getExtraOptions();
      
      var groupLabels = chartOptions.groupLabels;
      if(!groupLabels){
        groupLabels = [{app:"App1",bts:["BT1","BT2","BT3","BT4","BT5"]},{app:"App2",bts:["BT6","BT7","BT8","BT9","BT10"]},{app:"App3",bts:["BT11","BT12","BT13","BT14","BT15"]},{app:"App4",bts:["BT16","BT17","BT18","BT19","BT20"]}];
      }
  
      var nSegments = Math.ceil(Math.random()*MAXSEGMENTS);
      var runLength = MINTIME;
  
      //duration of the activity
      var duration = chartOptions.activityDuration;
      if(!duration){
        duration = 10000; //10 seconds
      }
  
      //wether the activitiy is random or more like a real user where things are sequential
      var sequential = chartOptions.sequential;
      if(!sequential){
        sequential = false;
      }else{
        sequential = true;
      }
  
      return [...Array(NGROUPS).keys()].map(i => ({
        group: groupLabels[i].app,
        data: getGroupData(groupLabels[i])
      }));
    
      function getGroupData(group) {
  
        return [...Array(Math.ceil(Math.random()*MAXLINES)).keys()].map(i => ({
          label: group.bts[i],
          data: getSegmentsData()
        }));
  
        function getSegmentsData() {
          
          if(!sequential){
            nSegments = Math.ceil(Math.random()*MAXSEGMENTS);
            var segMaxLength = Math.round(((new Date())-MINTIME)/nSegments);
            runLength = MINTIME;
          }
  
          return [...Array(nSegments).keys()].map(i => {
  
            var timeLengths;
            if(sequential){
              var len1 = Math.floor(Math.random() * duration) + 1 ;
              var len2 = Math.floor(Math.random() * duration) + 1 ;
              timeLengths = [len1,len2];
            }else{
              const tDivide = [Math.random(), Math.random()].sort();
              var len1 = tDivide[0]*segMaxLength;
              var len2 = tDivide[1]*segMaxLength;
              timeLengths = [len1,len2];
            }
  
            
            timeLengths.sort(function(a,b){
              return a-b;
            });
  
            var start = new Date(runLength.getTime() + timeLengths[0]);
            var end = new Date(runLength.getTime() + timeLengths[1]);
  
            if(sequential){
              runLength = new Date(runLength.getTime() + timeLengths[0]+timeLengths[1]);
            }else{
              runLength = new Date(runLength.getTime() + Math.round(((new Date())-MINTIME)/nSegments));
            }
  
            var cat = Math.ceil(Math.random()*nCategories)-1;
            var catLabel = categoryLabels[cat];
            return { timeRange: [start, end],val: catLabel};
          });
  
        }
      }
    }
  
    generateSampleData() {
      return this.getRandomData(true);
    }
  
    renderChart(onClick) {
      var id = super.getDivId();
      var data = this.getOptions().data;
      if (!data) {
        data = this.generateSampleData();
      }
  
      var chartOptions = super.getExtraOptions();
  
      TimelinesChart()(document.getElementById(id))
      .maxLineHeight(chartOptions.maxLineHeight)
          .maxHeight(chartOptions.height)
          .width(chartOptions.width)
          .zScaleLabel(chartOptions.scaleLabel)
          .zQualitative(true)
      .dateMarker(new Date() - 365 * 24 * 60 * 60 * 1000) // Add a marker 1y ago
      .zColorScale(d3.scaleOrdinal().domain(['Normal','Slow','Very Slow','Error','Stall']).range(['green', 'yellow', 'orange','red','purple']))
          .data(data);
    }
  }
  