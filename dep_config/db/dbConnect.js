import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
export const Sequelize = require("sequelize");

export const db = new Sequelize({
    dialect: "sqlite",
    storage: "db.db",
    logging: () => {},
    define: {
        timestamps: false,
    }
});

export const Users = db.define("users", {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    log: {type: Sequelize.STRING, allowNull: false},
    pass: {type: Sequelize.STRING},
});
export const Modules = db.define("modules", {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    name: {type: Sequelize.STRING, allowNull: false},
    master: {type: Sequelize.INTEGER},
    rooms: {type: Sequelize.STRING},
    data: {type: Sequelize.STRING},
    info: {type: Sequelize.STRING},
});
export const Rooms = db.define("rooms", {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    name: {type: Sequelize.STRING, allowNull: false},
    moduleId: {type: Sequelize.INTEGER, allowNull: false},
    posts: {type: Sequelize.STRING},
    isClosed: {type: Sequelize.BOOLEAN},
    players: {type: Sequelize.STRING},
});
export const Posts = db.define("posts", {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    roomId: {type: Sequelize.INTEGER, allowNull: false},
    authorId: {type: Sequelize.INTEGER, allowNull: false},
    order: {type: Sequelize.INTEGER, allowNull: false},
    content: {type: Sequelize.STRING},
})
export const PlayersOfModules = db.define("playersOfModules", {
   playerId: {type: Sequelize.INTEGER, allowNull: false},
   moduleId: {type: Sequelize.INTEGER, allowNull: false},
   charlist: {type: Sequelize.STRING},
});
export const WatchersOfModules = db.define("WatchersOfModules", {
    playerId: {type: Sequelize.INTEGER, allowNull: false},
    moduleId: {type: Sequelize.INTEGER, allowNull: false},
});

// Results will be an empty array and metadata will contain the number of affected rows.
// db.sync({alter: true});
// db.sync({force: true});