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
exports.startSocketServer = void 0;
const ws_1 = require("ws");
const utility_1 = require("./util/utility");
const user_1 = __importDefault(require("./model/user"));
const userData = new Map(); // stores user -> publishers
const roomData = new Map(); // stores room -> subscribers
const socketData = new Map(); // stores user -> ws
function startSocketServer(server) {
    const wss = new ws_1.WebSocket.Server({ server });
    wss.on('connection', (ws, req) => __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore
        const username = req.headers.username;
        // console.log(username)
        if (username) {
            socketData.set(username, ws);
            if (!userData.has(username)) {
                const { subscribers, subsciptions } = yield user_1.default.findOne({ username: username });
                userData.set(username, subsciptions);
                roomData.set(username, subscribers);
                // the list of users in the room are now set
            }
            ws.send((0, utility_1.socketReturnParser)("success", "socket connection created"));
        }
        else
            ws.send("please send the username");
        ws.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const msg = (0, utility_1.socketDataParser)(data);
            if (msg.type === "joinGroup") {
                if (msg.data) {
                    const room = msg.data;
                    // need to handle room join for the user given
                    const tempData = userData.get(username);
                    if (tempData) {
                        if (tempData.length <= 4) {
                            // in this case the user can join the room
                            (_a = userData.get(username)) === null || _a === void 0 ? void 0 : _a.push(room);
                            (_b = roomData.get(room)) === null || _b === void 0 ? void 0 : _b.push(username);
                            yield user_1.default.findOneAndUpdate({ username: username }, { $push: { subsciptions: room } });
                            yield user_1.default.findOneAndUpdate({ username: room }, { $push: { subscribers: username } });
                            ws.send((0, utility_1.socketReturnParser)("success", `subscribed to ${room}`));
                        }
                        else {
                            // user has exceeded the limit of groups he can join
                            ws.send((0, utility_1.socketReturnParser)("error", "Please unsubscribe from any one group you have exceeded the limit", userData.get(username)));
                        }
                    }
                }
            }
            else if (msg.type === "leaveGroup") {
                if (msg.data) {
                    const room = msg.data;
                    let newUserSubscriptions = userData.get(username);
                    if (newUserSubscriptions) {
                        // remove from the subscriptions or the user data
                        newUserSubscriptions = newUserSubscriptions.filter((value) => value !== room);
                        userData.set(username, newUserSubscriptions);
                        yield user_1.default.findOneAndUpdate({ username: username }, { $set: { subsciptions: newUserSubscriptions } });
                    }
                    let newSubList = roomData.get(room);
                    newSubList = newSubList === null || newSubList === void 0 ? void 0 : newSubList.filter((value) => value !== username);
                    if (newSubList) {
                        roomData.set(room, newSubList);
                        yield user_1.default.findOneAndUpdate({ username: room }, { $set: { subscribers: newSubList } });
                    }
                }
                ws.send((0, utility_1.socketReturnParser)("success", "left the room ${room}"));
            }
            else if (msg.type === "addMessage") {
                if (msg.data) {
                    const { room, sender, data } = msg.data;
                    // for sender to send the data the sender must be in the subscriber list for that room
                    if ((_c = roomData.get(room)) === null || _c === void 0 ? void 0 : _c.includes(sender)) {
                        // in this position we have the message addition logic
                        // lets first go over the list of all of the online members of the group
                        (_d = roomData.get(room)) === null || _d === void 0 ? void 0 : _d.forEach((value) => __awaiter(this, void 0, void 0, function* () {
                            if (value !== sender) {
                                // the message will be pushed to all of the other online members of the group
                                const ws = socketData.get(value);
                                if (ws) {
                                    ws.send((0, utility_1.socketReturnParser)("message", data));
                                }
                                else {
                                    // if data base fails at this point we cant do anything
                                    // user ka moi moi ho jaega bc
                                    console.log(`offline user ${value}`);
                                    // correct value for the username is confirmed
                                    // what can be the reason for mongo db not doing what its supposed to do
                                    yield user_1.default.findOneAndUpdate({ username: value }, {
                                        $push: {
                                            messages: {
                                                sender: username,
                                                roomId: room,
                                                message: data
                                            }
                                        }
                                    });
                                    // i think this should push the data into the messages queue
                                }
                            }
                        }));
                    }
                    else {
                        ws.send((0, utility_1.socketReturnParser)("fail", "you are not member"));
                    }
                }
            }
            (0, utility_1.logOutPut)(userData, roomData);
        }));
        (0, utility_1.logOutPut)(userData, roomData);
    }));
}
exports.startSocketServer = startSocketServer;
