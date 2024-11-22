require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const path = require('path');
const createConnection = require('../../api/config/database'); // Adjust the path if necessary


const app = express();
app.use(express.json());

// Serve static HTML for the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-login.html'));
});

app.use('/', routes);

// Serve static files from the "public" directory
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const dbConnection = createConnection(); 

// Set port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Main server running on http://127.0.0.1:${port}`);
});
