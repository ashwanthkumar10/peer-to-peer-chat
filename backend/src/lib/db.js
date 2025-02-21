import mongoose from "mongoose"

export const connectDB = async ()=>{
    try {
        console.log("Connecting to MongoDB URI:", process.env.MONGODB_URI);  // ✅ Debug Log
        
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
        
        
    } catch (error) {
        console.log("MongoDb Connection Error :", error);
        
        
    }
} 