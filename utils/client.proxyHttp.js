const http = require('http');
const { parseResponse } = require('./common.message');

module.exports = async (req, config) => {
    const { method, url, headers, body } = req;

    return new Promise((resolve, reject) => {
        const request = http.request({
            host: config.localAddr,
            port: config.localPort,
            path: url,
            method,
            headers
        }, async res => {
            resolve(await parseResponse(res));
        }).on('error', e => reject(e));

        request.write(body);
        request.end();
    });
}
