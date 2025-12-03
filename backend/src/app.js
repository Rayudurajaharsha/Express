import express from "express";
import dotenv from 'dotenv';
import connectDB from './db.js';
import Quote from './models/Quote.js';

// Load environment variables
dotenv.config();

// Initialize App
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// --- BASE ROUTES ---

app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Hello from Express inside a Dev Container!", name: "Rayudu Rajaharsha" });
});

app.get("/health", (req, res) => {
    res.status(200).send("healthy");
});

// --- MATH ROUTES (Unchanged) ---
app.get('/math/circle/:r', (req, res) => {
    const radius = parseFloat(req.params.r);
    if (isNaN(radius) || radius < 0) {
        return res.status(400).json({ error: "Radius must be a non-negative number." });
    }
    res.json({ area: Math.PI * radius * radius, circumference: 2 * Math.PI * radius });
});

app.get('/math/rectangle/:width/:height', (req, res) => {
    const width = parseFloat(req.params.width);
    const height = parseFloat(req.params.height);
    if (isNaN(width) || isNaN(height) || width < 0 || height < 0) {
        return res.status(400).json({ error: "Width and height must be non-negative numbers." });
    }
    res.json({ area: width * height, perimeter: 2 * (width + height) });
});

app.get('/math/power/:base/:exponent', (req, res) => {
    const base = parseFloat(req.params.base);
    const exponent = parseFloat(req.params.exponent);
    if (isNaN(base) || isNaN(exponent)) {
        return res.status(400).json({ error: "Base and exponent must be numbers." });
    }
    const response = { result: Math.pow(base, exponent) };
    if (req.query.root === 'true') {
        const root = Math.sqrt(base);
        if (isNaN(root)) return res.status(400).json({ error: "Cannot root negative base." });
        response.root = root;
    }
    res.json(response);
});

// --- QUOTEBOOK ROUTES (CRUD Operations) ---

// 1. READ: Get all unique categories
app.get('/quotebook/categories', async (req, res) => {
    try {
        const categories = await Quote.distinct('category');
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Database error fetching categories.' });
    }
});

// 2. READ: Get a random quote from a specific category
app.get('/quotebook/quote/:category', async (req, res) => {
    try {
        const category = req.params.category.toLowerCase();

        const randomQuote = await Quote.aggregate([
            { $match: { category: category } },
            { $sample: { size: 1 } }
        ]);

        if (randomQuote.length === 0) {
            return res.status(404).json({ error: `No quotes found for ${category}` });
        }

        // Return the whole object including _id so users can copy it for DELETE/PUT
        res.json(randomQuote[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error retrieving quote.' });
    }
});

// 3. CREATE: Add a new quote
app.post('/quotebook/quote/new', async (req, res) => {
    const { category, quote, author } = req.body;

    if (!category || !quote || !author) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const newQuote = new Quote({ category, quote, author });
        await newQuote.save();
        res.status(201).json({ message: "Quote added successfully", data: newQuote });
    } catch (error) {
        res.status(500).json({ error: 'Database error saving quote.' });
    }
});

// 4. DELETE: Remove a quote by ID
app.delete('/quotebook/quote/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuote = await Quote.findByIdAndDelete(id);

        if (!deletedQuote) {
            return res.status(404).json({ error: "Quote not found." });
        }

        res.json({ message: "Quote deleted successfully", data: deletedQuote });
    } catch (error) {
        res.status(500).json({ error: 'Database error deleting quote.' });
    }
});

// 5. UPDATE: Modify a quote by ID
app.put('/quotebook/quote/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category, quote, author } = req.body;

        // Find by ID and update. { new: true } returns the updated document.
        const updatedQuote = await Quote.findByIdAndUpdate(
            id,
            { category, quote, author },
            { new: true, runValidators: true }
        );

        if (!updatedQuote) {
            return res.status(404).json({ error: "Quote not found." });
        }

        res.json({ message: "Quote updated successfully", data: updatedQuote });
    } catch (error) {
        res.status(500).json({ error: 'Database error updating quote.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});