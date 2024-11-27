import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import database from '../../api/models/model.js'
import servicesApi from '../../api/routes/services-routes.js';
import usersApi from '../../api/routes/users-routes.js';
import configRoutes from './config-routes.js';
import businessRoutes from '../../api/routes/business-routes.js';
import tableCreation from '../../api/models/model.js';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
tableCreation();
// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, '../../public')));

// Routes
app.use('/services', servicesApi);
app.use('/users', usersApi);
app.use('/config', configRoutes); 
app.use('/business', businessRoutes);

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'client-login.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Main server running on http://127.0.0.1:${port}`);
});
