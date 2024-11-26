import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

export const register=async(req,res)=>{
    try {
        const {fullname,username,password,confirmPassword,gender,profilePhoto}=req.body;
        if(!fullname || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({message:"all fields are required"});
        }
        if(password !== confirmPassword){
            return res.status(400).json({message:"password do not match"});
        }
        const user=await User.findOne({username});
        if(user){
            return res.status(400).json({message:"user already exist"}); 
        }
        const hashedPassword=await bcrypt.hash(password,10);

        //profile photo
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`
        const newuser=await User.create({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilePhoto:gender==='male'?maleProfilePhoto:femaleProfilePhoto,
        })
        return res.status(200).json({message:"user registered successfully",success:true})
    } catch (error) {
        console.log(error)
    }
};

export const login=async (req,res) => {
    try {
        const {username,password}=req.body;
        if(!username || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({message:"user does not exist"});
        }
        const isPasswordMatch =await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:"incorrect password"});
        }
        const tokenData={
            userId:user._id,
        }
        const token= await jwt.sign(tokenData,process.env.JWT_SECRET_KEY, {expiresIn:"1d"});
        return res.status(200).cookie("token",token, {maxAge:1*24*60*60*1000, httpOnly:true, sameSite: 'strict'}).json({
            username:user.username,
            _id:user._id,
            fullname:user.fullname,
            profilePhoto:user.profilePhoto,
        })
    } catch (error) {
        console.log(error)
    }
};

export const logout=async (req,res) => {
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logged out successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

export const getOtherUsers = async (req,res) => {
    try {
        const loggedInUserId=req.id;
        const otherUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        return res.status(200).json(otherUsers)
    } catch (error) {
        console.log(error)
    }
}