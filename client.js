const io = require('socket.io-client');
const forwardHttp = require('./utils/client.forwardHttp');
const md5 = require('md5');

module.exports = config => {
    const token = md5(config.token);

    const protocol = config.ssl ? 'wss:' : 'ws:';
    const domains = config.domains.join(',');
    const socket = io(`${protocol}//${config.serverAddr}:${config.serverPort}`, {
        path: config.path,
        query: {
            token,
            domains
        }
    });

    socket.on('server request', async proxyReq => {
        // parsedRequest@server => proxyReq
        let parsedResponse;
        try {
            parsedResponse = await forwardHttp(proxyReq, config);
        } catch (e) {
            // 本地请求出错对服务端对仅回复 id，用以释放连接
            socket.emit('client response', { id: proxyReq.id });
            console.log('problem with request: ' + e.message);
            return;
        }

        socket.emit('client response', parsedResponse);
    });

    socket.on('info', info => console.log(info));

    socket.on('disconnect', () => setTimeout(() => {
        console.log('server disconnected, reconnecting...')
        socket.open();
    }, 10000));
};
