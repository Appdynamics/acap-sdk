// var dateHelper = require('./DateHelper.js');
var Q = require('q');
var needle = require("needle");
import { getStartTime, getEndTime } from './DateHelper.js';
var minErrorCode = 400;
export default class AnalyticsManager {
    constructor(config, limit) {
        this.config = config;
        this.limit = limit || 10;
    }
    simpleQuery(query, callback) {

        var start = getStartTime();
        var end = getEndTime(start);
        this.analyticsQuery(query, start, end, 10, function (err, response) {
            callback(err, response);
        });
    }

    normalQuery(query, start, end, limit, callback) {
        this.analyticsQuery(query, start, end, limit, function (err, response) {
            callback(err, response);
        });
    }
    query(query, start, end, limit) {
        var deferred = Q.defer();
        this.analyticsQuery(query, start, end, limit, function (err, response) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }

    handleResponse(err, resp, parentCallBack) {
        if (err) {
            parentCallBack(err, null);
        } else {
            if (resp.statusCode >= minErrorCode) {
                parentCallBack(resp, null);
            } else {
                parentCallBack(null, resp);
            }
        }
    }


    analyticsQuery(query, start, end, limit, callback) {
        var AM = this;
       if(!limit) {
           limit = this.limit;
       }
        
        var url = this.config.analyticsUrl + "/events/query?start=" + start + "&end=" + end + "&limit=" + limit;
        var options = {
            method: 'POST',
            headers: {
                json: true,
                "Content-Type": 'application/vnd.appd.events+text;v=2',
                "X-Events-API-AccountName": this.config.globalKey,
                "X-Events-API-Key": this.config.accessKey,
                "Accept": "application/vnd.appd.events+json;v=2",
                "X-CSRF-TOKEN": "Content-type: application/vnd.appd.events+text;v=2"
            }
        };
        //addproxy(options);
        console.log(url);

        needle.post(url, query, options, function (err, resp) {
                
            if (resp.statusCode >= 300) {
                err = resp.statusCode + ' ' + resp.statusMessage;
                resp = null;
            } else {
                try {
                    var resp = JSON.parse(resp.body.toString());
                } catch (e) {
                    err = e.message;
                    resp = null;
                }
            }


            // if (this.config.restdebug) {
            //     try {
            //         logmessage("err :" + err);
            //         logmessage("resp :" + resp);
            //         logmessage(JSON.stringify(resp[0].results));
            //     } catch (e) {

            //     }
            // }
            AM.handleResponse(err, resp, callback);
        });


    }
}
// var analyticsQuery = function (query, start, end, limit, callback) {
//     var url = configManager.getAnalyticsUrl() + "/events/query?start=" + start + "&end=" + end + "&limit=" + limit;
//     var options = {
//         method: 'POST',
//         headers: {
//             json: true,
//             "Content-Type": 'application/vnd.appd.events+text;v=2',
//             "X-Events-API-AccountName": configManager.getGlobalAccount(),
//             "X-Events-API-Key": configManager.getAccessKey(),
//             "Accept": "application/vnd.appd.events+json;v=2",
//             "X-CSRF-TOKEN": "Content-type: application/vnd.appd.events+text;v=2"
//         }
//     };
//     //addproxy(options);


//     needle.post(url, query, options, function (err, resp) {
//         if (resp.statusCode >= 300) {
//             err = resp.status;
//             resp = null;
//         } else {
//             try {
//                 var resp = JSON.parse(resp.body.toString());
//             } catch (e) {
//                 err = e.message;
//                 resp = null;
//             }
//         }


//         if (config.restdebug) {
//             try {
//                 logmessage("err :" + err);
//                 logmessage("resp :" + resp);
//                 logmessage(JSON.stringify(resp[0].results));
//             } catch (e) {

//             }
//         }
//         handleResponse(err, resp, callback);
//     });
// }
// exports.simpleQuery = function (query, callback) {

//     var start = dateHelper.getStartTime();
//     var end = dateHelper.getEndTime(start);
//     analyticsQuery(query, start, end, 10, function (err, response) {
//         callback(err, response);
//     });
// }

// exports.normalQuery = function (query, start, end, limit, callback) {
//     analyticsQuery(query, start, end, limit, function (err, response) {
//         callback(err, response);
//     });
// }

// exports.query = function (query, start, end, limit) {
//     var deferred = Q.defer();
//     analyticsQuery(query, start, end, limit, function (err, response) {
//         if (err) {
//             deferred.reject(new Error(err));
//         } else {
//             deferred.resolve(response);
//         }
//     });
//     return deferred.promise;
// }

// exports.restUIADQL = function(query,start,end,limit){
// 	var deferred = Q.defer();
// 	restManager.restUIADQL(query,start,end,limit,function(err,response){
// 		if(err){
// 			deferred.reject(new Error(err));
// 		}else{
// 			deferred.resolve(response);
// 		}
// 	});
// 	return deferred.promise;
// }
