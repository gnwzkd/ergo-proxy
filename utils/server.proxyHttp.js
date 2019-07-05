const uuid = require('uuid');
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

    const reqId = uuid();
    parsedRequest.id = reqId;
    socket.emit('server request', parsedRequest);

    const responseHandle = response => {
        if (response.id !== reqId) return;
        res.writeHead(response.statusCode, response.statusMessage, response.headers);
        res.write(response.body);
        res.end();
        socket.removeListener('client response', responseHandle);
    };
    socket.on('client response', responseHandle);
};
