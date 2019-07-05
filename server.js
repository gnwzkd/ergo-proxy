const url = require('url');
const session = require('./utils/server.session');
const proxyHttp = require('./utils/server.proxyHttp');
const server = require('http').createServer(proxyHttp);
const socketIO = require('socket.io');

module.exports = config => {
    const io = socketIO(server, { path: config.path, serveClient: false });

    server.listen({ host: config.listen, port: config.port }, () => {
        console.log(`app run at : http://${config.listen}:${config.port}`);
    });

    io.use((socket, next) => {
        // socket 域名验证
        const { hostname } = url.parse(`ws://${socket.handshake.headers.host}`);
        if (config.parked && hostname !== config.parked) {
            return next(new Error('invalid domain'));
        }
        // token 验证
        if (socket.handshake.query.token !== config.token) {
            return next(new Error('authentication error'));
        }
        return next();
    });

    io.on('connection', socket => {
        const domains = socket.handshake.query.domains.split(',');
        console.time('getDomains');
        const servedDomains = session.getDomains();
        console.timeEnd('getDomains');
        let exitDomains = [];
        // 域名查重
        domains.forEach(domain => {
            if (servedDomains.includes(domain)) {
                exitDomains.push(domain);
            }
        });
        if (exitDomains.length) {
            socket.emit('info', `domain ${exitDomains.join(', ')} exited.`);
            socket.disconnect(true);
            return;
        }

        // 添加会话
        console.time('addSession');
        session.addSession({
            socket,
            domains
        });
        console.timeEnd('addSession');

        // socket.on('send', data => console.log(data));

        // 断开连接删除会话
        socket.on('disconnect', reason => {
            console.time('removeSession');
            session.removeSession(socket.id);
            console.timeEnd('removeSession');
        });
    });
};
