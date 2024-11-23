require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());

app.use('/auth', routes); 

const PORT = 4000;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
