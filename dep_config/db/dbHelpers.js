import { createRequire } from "module";
const require = createRequire(import.meta.url);
const db = require("./dbConnect")
const md5 = require('js-md5')

export async function getUserByNickname(nick) {
    let x =await db.Users.findOne({where: {log: nick}});
    if (x == null) return null
    else return x.dataValues;
}
export async function getModuleById(id) {
    let x = await db.Modules.findOne({where: {id: id}})
    if (x == null) return null;
    x = x.dataValues;
    x.rooms = await getListOfRoomsByIdArray(JSON.parse(x.rooms));
    x.data = JSON.parse(x.data);
    return x;
}
export async function getListOfRoomsByIdArray(arr) {
    let x = await db.Rooms.findAll({where: {id: arr}});
    if (x == null) return null;
    for (let c in x) {
        x[c] = x[c].dataValues;
    }
    return x;
}
export async function getPostsOfRoom(id) {
    let x = await db.Posts.findAll({where: {roomId: id}});
    if (x == null) return null;
    for (let c in x) {
        x[c] = x[c].dataValues;
    }
    return x;
}
export async function getRoomById(id) {
    let x = await db.Rooms.findOne({where: {id: id}});
    if (x == null) return null;
    else return x.dataValues;
}
export async function getModulesOfUserAsPlayer(id) {
    let x = await db.PlayersOfModules.findAll({where: {playerId: id}});
    if (x == null) return null;
    for (let c in x) {
        x[c] = x[c].dataValues.moduleId;
        x[c] = await getModuleById(x[c]);
    }
    return x;
}
export async function getModulesOfUserAsMaster(id) {
    let x = await db.Modules.findAll({where: {master: id}});
    if (x == null) return null;
    for (let c in x) {
        x[c] = x[c].dataValues;
    }
    return x;
}
export async function getPlayersOfModule(id) {
    let x = await db.PlayersOfModules.findAll({where: {moduleId: id}});
    let y = [];
    for (let c in x) {
        x[c] = {id: x[c].dataValues.playerId, charlist: x[c].dataValues.charlist}
        x[c].charlist = JSON.parse(x[c].charlist);
        y.push(x[c].id);
    }
    y = await db.Users.findAll({where: {id: y}});
    for (let c in x) {
        // x[c].log = y[c].dataValues.log;
        for (let c2 of y) {
            if (c2.dataValues.id === x[c].id) {
                x[c].log = c2.dataValues.log;
            }
        }
    }
    return x;

}
export async function getCharById(id) {
    let x = await db.PlayersOfModules.findByPk(id);
    let char = JSON.parse(x.charlist);
    return {
        id: x.dataValues.id,
        name: char.name,
        appearance: char.appearance,
        temper: char.temper,
        bio: char.bio,
        skills: char.skills,
    }
}
export async function publishNewPost(id, text) {
    let last = await db.Posts.max('order',
        {
            where: {roomId: id},
        })
    await db.Posts.create({
        roomId: id,
        order: last+1,
        content: text,
    })
}
export async function newUser(data) {
    await db.Users.create({
        log: data.log,
        pass: md5.hmac.hex('key', data.pass),
    });
}
export async function newModule(data) {
    await db.Modules.create({
        name: data.name,
        master: data.master,
        rooms: '[]',
        data: data.data,
        info: data.info,
    });
}
export async function newChar(data) {
    await db.PlayersOfModules.create({
        playerId: data.playerId,
        moduleId: data.moduleId,
        charlist: JSON.stringify(data.charlist),
    })
}