import express from "express";
import dotenv from 'dotenv';
import connectDB from './db.js'; // Ensure db.js is in the same folder (src)
import Quote from './models/Quote.js'; // Ensure models/Quote.js exists

// Load environment variables
dotenv.config();

// Initialize App
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// --- ROUTES ---

app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Hello from Express inside a Dev Container!", name: "Rayudu Rajaharsha" });
});

app.get("/health", (req, res) => {
    res.status(200).send("healthy");
});

// Math Routes
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

// --- Quotebook Routes (MongoDB) ---

app.get('/quotebook/categories', async (req, res) => {
    try {
        const categories = await Quote.distinct('category');
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Database error fetching categories.' });
    }
});

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
        res.json({ quote: randomQuote[0].quote, author: randomQuote[0].author });
    } catch (error) {
        res.status(500).json({ error: 'Database error retrieving quote.' });
    }
});

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

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});