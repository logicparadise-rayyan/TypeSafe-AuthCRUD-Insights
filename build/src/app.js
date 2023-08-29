"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { DataSource } from "typeorm"
const database_1 = require("./Database/database");
const express_1 = __importDefault(require("express"));
const Todos_1 = require("./migrations/entities/Todos");
class App {
    constructor(routes) {
        this.dbConnected = false;
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3000;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }
    ;
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.AppDataSource.initialize()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const category1 = new Todos_1.Todos();
                category1.title = "TypeScript";
                category1.description = "hiiii";
                yield database_1.AppDataSource.manager.save(category1);
            }))
                .catch((error) => console.log("Error: ", error));
        });
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map