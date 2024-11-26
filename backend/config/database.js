import mongoose from "mongoose";

const dbConnection= ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then((res)=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log("error in connection"+err);
    })
}

export default dbConnection;