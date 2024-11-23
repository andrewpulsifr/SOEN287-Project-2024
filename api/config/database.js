const mysql = require('mysql2/promise');

function createConnection() {
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || "Soen287_Database",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };

    try {
        const connection = mysql.createPool(dbConfig); // Use a connection pool for better performance
        console.log('Connected to the database pool');
        return connection; // Return the pool instance
    } catch (error) {
        console.error('Error creating the database pool:', error.message);
        throw error;
    }
}

module.exports = createConnection;
