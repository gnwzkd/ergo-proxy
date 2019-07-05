const sessions = [];

module.exports = {
    getSessions: () => sessions,
    getSessionBySocketId: id => sessions.find(session => session.socket.id === id),
    getSessionByDomainName: domain => sessions.find(session => session.domains.includes(domain)),
    getIds: () => sessions.map(session => session.socket.id),
    getDomains: () => Array.prototype.concat.apply([], sessions.map(session => session.domains)),
    addSession: session => sessions.push(session),
    removeSession(id) {
        sessions.splice(sessions.indexOf(this.getSessionBySocketId(id)), 1);
    }
};
