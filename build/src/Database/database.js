"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Todos_1 = require("../migrations/entities/Todos");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "todolist",
    synchronize: true,
    logging: false,
    entities: [Todos_1.Todos],
    migrations: [],
    subscribers: [],
});
module.exports = exports.AppDataSource;
//# sourceMappingURL=database.js.map