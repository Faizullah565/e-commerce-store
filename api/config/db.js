
import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const url = process.env.MONGO_URI
        await mongoose.connect(url)
        console.log("MongoDB connected Successfuly")
    } catch (error) {
        console.log("MongoDB connection error", error.message)        
    }
}

export default connectDB
