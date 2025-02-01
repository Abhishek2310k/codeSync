import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    messages: [
        {
            sender:{
                type: String,
                required: true
            }, 
            roomId: {
                type: String, 
                required: true
            },
            message:{
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

const User = mongoose.model('User',userSchema);

export default User;