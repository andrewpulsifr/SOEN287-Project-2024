require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const servicesApi = require('../../api/routes/services-routes');
const usersApi = require('../../api/routes/users-routes');  
const { deleteExpiredTokens } = require('./utils');

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://127.0.0.1:3000', // Adjust for your front-end origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use('/auth', routes); 
app.use('/', routes);
app.use('/services', servicesApi);
app.use('/users', usersApi);

// Clean up expired refresh tokens every hour
setInterval(async () => {
    try {
        await deleteExpiredTokens();
        console.log('Expired refresh tokens cleaned up.');
    } catch (err) {
        console.error('Error cleaning up expired tokens:', err);
    }
}, 60 * 60 * 1000); // Every 1 hour


const PORT = 4000;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
