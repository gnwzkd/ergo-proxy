module.exports = {
    async parseRequest(req) {
        const { url, headers, method } = req;

        return new Promise((resolve, reject) => {
            let body = [];
            req.on('data', chunk => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body);
                resolve({ method, url, headers, body });
            }).on('error', e => reject(e));
        });
    },
    async parseResponse(res) {
        const { statusCode, statusMessage, headers } = res;

        return new Promise(resolve => {
            let body = [];
            res.on('data', chunk => {
                body.push(chunk);
            });
            res.on('end', () => {
                body = Buffer.concat(body);
                resolve({ statusCode, statusMessage, headers, body });
            });
        });
    }
};
