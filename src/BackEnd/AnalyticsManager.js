// var dateHelper = require('./DateHelper.js');
var Q = require('q');
var needle = require("needle");
import { getStartTime, getEndTime } from './DateHelper.js';
var util = require('util');
var minErrorCode = 400;

const winston = require('winston');
 

 

export default class AnalyticsManager {
    constructor(config, limit) {
        this.config = config;
        this.limit = limit || 10;
        this.logger = winston.createLogger({
            level: config.loglevel || 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'AnalyticsManager' },
            transports: [
              new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
              new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
          });


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
        AM.logger.debug("Analytics URL", {url: url});
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
        AM.logger.debug("Analytics Request Options", options);


        needle.post(url, query, options, function (err, resp) {
            if(resp) {
                AM.logger.debug("Analytics response", resp.body);
            } else if(err) {
                AM.logger.error("Analytics Manager Error when making request", err);
            } else {
                AM.logger.error('Missing Response: Both Error and Response are missing.');
            }
            

            if (resp && resp.statusCode >= 300) {
                AM.logger.error("Analytics Manager Error when making request", resp);
                err = resp.statusCode + ' ' + resp.statusMessage;
                resp = null;
            } else if(resp){
                try {
                    var resp = JSON.parse(resp.body.toString());
                } catch (e) {
                    //err = e.message;
                    resp = null;
                }
            } 

            AM.handleResponse(err, resp, callback);
        });


    }
}
