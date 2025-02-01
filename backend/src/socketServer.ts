import { WebSocket } from "ws";
import { socketDataParser,socketReturnParser,logOutPut} from "./util/utility";
import User from "./model/user";


interface message {
    sender:string,
    msg:string
}

const userData = new Map<string,string[]>(); // stores user -> publishers
const roomData = new Map<string,string[]>(); // stores room -> subscribers
const socketData = new Map<string,WebSocket>(); // stores user -> ws

export function startSocketServer(server:any) {
    const wss = new WebSocket.Server({server});


wss.on('connection',async (ws,req:any)=>{
    //@ts-ignore
    const username = req.headers['sec-websocket-protocol'];

    if (username !== undefined) {
        socketData.set(username,ws);

        const {subscribers,subscriptions,messages} : any = 
        await User.findOne({username:username});

        userData.set(username,subscriptions);
        roomData.set(username,subscribers);

            
        ws.send(socketReturnParser(
            "pendingMessages", 
            "success",
            {messages:messages,subscriptions:subscriptions}
        ));
    }

    else ws.send(socketReturnParser("error", "please send the username"));

    ws.on('message',async (data:any)=>{
        // console.log(data);
        const msg:any = socketDataParser(data);
         if (msg.type === "joinGroup") {
            if (msg.data) {
                const room = msg.data;
                // need to handle room join for the user given
                const tempData = userData.get(username);
                if (tempData) {
                    // if the user is already a member we just send the mesaages stored for him in the databse
                    if (tempData.length <= 4) {
                        // in this case the user can join the room
                        userData.get(username)?.push(room);
                        roomData.get(room)?.push(username);
                        await User.findOneAndUpdate({username:username},{$push:{subscriptions:room}});
                        await User.findOneAndUpdate({username:room},{$push:{subscribers:username}});
                        
                        ws.send(socketReturnParser("success",`subscribed to ${room}`));
                    }
                    else {
                        // user has exceeded the limit of groups he can join
                        ws.send(socketReturnParser("error",
                            "Please unsubscribe from any one group you have exceeded the limit",
                            userData.get(username)
                        ))
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
                    newUserSubscriptions = newUserSubscriptions.filter((value)=>value !== room)
                    userData.set(username,newUserSubscriptions);
                    await User.findOneAndUpdate({username:username},{$set:{subsciptions:newUserSubscriptions}});
                }

                let newSubList = roomData.get(room);
                newSubList = newSubList?.filter((value)=>value !== username);
                if (newSubList) {
                    roomData.set(room,newSubList);
                    await User.findOneAndUpdate({username:room},{$set:{subscribers:newSubList}});
                }
            }
            ws.send(socketReturnParser("success","left the room ${room}"));
        }
        
        
        else if (msg.type === "addMessage") {
            if (msg.data) {
                const {room,sender,data} = msg.data;
                if (roomData.get(room)?.includes(sender)) {
                    roomData.get(room)?.forEach(async (value)=>{
                        if (value !== sender) {
                            const ws:WebSocket | undefined = socketData.get(value);
                            if (ws) {
                                ws.send(socketReturnParser("message",data));
                            }
                            else {
                                console.log(`offline user ${value}`);
                                await User.findOneAndUpdate({username:value},
                                    {
                                        $push: { 
                                            messages:
                                                {
                                                    sender:username,
                                                    roomId:room,
                                                    message:data
                                                }
                                        }
                                    }
                                );
                            }
                        }
                    });
                }
                else {
                    ws.send(socketReturnParser("fail","you are not member"));
                }
            }
        }
        // logOutPut(userData,roomData);
    })

    ws.on('close',()=>{
        socketData.delete(username);
        userData.delete(username);
    })
    // logOutPut(userData,roomData);
})
}