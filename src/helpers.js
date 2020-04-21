import $ from 'jquery';
var generateRandomTimeData = function (max, intervals, bucket, xmin, xmax) {
  if (!max) {
    max = 1000; //max y value
  }
  if (!intervals) {
    intervals = 14; //two weeks
  }
  if (!bucket) {
    bucket = "days"; // time interval is days
  }

  if (!xmin) {
    xmin = 0;
  }

  if (!xmax) {
    xmax = 0;
  }

  var date = new Date();
  var results = [];
  for (var i = 0; i < intervals; i++) {
    results.push([date.getTime(), Math.floor(Math.random() * max)]);
    if (bucket == "mins")
      date.setMinutes(date.getMinutes() - 1);
    if (bucket == "hrs")
      date.setHours(date.getHours() - 1);
    if (bucket == "days")
      date.setDate(date.getDate() - 1);
  }

  if (xmin > 0) {
    for (i = intervals - 1; i >= (intervals - xmin); i--) {
      var rec = results[i];
      rec[1] = 0;
    }
  }

  if (xmax != intervals) {
    for (i = 0; i < xmax; i++) {
      var rec = results[i];
      rec[1] = 0;
    }
  }

  return results;
};

var generateColumnData = function () {
  return [
    ["Normal", 1000],
    ["Slow", 2000],
    ["Very Slow", 3000],
    ["Error", 4000],
    ["Stall", 500]
  ];
};

var defaultColorPattern = ['#2ca02c', '#1f77b4', '#ff7f0e', '#d62728', '#9467bd'];

var animateDiv = function (div, animate) {
  $("#" + div).addClass("animated " + animate);
};


var _debugCAP = true;
var _debugTargetId = null;

function appLogCompObject(comp, obj) {
  if (_debugCAP) {
    if(!_debugTargetId && _debugTargetId != comp.getTargetId()){
      return;
    }
    try {
      console.log(comp.getDivId() + " object : " + JSON.stringify(obj));
    } catch (error) {
      console.log(obj);
    }
  }
}

function appLogCompMessage(comp, message) {
  if (_debugCAP) {
    if(!_debugTargetId && _debugTargetId != comp.getTargetId()){
      return;
    }
    try {
      console.log(comp.getDivId() + " : " + message);
    } catch (error) {
      console.log(message);
    }
  }
}

var formatDateLong = function (d) {
  var datestring = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
  return datestring;
}

function appLogMessage(message){
  if(_debugCAP){
      console.log(message);
      if(message.start || message.end){
          console.log("start: "+formatDateLong(new Date(message.start))+" end: "+formatDateLong(new Date(message.end)));
      }
  }
}

function appLogObject(obj){
  if(_debugCAP){
      console.log(JSON.stringify(obj));
      if(obj.start || obj.end){
          console.log("start: "+formatDateLong(new Date(obj.start))+" end: "+formatDateLong(new Date(obj.end)));
      }
  }
}


var biqUpdateQuery = function (options, query, filters) {
  console.log(filters);
  if (options.ignoreFilters) {
    return query;
  } else {
    if (filters && filters.length > 0) {
      var orderByPos = query.toLowerCase().indexOf("order by");
      var preQuery, postQuery = "";

      if (orderByPos > 0) {
        preQuery = query.substring(0, orderByPos);
        postQuery = query.substring(orderByPos, query.length);
      } else {
        preQuery = query;
      }
      var hasWhere = false;
      if (preQuery.toLowerCase().indexOf("where") > 0) {
        hasWhere = true;
      }

      if (!hasWhere) {
        preQuery += " WHERE ";
      }

      for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        if (!hasWhere && index == 0) {
          preQuery += filter.field + " = '" + filter.value + "'";
        } else {
          preQuery += " AND " + filter.field + " = '" + filter.value + "'";
        }
      }

      if (postQuery.length > 1) {
        return preQuery + " " + postQuery;
      } else {
        return preQuery;
      }
    } else {
      return query;
    }
  }
}

var SI_PREFIXES = ["", "K", "M", "G", "T", "P", "E"];

function abbreviateNumber(number) {
  // what tier? (determines SI prefix)
  var tier = (Math.log10(number) / 3) | 0;

  // if zero, we don't need a prefix
  if (tier == 0) return number;

  // get prefix and determine scale
  var prefix = SI_PREFIXES[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add prefix as suffix
  return scaled.toFixed(1) + prefix;
}







var hideElements = function (elems) {
  if (elems) {
    elems.forEach(function (elem) {
      $("#" + elem).hide();
    });
  }
};

var showElements = function (elems) {
  if (elems) {
    elems.forEach(function (elem) {
      $("#" + elem).show();
    });
  }
}


var roundValue = function (value) {
  return Math.round(value * 10) / 10;
}



export { roundValue, hideElements, showElements, biqUpdateQuery, appLogCompObject, appLogCompMessage, appLogMessage, appLogObject, abbreviateNumber, generateRandomTimeData, generateColumnData, animateDiv }