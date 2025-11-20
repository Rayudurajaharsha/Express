import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Hello from Express inside a Dev Container!", name: "Rayudu Rajaharsha" });
});

app.get("/health", (req, res) => {
    res.status(200).send("healthy");
});
app.get('/math/circle/:r', (req, res) => {
    const radius = parseFloat(req.params.r);

    const area = 3.14 * radius * radius;

    const circumference = 3.14 * 2 * radius;

    if (isNaN(radius)) {
        return res.status(400).json({
            "error": "The radius parameter must be a number."
        });
    }

    res.json({
        "area": area,
        "circumference": circumference
    });
});
app.get('/math/rectangle/:width/:height', (req, res) => {

    const width = parseFloat(req.params.width);
    const height = parseFloat(req.params.height);

    if (isNaN(width) || isNaN(height)) {
        return res.status(400).json({
            "error": "Both width and height parameters must be numbers."
        });
    }

    const area = width * height;

    const perimeter = 2 * (width + height);

    res.json({
        "area": area,
        "perimeter": perimeter
    });
});
app.get('/math/power/:base/:exponent', (req, res) => {
    const base = parseFloat(req.params.base);
    const exponent = parseFloat(req.params.exponent);

    if (isNaN(base) || isNaN(exponent)) {
        return res.status(400).json({
            "error": "Both base and exponent parameters must be numbers."
        });
    }

    const result = Math.pow(base, exponent);

    const response = {
        "result": result
    };

    if (req.query.root === 'true') {
        const root = Math.sqrt(base);
        response.root = root;
    }

    res.json(response);
});
app.get('/quotebook/categories', (req, res) => {
    const categories = Object.keys(quotes);
    const responseText = categories.map(category =>
        `A possible category is ${category}`
    ).join('\n');

    res.type('text/plain').send(responseText);
});
app.get('/quotebook/quote/:category', (req, res) => {
    const category = req.params.category;
    const categoryQuotes = quotes[category];

    if (!categoryQuotes) {
        return res.status(400).json({
            "error": `no category listed for ${category}`
        });
    }

    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    const randomQuote = categoryQuotes[randomIndex];

    res.json(randomQuote);
});
app.post('/quotebook/quote/new', (req, res) => {
    const { category, quote, author } = req.body;

    if (!category || !quote || !author || !quotes.hasOwnProperty(category)) {
        return res.status(400).json({
            "error": "invalid or insufficient user input"
        });
    }

    quotes[category].push({
        quote: quote,
        author: author
    });

    res.status(200).type('text/plain').send('Success!');
});
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});