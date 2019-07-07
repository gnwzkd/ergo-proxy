module.exports = json => JSON.parse(json, (key, value) => {
    if (value instanceof Object && value.type && value.type === 'Buffer') {
        return Buffer.from(value);
    }
    return value;
});
