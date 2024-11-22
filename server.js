const express = require('express');
const mysql = require("mysql");
const path = require('path');
const app = express();
const routes = require('./routes/routes');
const bodyParser = require('body-parser');

// Serve static files from the "public" directory
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set port
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client-login.html'));
});

app.use(bodyParser.json());

// Connect to the MySQL database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Soen287_Database"
});

db.connect((err) => { // Corrected here
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    } else {
        console.log('Connected to the database');
    }
});

app.use('/api', routes);


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}`);
});

