import createConnection from '../config/database.js';
const db = createConnection(); 

export const submitBusinessConfig = async ({ business_name, about_section, primary_color, secondary_color, accent_color}) => {
    try {
        const query = `
            INSERT INTO businessconfig 
            (business_name, about_section, primary_color, secondary_color, accent_color) 
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [business_name, about_section, primary_color, secondary_color, accent_color];

        
        const [result] = await db.query(query, values);

        
        return result;
    } catch (error) {
        console.error('Database save error:', error);
        throw error; 
    }
};

export default {
    submitBusinessConfig
}