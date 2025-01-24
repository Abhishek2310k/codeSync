import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoute from "./auth";
import { startSocketServer } from "./socketServer";

const app = express();
mongoose.connect("mongodb://localhost:27017/chat-room",{bufferCommands:false})
.then(()=>{console.log("connected")})
.catch((err)=>{console.log(err)})
;

app.use(bodyParser.json());
app.use(cors({
    origin:"*",
    credentials:true
}));
app.use('/auth',authRoute);

const server = app.listen(3000,()=>{console.log("hello")});
startSocketServer(server);
