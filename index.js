require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nunjucks = require("nunjucks");
const app = express();

nunjucks.configure(["views/"], {
    // set folders with templates
    autoescape: true,
    express: app,
    watch: true,
});

app.set("views", __dirname + "/views");
app.set("view engine", "twig");

app.use(cookieParser(process.env.COOKIE_SECRET || "secret"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3406;

app.use("/api", require("./controller/ApiController"));

app.use(
    "/",
    require("./middleware/UserIdMiddleware"),
    require("./controller/DashboardController")
);

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log(`Running on port ${PORT}`);
});
