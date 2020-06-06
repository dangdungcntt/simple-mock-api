const LogRepository = require("../repository/LogRepository");
const Util = require("../util")
module.exports = {
    cleanHeaders(headers) {
        headers = {...headers};
        [
            'cdn-loop', 'cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-request-id', 'cf-visitor',
            'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-port', 'x-forwarded-proto', 'x-forwarded-server', 'x-real-ip', 'x-request-id'
        ].forEach(key => {
            delete headers[key]
        })
        return headers
    },
    async log(userId, id, req, responseBody) {
        return LogRepository.create(userId, id, {
            id: req.reqId,
            method: req.method,
            full_url: req.fullUrl,
            body: req.body,
            cleaned_headers: req.cleaned_headers,
            headers: req.headers,
            query: req.query,
            ip: Util.getUserIp(req),
            response_body: responseBody
        }).then(() =>
            LogRepository.clean(userId, id, process.env.MAX_LOG_ENTRIES)
        );
    },
};
