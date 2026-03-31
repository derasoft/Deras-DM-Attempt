import { createRequire } from "module";
import { fileURLToPath } from 'url';
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const path = require('path');
export const express = require('express');
const expressHbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const hbs_helpers = require('../pages/helpers/hbs_helpers');

export const app = express();
app.listen(80);
export const urlencodedParser = express.urlencoded({extended: false});
export const jsonParser = express.json();
app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "pages/layouts",
        defaultLayout: "layout",
        extname: "hbs",
        helpers: hbs_helpers,
        partialsDir: path.join(__dirname, "..", "pages", "parts"),
    }
))
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "pages"));
app.set('view options', {'layouts': false});
app.use('/static', express.static(path.join(__dirname, "..", 'static')));
app.use(cookieParser());