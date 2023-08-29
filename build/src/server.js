"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const Todo_route_1 = __importDefault(require("./routes/Todo.route"));
const app = new app_1.default([
    new Todo_route_1.default()
]);
app.listen();
//# sourceMappingURL=server.js.map