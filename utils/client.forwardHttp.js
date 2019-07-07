const http = require('http');
const https = require('https');
const { parseResponse } = require('./common.message');
const whatProto = key => (({ http, https })[key] || http);

module.exports = async (proxyReq, config) => {
    const { id, method, url: path, headers, body } = proxyReq;
    const { localProtocol: protocol, localAddr: hostname, localPort: port } = config;

    return new Promise((resolve, reject) => {
        const request = (whatProto(protocol)).request({
            hostname,
            port,
            path,
            method,
            headers
        }, async res => {
            const parsedResponse = await parseResponse(res);
            parsedResponse.id = id;
            resolve(parsedResponse);
        }).on('error', e => reject(e));

        request.write(body);
        request.end();
    });
}
