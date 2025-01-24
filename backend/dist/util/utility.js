"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutPut = exports.socketReturnParser = exports.socketDataParser = void 0;
function socketDataParser(data) {
    const ipString = data.toString();
    const dataObj = JSON.parse(ipString);
    return dataObj;
}
exports.socketDataParser = socketDataParser;
function socketReturnParser(type, message, data) {
    return JSON.stringify({ type: type, message: message, data: data });
}
exports.socketReturnParser = socketReturnParser;
function logOutPut(userData, roomData) {
    console.group("User Data");
    console.table(Array.from(userData.entries()), ["0", "1"]);
    console.groupEnd();
    console.group("Room Data");
    console.table(Array.from(roomData.entries()), ["0", "1"]);
    console.groupEnd();
    console.log("\n <---------------Message end ----------------->");
}
exports.logOutPut = logOutPut;
