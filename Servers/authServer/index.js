import dotenv from 'dotenv';
dotenv.config(); // This is for loading environment variables
import { fileURLToPath } from 'url'; // Import fileURLToPath
import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import servicesApi from '../../api/routes/services-routes.js';
import usersApi from '../../api/routes/users-routes.js';
import { deleteExpiredTokens } from './utils.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Adjust for your front-end origin
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
