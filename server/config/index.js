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
            loggerPath: '/tmp'
        };
}

module.exports = config;
