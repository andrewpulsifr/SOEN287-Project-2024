require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://127.0.0.1:3000', // Adjust for your front-end origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use('/auth', routes); 


const PORT = 4000;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
