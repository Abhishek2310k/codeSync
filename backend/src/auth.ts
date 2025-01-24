// routes for authentication

import { Router } from "express";
import { Response,Request} from "express";
import User from "./model/user";
import jwt from "jsonwebtoken";

// dont forget to remove the secret key
const server_secret = "secretKey";
const route = Router();

route.put('/login',async (req:Request, res:Response): Promise<any> => {
    try {
        const {username,password} = req.body;
        const storedUser = await User.findOne({username:username});
        if (!storedUser) return res.json({message:"no user of the given id"});
        if (password !== storedUser.password) return res.json({message:"password incorrect"}); 
        const token = jwt.sign({username:username},server_secret);

        res.cookie("token",token);
        return res.json({message:"loggin success"});
    } catch(err) {
        return res.json({message:"error while loggin in"});
    }
});

route.post('/post',async (req:Request,res:Response):Promise<any> => {
    try {

        const {username,password} = req.body;
        const user = new User({username:username,password:password,subsciptions:[username],subscribers:[username]});
        await user.save();

        return res.json({message:"sigup successful"});
    } catch (err) {
        console.log(err);
        return res.json({"message":"some error while signing up"});
    }
})

export default route;