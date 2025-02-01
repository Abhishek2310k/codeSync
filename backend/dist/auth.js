"use strict";
// routes for authentication
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
const express_1 = require("express");
const user_1 = __importDefault(require("./model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// dont forget to remove the secret key
const server_secret = "secretKey";
const route = (0, express_1.Router)();
route.put('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const storedUser = yield user_1.default.findOne({ username: username });
        if (!storedUser)
            return res.json({ message: "no user of the given id" });
        if (password !== storedUser.password)
            return res.json({ message: "password incorrect" });
        const token = jsonwebtoken_1.default.sign({ username: username }, server_secret);
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
        return res.json({ message: "loggin success" });
    }
    catch (err) {
        return res.json({ message: "error while loggin in" });
    }
}));
route.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const currUser = user_1.default.findOne({ username: username });
        if (!currUser)
            return res.json({ message: "user already there" });
        const user = new user_1.default({ username: username, password: password, subscriptions: [username], subscribers: [username] });
        yield user.save();
        return res.json({ message: "sigup successful" });
    }
    catch (err) {
        console.log(err);
        return res.json({ "message": "some error while signing up" });
    }
}));
exports.default = route;
