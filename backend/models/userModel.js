import mongoose from "mongoose";

const userModel=new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        enum: ["male","female"],
        required: true,
    },
    profilePhoto:{
        type: String,
        default: "",
    },
},{timestamps:true})

export const User = mongoose.model('User',userModel);