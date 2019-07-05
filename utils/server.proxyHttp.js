const session = require('./server.session');
const url = require('url');
const { parseRequest } = require('./common.message');

module.exports = async (req, res) => {
    const { hostname } = url.parse(`http://${req.headers.host}`);

    // HTTP 域名验证
    if (!session.getDomains().includes(hostname)) {
        res.statusCode = 502;
        res.end('Bad Gateway');
        return;
    }

    const { socket } = session.getSessionByDomainName(hostname) || {};

    if (!socket) return;

    let parsedRequest;
    try {
        parsedRequest = await parseRequest(req);
    } catch (e) {
        console.log('problem with request: ' + e.message);
        return;
    }

    socket.emit('server request', parsedRequest);

    socket.once('client response', response => {
        res.statusCode = response.statusCode;
        res.statusMessage = response.statusMessage;
        Object.keys(response.headers).forEach(key => res.setHeader(key, response.headers[key]));
        res.write(response.body);
        res.end();
    });
};
