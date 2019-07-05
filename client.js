const io = require('socket.io-client');
const proxyHttp = require('./utils/client.proxyHttp');

module.exports = config => {
    const protocol = config.ssl ? 'wss:' : 'ws:';
    const socket = io(`${protocol}//${config.serverAddr}:${config.serverPort}`, {
        path: config.path,
        query: {
            token: config.token,
            domains: config.domains.join(',')
        }
    });

    socket.on('server request', async req => {
        let parsedResponse;
        try {
            parsedResponse = await proxyHttp(req, config);
        } catch (e) {
            console.log('problem with request: ' + e.message);
            return;
        }

        socket.emit('client response', parsedResponse);
    });

    socket.on('info', info => console.log(info));
};
