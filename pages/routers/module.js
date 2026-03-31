const assFu = require('../../dep_config/asistFunctions');
const dbhelp = require("../../dep_config/db/dbHelpers");
const expr = require("../../dep_config/expressConfig");
const router = expr.express.Router();

router.route('/newModule')
    .get((req, res) => {
        res.params.edModule = {
            name: '',
            info: '',
        }
        res.render('forms/moduleEditor', res.params);
    })
    .post(async (req, res) => {
        let data = {
            name: req.body.name,
            master: res.params.user.id,
            data: '{}',
            info: req.body.info,
        };
        await dbhelp.newModule(data);
        res.redirect('/');
    })
router.route("/:moduleId/joinModule")
    .get(async (req, res) => {
        res.params.editor = {
            subtitle: 'Новый персонаж',
            moduleId: Number(req.params.moduleId),
            sendText: 'Отправить',
        }
        res.params.char = {id: null, name: 'Предзаявка', appearance: '', temper: '', bio: '', skills: '',};
        res.render('forms/charEditor.hbs', res.params);
    })
    .post(async (req, res) => {
        let data = {
            playerId: res.params.user.id,
            moduleId: req.body.moduleId,
            charlist: {
                name: req.body.name,
                appearance: req.body.appearance,
                temper: req.body.temper,
                bio: req.body.bio,
                skills: req.body.skills,
            },
        };
        await dbhelp.newChar(data);
        res.redirect('/module/' + data.moduleId);
    })
router.post("/sendPost", async (req, res) => {
    await dbhelp.publishNewPost(req.body.roomId, req.body.text);
    res.redirect('/module/room/' + req.body.roomId);
})
router.get("/:moduleId/room/:roomId", async (req, res) => {
    res.params.room = await dbhelp.getRoomById(req.params.roomId);
    if (res.params.room === null) {
        return res.status(404).render('errors/e404')
    }
    if ((Number(req.params.moduleId) !== res.params.room.moduleId)) {
        return res.status(400).render('errors/e400')
    }
    res.params.module = await dbhelp.getModuleById(req.params.moduleId);
    res.params.posts = await dbhelp.getPostsOfRoom(req.params.roomId);
    res.params.title = res.params.room.name;
    res.render("room", res.params);
})
router.get('/:moduleId/players', async (req, res) => {
    res.params.players = await dbhelp.getPlayersOfModule(req.params.moduleId);
    res.render('players', res.params);
})
router.get("/:moduleId", async (req, res) => {
    res.params.module = await dbhelp.getModuleById(Number(req.params.moduleId));
    if (res.params.module === null) {
        return res.status(404).render('errors/e404');
    }
    res.params.players = await dbhelp.getPlayersOfModule(Number(req.params.moduleId));
    res.params.layout = 'layout';
    res.params.title = module.name;
    res.render("module", res.params);
})

module.exports = router;