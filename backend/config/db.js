import mongoose from "mongoose";
export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected Successfully")
    }
    catch (err) {
        console.log(err)
    }
}
