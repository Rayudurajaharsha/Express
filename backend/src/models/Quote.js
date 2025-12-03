import mongoose from 'mongoose';

// Define the Schema
const QuoteSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    quote: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    }
});

// Create and export the Model
const Quote = mongoose.model('Quote', QuoteSchema);
export default Quote;