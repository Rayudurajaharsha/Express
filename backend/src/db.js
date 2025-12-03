import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

/**
 * Function to connect to MongoDB Atlas
 */
const connectDB = async () => {
    if (!MONGO_URI) {
        console.error("FATAL ERROR: MONGO_URI not defined in environment variables.");
        process.exit(1); // Exit process if critical variable is missing
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Atlas connected successfully.');
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        // Exit process with failure code
        process.exit(1);
    }
};

export default connectDB;