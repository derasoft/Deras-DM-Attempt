//подключаем внешние библиотеки
const fs = require("fs");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

//подключаем конфигураторы и вспомогательные функции
const expr = require('./dep_config/expressConfig');
const dbhelp = require('./dep_config/db/dbHelpers');
const assFu = require('./dep_config/asistFunctions');

//подключаем роутеры
const authRouter = require("./pages/routers/auth");
const moduleRouter = require("./pages/routers/module");

//бойлерплейт чтобы работали POST-запросы
expr.app.use(expr.express.urlencoded({ extended: true }));
//инициализация объекта параметров
expr.app.use((req, res, next) => {
    res.params = {
        urlParams: res.params,
        title: 'Забыл заголовок, ротозей!',
        user: null
    }
    return next();
});
//проверка данных юзера
expr.app.use((req, res, next) => {
    if (req.cookies.userJWT === undefined) {
        return next();
    }
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        // const token =
        const token = req.cookies.userJWT;
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            if (req.cookies.userName === verified.userName) {
                res.params.user = {log: verified.userName, id: verified.userId};
                return next();
            }
            else {
                res = logout(res);
                return res.redirect('/login');
            }
        } else {
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
});
//получение списка модулей пользователя
expr.app.use(async (req, res, next) => {
    if (req.cookies.userJWT === undefined) return next();
    let mas = await dbhelp.getModulesOfUserAsMaster(res.params.user.id);
    let pla = await dbhelp.getModulesOfUserAsPlayer(res.params.user.id);
    for (let c1 in pla) {
        for (let c2 in mas) {
            if (pla[c1].id === mas[c2].id) {
                delete pla[c1];
            }
        }
    }
    for (let c in pla) {
        if (mas[c] === undefined) {
            pla.splice(c1, 1);
        }
    }
    res.params.modulesList = {asMaster: mas, asPlayer: pla};
    return next();
});

//роутер для различных действий, связанных авторизацией
expr.app.use('/auth', authRouter);
expr.app.use('/module', moduleRouter);

expr.app.get('/stub', (req, res) => {
    res.send("Я страница-заглушка. Если ты сюда попал, кто-то забыл добавить сюда страницу, либо она должна тут появиться в будущем.")
})
expr.app.get("/", async (req, res) => {
    res.render("index", res.params);
})

expr.app.use((req, res) => {
    res.status(404).render("errors/e404", res.params);
})
