"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    messages: [
        {
            sender: {
                type: String,
                required: true
            },
            roomId: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ],
    subscriptions: [
        String
    ],
    subscribers: [String]
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
