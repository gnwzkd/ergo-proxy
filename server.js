const url = require('url');
const session = require('./utils/server.session');
const http = require('http');
const forwardHttp = require('./utils/server.forwardHttp');
const { resolve: resolvePenddingRequest } = require('./utils/server.penddingRequest');
const socketIO = require('socket.io');
const md5 = require('md5');

module.exports = config => {
    const token = md5(config.token);
    
    const server = http.createServer(forwardHttp);
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
        if (socket.handshake.query.token !== token) {
            return next(new Error('authentication error'));
        }
        return next();
    });

    io.on('connection', socket => {
        console.log('client connected');
        const domains = socket.handshake.query.domains.split(',');
        const servedDomains = session.getDomains();
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
        session.addSession({
            socket,
            domains
        });

        // 客户端响应时回复请求
        socket.on('client response', resolvePenddingRequest);

        // 断开连接删除会话
        socket.on('disconnect', reason => {
            console.log('client disconnected');
            session.removeSession(socket.id);
        });
    });
};
