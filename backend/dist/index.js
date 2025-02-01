"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./auth"));
const socketServer_1 = require("./socketServer");
const app = (0, express_1.default)();
mongoose_1.default.connect("mongodb://localhost:27017/chat-room", { bufferCommands: false })
    .then(() => { console.log("connected"); })
    .catch((err) => { console.log(err); });
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use('/auth', auth_1.default);
const server = app.listen(3000, () => { console.log("hello"); });
(0, socketServer_1.startSocketServer)(server);
