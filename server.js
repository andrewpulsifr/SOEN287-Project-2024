require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const connectToDatabase = require('./database-init'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');

app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 
const routes = require('./routes/routes');
const bodyParser = require('body-parser');

// Serve static files from the "public" directory
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const db = connectToDatabase(); 

// Set port
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client-login.html'));
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}`);
});