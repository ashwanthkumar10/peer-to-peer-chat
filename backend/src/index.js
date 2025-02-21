import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js"
import { app , server } from "./lib/socket.js"
import path from "path"

dotenv.config()





const PORT = process.env.PORT;
const __dirname = path.resolve()
//Parses the data as json format
app.use(express.json())
app.use((req, res, next) => {
    console.log("Headers received:", req.headers);
    next();
});
//Parses the Cokkies
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

//auth Middleware
app.use("/api/auth" , authRoutes)
app.use("/api/messages" , messageRoutes)


if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    
    app.get("*" , (req , res)=>{
        res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"))
    })
}

server.listen(PORT,()=>{
    console.log('Server is running .....' + PORT);
    connectDB();
    
})