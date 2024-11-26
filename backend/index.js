import express from 'express'
import dotenv from "dotenv"
import dbConnection from './config/database.js';
import userRouter from "./routes/userRoute.js"
import cookieParser from 'cookie-parser';
import messageRoute from './routes/messageRoute.js'
import cors from 'cors'
dotenv.config({path:"./.env"});
const app=express();
const PORT=process.env.PORT || 8080;
const corsOption={
    origin:'http://localhost:3000',
    credentials:true,
};

//middleware
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors(corsOption));

//routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/message",messageRoute)


app.listen(PORT,()=>{
    dbConnection()
    console.log(`server is running on port ${PORT}`);
})