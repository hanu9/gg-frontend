"use strict";

let config;
switch (process.env.NODE_ENV) {
    case "production":
        config =  {
            port: 3070,
            redis: {
                host: '172.21.24.22',
                port: 6379
            },
            host: "http://localhost:3070",
            loggerPath: '/data/logs'
        };
        break;
    case "staging":
        config = {
            port: 3070,
            redis: {
                host: '127.0.0.1',
                port: 6379
            },
            host: "http://localhost:3070",
            loggerPath: '/tmp'
        };
        break;
    default:
        config = {
            port: 3070,
            redis: {
                host: '127.0.0.1',
                port: 6379
            },
            oauth: {
                endpoint: 'https://accounts-uat.paytm.com',
                clientId: 'persona-test',
                clientSecret: 'ab1e2b70-1c69-4dad-bcc7-938c746096eb',
                scope: 'paytm',
                responseType: 'code',
                redirectURI: '/token'
            },
            goldenGate: {
                endpoint: 'https://goldengate.paytm.com'
            },
            host: "http://local.paytm.com",
            loggerPath: '/tmp'
        };
}

module.exports = config;
