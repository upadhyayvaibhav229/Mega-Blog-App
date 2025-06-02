import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: [process.env.CORS_ORIGIN, "*"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));   

// Routes after middleware
import authRouter from "./Routes/auth.routes.js"
app.use("/api/auth", authRouter)

import postRouter from "./Routes/post.routes.js"
app.use("/api/posts", postRouter)

export { app }  
