const http = require('http');
const { parseResponse } = require('./common.message');

module.exports = async (proxyReq, config) => {
    const { id, method, url, headers, body } = proxyReq;

    return new Promise((resolve, reject) => {
        const request = http.request({
            host: config.localAddr,
            port: config.localPort,
            path: url,
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
