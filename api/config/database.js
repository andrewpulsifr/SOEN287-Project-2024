const mysql = require('mysql');

function createConnection() {
    const dbConfig = {
        host: "localhost",
        user: "root",
        password: "",
        database: "Soen287_Database"
    };

    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.stack);
        } else {
            console.log('Connected to the database');
        }
    });

    return connection; // Return the connection instance
}

module.exports = createConnection;