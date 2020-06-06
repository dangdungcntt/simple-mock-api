const fs = require("fs").promises;
const URL = require('url');

module.exports = {
    isValidStatusCode(statusCode) {
        return isNaN(Number(statusCode))
            ? false
            : (statusCode >= 100) & (statusCode <= 599);
    },
    getFullUrl(req) {
        return URL.format({
            protocol: req.protocol,
            host: req.header('host'),
            pathname: req.originalUrl
        })
    },
    getUserIp(req) {
        return req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip
    },
    async mkdirIfNotExists(dir) {
        try {
            await fs.stat(dir);
        } catch {
            await fs.mkdir(dir, {recursive: true});
        }
    },
};
