const nunjunks = require("nunjucks");
const uuid = require("uuid").v4;
const router = require("express").Router();

const Util = require("../util");

const RequestRepository = require("../repository/RequestRepository");
const RequestLogger = require("../services/RequestLogger");

router.all("/:userId/:id", async (req, res) => {

    let {userId, id} = req.params;

    let responseBody = undefined
    try {
        let requestData = await RequestRepository.findByUserIdAndRequestId(
            userId,
            id
        );

        if (!requestData) {
            return res.status(404).send("Request not found");
        }

        req.cleaned_headers = RequestLogger.cleanHeaders(req.headers)

        let defaultContentType = "html";
        responseBody = nunjunks.renderString(
            requestData.response_body || "",
            {
                query: req.query,
                body: req.body,
                headers: req.cleaned_headers,
            }
        );

        try {
            responseBody = JSON.parse(responseBody);
            defaultContentType = "json";
        } catch {
            //Do nothing
        }

        req.reqId = uuid();
        req.fullUrl = Util.getFullUrl(req);

        setTimeout(() => {
            res.header("X-Request-ID", req.reqId);
            res.contentType(requestData.content_type || defaultContentType);
            res.status(
                Util.isValidStatusCode(requestData.status_code)
                    ? requestData.status_code
                    : 200
            ).send(responseBody || "");
        }, requestData.timeout || 0);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

    try {
        RequestLogger.log(userId, id, req, responseBody);
    } catch (err) {
        console.log(err);
        //Do nothing when log error
    }
});

module.exports = router;
