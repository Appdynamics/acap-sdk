var needle = require("needle");
export default class RestUIManager {
    constructor(config) {
        this.config = config;
    }
    getPort() {
        var port = 8080;
        if (this.config.port) {
            port = this.config.port;
        } else {
            if (this.config.https) {
                port = 443;
            }
        }
        return port;
    }
    async fetchJSessionID(controller) {
        var svc = this;
        var str = "";
        var loginpath = '/controller/auth?action=login';
        var url = `${svc.getProtocol()}${controller}:${svc.getPort()}${loginpath}`;
        var options = {
            rejectUnauthorized: false,
            headers: {
                "Authorization": svc.getAuthString(),
            }
        };
        try {
            var resp = await needle('get', url, options);
        } catch (err) {
            return null;
        }

        var csrfToken = svc.getCSRFToken(resp);
        return { csrfToken: csrfToken, cookie: resp.headers['set-cookie']};


    }

    getAuthString() {
        var svc = this;
        return 'Basic ' + new Buffer.from(svc.config.restuser + "@" + svc.config.accountname + ":" + svc.config.restpassword).toString('base64');
    }
    getCSRFToken(response) {
        var rc = response.headers['set-cookie'];
        var csrfToken = null;
        rc.forEach(function (parts) {
            parts.split(";").forEach(function (cookieStr) {
                if (cookieStr.indexOf("X-CSRF-TOKEN") >= 0) {
                    csrfToken = cookieStr.split("=")[1];
                }
            });
        });
        return csrfToken;
    }
    async fetch(url) {
        var svc = this;
        var controller = svc.config.controller;
        var jsession = await svc.fetchJSessionID(controller);

        var str = "";

        var options = {
            rejectUnauthorized: false,
            headers: {
                "Cookie": jsession.cookie,
                "X-CSRF-TOKEN": jsession.csrfToken,
                "Accept": "application/json"
            }
        };
        try {
            var resp = await neeldle('GET', url, options);
        } catch(err) {
            resp = null;
        }
       
        return resp;
    }
    getProtocol() {
        var url;
        if (this.config.https) {
            url = "https://";
        } else {
            url = "http://";
        }
        return url;
    }
    async postUICall(postUrl, postData) {

        var svc = this;
        var controller = this.config.controller;
        var jsession = await svc.fetchJSessionID(controller);
        var options = {
            rejectUnauthorized: false,
            headers: {
                "Content-Type": "application/json",
                "Cookie": jsession.cookie,
                "X-CSRF-TOKEN": jsession.csrfToken
            }
        };
        var url = svc.getProtocol() + controller + ":" + svc.getPort() + postUrl;
        
        return needle('POST', url, postData, options);;
        
    }






}
