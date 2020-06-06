const uuid = require("uuid").v4;
const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

module.exports = (req, res, next) => {
    let userId = req.query.userId || req.cookies.userId;

    if (!userId || !uuidRegex.test(userId)) {
        userId = uuid();
    }

    req.userId = userId;

    res.cookie("userId", userId, {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5, // 5 years
        httpOnly: true, // The cookie only accessible by the web server
        signed: false, // Indicates if the cookie should be signed
    });

    next();
};
