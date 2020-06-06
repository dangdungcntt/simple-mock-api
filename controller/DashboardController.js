const router = require("express").Router();

const RequestRepository = require("../repository/RequestRepository");
const LogRepository = require("../repository/LogRepository");

router.get(["/", "/requests/create"], async (req, res) => {
    try {
        let userRequests = await RequestRepository.findAllByUserId(req.userId);
        res.render("index", {
            userId: req.userId,
            userRequests,
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("error");
    }
});

router.get("/set-user", (req, res) => {
    return res.redirect("/");
});

router.post("/requests", async (req, res) => {
    try {
        let data = req.body;

        if (typeof data.timeout != "undefined") {
            let timeout = Number(data.timeout);
            timeout = 0 <= timeout && timeout <= 5000 ? timeout : 0;
        }

        let requestData = await RequestRepository.create(req.userId, data);

        if (requestData) {
            return res.redirect(`/requests/${requestData.id}/edit`);
        }

        res.status(500).render("error");
    } catch (err) {
        console.log(err);
        res.status(500).render("error");
    }
});

router.post("/requests/:id", async (req, res) => {
    try {
        let { id } = req.params;

        let requestData = await RequestRepository.findByUserIdAndRequestId(
            req.userId,
            id
        );

        if (!requestData) {
            return res.sendStatus(404);
        }

        let data = Object.assign({}, requestData, req.body);

        if (typeof data.timeout != "undefined") {
            let timeout = Number(data.timeout);
            timeout = 0 <= timeout && timeout <= 5000 ? timeout : 0;
        }

        if (await RequestRepository.update(req.userId, id, data)) {
            return res.redirect(`/requests/${id}/edit`);
        }

        res.status(500).render("error");
    } catch (err) {
        console.log(err);
        res.status(500).render("error");
    }
});

router.get("/requests/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;

        let userRequests = await RequestRepository.findAllByUserId(req.userId);

        let requestData = userRequests.find((request) => request.id == id);

        if (!requestData) {
            return res.sendStatus(404);
        }

        requestData.url = `${process.env.APP_URL}/api/${requestData.user_id}/${id}`;

        res.render("edit", {
            userId: req.userId,
            userRequests,
            requestData,
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("error");
    }
});

router.get(
    ["/requests/:id/logs", "/requests/:id/logs/:logId"],
    async (req, res) => {
        try {
            let { id, logId } = req.params;

            let requestData = await RequestRepository.findByUserIdAndRequestId(
                req.userId,
                id
            );

            if (!requestData) {
                return res.sendStatus(404);
            }

            requestData.url = `${process.env.APP_URL}/api/${requestData.user_id}/${id}`;

            let logs = (
                await LogRepository.findAllByUserIdAndRequestId(req.userId, id)
            ).reverse();

            let log = logId ? logs.find((log) => log.id == logId) : logs[0];

            res.render("log", {
                userId: req.userId,
                logs,
                log,
                requestData,
            });
        } catch (err) {
            console.log(err);
            res.status(500).render("error");
        }
    }
);

router.get("/health", (req, res) => {
    res.send("ok");
});

module.exports = router;
