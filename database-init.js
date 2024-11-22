const DatabaseConnect = require('./api/utils/DatabaseConnect'); // Adjust the path as necessary

function connectToDatabase() {
    // Set database configuration
    const dbConfig = {
        host: "localhost",
        user: "root",
        password: "",
        database: "Soen287_Database"
    };

    const db = new DatabaseConnect(dbConfig);
    db.connect();
    return db; // Return the database instance for further use
}

module.exports = connectToDatabase;