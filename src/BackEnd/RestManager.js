var needle = require("needle");
var minErrorCode = 400;
const winston = require('winston');
export default class RestManager {
    constructor(config) {
        this.config = config;
        this.apiauth = {
            access_token: null,
            expires_in: 0,
            expires_at: new Date()
        };
        this.logger = winston.createLogger({
            level: config.loglevel || 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'RestManager' },
            transports: [
              new winston.transports.File({ filename: 'error.log', level: 'error' }),
              new winston.transports.File({ filename: 'combined.log' }),
            ],
          });
    }
    authorized() {
        var now = new Date();
        let is_authorized = this.apiauth.access_token && this.apiauth.expires_at < now;
        this.logger.debug("Is Authorized", is_authorized);
        return is_authorized;
    }
    post(endpoint,data) {
        var url = this.getControllerUrl() + endpoint;
        var options = {
            headers: {
                json: true,
                "Authorization": "Bearer " + this.apiauth.access_token,
                "Content-Type": 'application/vnd.appd.cntrl+protobuf;v=1'
            }
        };
        this.logger.debug("POST URL", url);
        this.logger.debug("POST Options", options);
        return needle('post', url, data, options);
    }
    get(endpoint) {
        var url = this.getControllerUrl() + endpoint;
        var options = {
            headers: {
                json: true,
                "Authorization": "Bearer " + this.apiauth.access_token,
                "Content-Type": 'application/vnd.appd.cntrl+protobuf;v=1'
            }
        };
        this.logger.debug("GET URL", url);
        this.logger.debug("GET Options", options);
        return needle('get', url, options);
    }
    async restAPI(method, endpoint, data) {
        if (!this.authorized()) {
            await this.generateToken();

        }
        if(method.toUpperCase() === 'GET') {
            return this.get(endpoint);
        } else {
            return this.post(endpoint, data)
        }
    }
    async generateToken() {
        var RM = this;

        var url = this.getControllerUrl() + '/controller/api/oauth/access_token';
        var options = {
            headers: {
                json: true,
                "Content-Type": 'application/vnd.appd.cntrl+protobuf;v=1'
            }
        };
        t

        var postdata = {
            grant_type: 'client_credentials',
            client_id: this.config.client_id + "@" + this.config.accountname,
            client_secret: this.config.client_secret

        }
        const resp = await needle('post', url, postdata, options);
       
        if(resp.statusCode >= 300){
            console.log("options:");
            console.log(JSON.stringify(options));
            console.log("post:");
            console.log(JSON.stringify(postdata));
            
            throw "Error Fetching Token : Resp Code :"+resp.statusCode+" Message: "+resp.statusMessage;
        }
        RM.apiauth = JSON.parse(resp.body);
        var expirydate = new Date();
        expirydate.setSeconds(expirydate.getSeconds() + RM.apiauth.expires_in);
        RM.apiauth.expires_at = expirydate;
    }


    getControllerUrl() {
        let url = this.config.controller;
        if(url && url.toLowerCase().startsWith("http")){
            return url;
        }
        return "https://" + this.config.controller;
    }
}
