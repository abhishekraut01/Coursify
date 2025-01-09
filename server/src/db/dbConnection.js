import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected successfully at host: ${connectionInstance.connection.host}, database: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); 
    }
};

export default dbConnection;