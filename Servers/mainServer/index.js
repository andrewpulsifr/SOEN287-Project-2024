require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const routes = require('./routes');
const path = require('path');
const createConnection = require('../../api/config/database'); // Adjust the path if necessary
const createTables = require('../../api/models/model');
const servicesApi = require('../../api/routes/services-routes');
const usersApi = require('../../api/routes/users-routes');  


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static HTML for the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'client-login.html'));
});

app.use('/', routes);
app.use('/services', servicesApi);
app.use('/users', usersApi);

// Serve static files from the "public" directory
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../public')));
const db = createConnection(); 





app.post('/submit-config', async (req, res) => {
  const { title, description, primaryColor, secondaryColor, accentColor } = req.body;

  const query = `
      INSERT INTO businessconfig (business_name, about_section, primary_color, secondary_color, accent_color) 
      VALUES (?, ?, ?, ?, ?)
  `;
  const values = [title, description, primaryColor, secondaryColor, accentColor];

  try {
      const [result] = await db.execute(query, values);
      res.status(200).json({ message: 'Configuration saved successfully!', result });
  } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Database error' });
  }
});

app.get('/get-config', async (req, res) => {
  const query = `SELECT * FROM businessconfig ORDER BY created_at DESC LIMIT 1`;

  try {
      const [rows] = await db.execute(query);
      if (rows.length > 0) {
          res.status(200).json(rows[0]);
      } else {
          res.status(404).json({ error: 'No configuration found' });
      }
  } catch (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'Database error' });
  }
});


// Set port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Main server running on http://127.0.0.1:${port}`);
});
