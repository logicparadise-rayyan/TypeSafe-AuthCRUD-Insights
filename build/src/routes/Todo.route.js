"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Todo_controller_1 = __importDefault(require("../controller/Todo.controller"));
class TodoRoute {
    constructor() {
        this.path = 'localhost:3000/';
        this.router = (0, express_1.Router)();
        this.todoController = new Todo_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.todoController.getTodo);
    }
}
exports.default = TodoRoute;
//# sourceMappingURL=Todo.route.js.map