const crypto = require('crypto');

module.exports = {
    encrypt: (plainText, key, iv) => {
        let cipherText = '';
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        cipherText += cipher.update(plainText, 'utf8', 'hex');
        cipherText += cipher.final('hex');
        return cipherText;
    },
    decrypt: (cipherText, key, iv) => {
        let plainText = '';
        const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        plainText += cipher.update(cipherText, 'hex', 'utf8');
        plainText += cipher.final('utf8');
        return plainText;
    }
};
