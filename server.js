const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set port
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client-login.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}`);
});