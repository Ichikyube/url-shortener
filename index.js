require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlMap = new Map();

// Endpoint to create a shortened URL
app.post('/api/shorturl', (req, res) => {
  const isURL = (input) => {
    // URL format regex
    const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z]{2,})+(?:\/[^/#?]+)*(?:\/[^/#?]+\/?)?(?:\?[^#?]+)?(?:#.*)?$/i;
    
    // Test the input against the regex
    return urlRegex.test(input);
  }
  const originalUrl = req.body.url; // Assuming the long URL is provided in the request body

  if (!isURL(originalUrl)) {
    return res.status(400).json({ "error":"Invalid URL" });
  }
  // Generate a unique short alias (e.g., using a hashing algorithm or an incremental ID)
  //const shortUrl = generateShortAlias();
  const shortUrl = urlMap.size + 1;
  urlMap.set(shortUrl, originalUrl);  // Store the URL mapping

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to redirect to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url, 10);

  if (!urlMap.has(shortUrl)) {
    return res.status(404).json({ error: 'invalid url' });
  }

  const originalUrl = urlMap.get(shortUrl);
  res.redirect(originalUrl);

});
 
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
