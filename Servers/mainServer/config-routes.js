import express from 'express';
import createConnection from '../../api/config/database.js'; // Ensure createConnection is exported properly


const db = createConnection(); // Assuming createConnection returns a database connection object
const router = express.Router();

router.post('/submit-config', async (req, res) => {
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

router.get('/get-config', async (req, res) => {
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

export default router;
