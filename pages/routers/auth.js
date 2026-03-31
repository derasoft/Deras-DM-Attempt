const md5 = require("js-md5");
const jwt = require("jsonwebtoken");
const dayInMilliseconds = 86400000;

const assFu = require('../../dep_config/asistFunctions');
const dbhelp = require("../../dep_config/db/dbHelpers");
const expr = require("../../dep_config/expressConfig");
const router = expr.express.Router();

router.route("/reg")
    .get((req, res) => {
    res.params.title = "Регистрация";
    res.render("forms/registration", res.params);
})
    .post(async (req, res) => {
    let check = await dbhelp.getUserByNickname(req.body.log);
    if (check) {
        res.send("Такой пользователь уже существует");
    }
    else {
        let data = {
            log: req.body.log,
            pass: req.body.pass,
        }
        await dbhelp.newUser(data);
        res.redirect("/");
    }
})
router.get("/logout", async (req, res) => {
    res = assFu.logout(res);
    res.redirect("/");
})
router.route("/log")
    .get((req, res) => {
    res.params.title = "Вход";
    res.render("forms/login", res.params);
})
    .post(async (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let user = await dbhelp.getUserByNickname(req.body.log);
    if (user.pass !== md5.hmac(process.env.PASS_KEY, req.body.pass)) {
        res.send('Неверные данные');
    } else {
        let data = {
            time: Date(),
            userId: user.id,
            userName: user.log,
        };
        const token = jwt.sign(data, jwtSecretKey);
        res.cookie('userJWT', token, {maxAge: 365 * dayInMilliseconds});
        res.cookie('userName', user.log, {maxAge: 365 * dayInMilliseconds});
        res.redirect("/");
    }
})

module.exports = router;