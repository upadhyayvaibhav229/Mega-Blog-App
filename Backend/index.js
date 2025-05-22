// require('dotenv').config()

// import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"


dotenv.config({
    path: `./env`
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at PORT: ${process.env.PORT}`)
            // res.send("Hello")
        })
        app.on("error", (error) => {
            console.log('Server failed to run', error);
            throw error
        });
    })
    .catch(() => {
    console.log('MONGO db is failed to connect'); 
    
})



// to run this file use nodemon src/index.js










/*import express from "express";

const app = express();


;(async ()=>{
    // database connection
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       app.on("error", (error) => {
        console.log('error', error);
        throw error
        
       });
       app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
        
       });
        console.log("Connected to database successfully");
    } catch (error) {
        console.log("ERROR", error);
        throw error
    }
})()*/