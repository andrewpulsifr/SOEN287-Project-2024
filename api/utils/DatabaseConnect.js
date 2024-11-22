const mysql = require('mysql');

class DatabaseConnect {
    constructor(config) {
        if (!config) {
            throw new Error("Database configuration is required.");
        }
        this.connection = mysql.createConnection(config);
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err.stack);
            } else {
                console.log('Connected to the database');
            }
        });
    }

    disconnect() {
        this.connection.end((err) => {
            if (err) {
                console.error('Error disconnecting from the database:', err.stack);
            } else {
                console.log('Disconnected from the database');
            }
        });
    }

    getConnection() {
        return this.connection;
    }
}

module.exports = DatabaseConnect;