const penddingRequests = {};

const penddingRequest = {
    get: id => penddingRequests[id],
    add: (id, res) => penddingRequests[id] = res,
    remove: id => delete penddingRequests[id],
    resolve(proxyRes) {
        // client.parsedResponse => proxyRes
        const { id } = proxyRes;
        const res = penddingRequest.get(id);

        if (!res) return;
        
        if (proxyRes.statusCode) {
            res.writeHead(proxyRes.statusCode, proxyRes.statusMessage, proxyRes.headers);
            res.write(proxyRes.body);
        } else {
            // statusCode 不存在，客户端请求出错
            res.writeHead(521, 'Web server is down');
        }
        res.end();
        penddingRequest.remove(id);
    }
};

module.exports = penddingRequest;
