import mysql from 'mysql';

function createConnection() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'Soen287_Database',
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.stack);
            return;
        }
        console.log('Connected to the database');
    });

    return connection;
}

export default createConnection;
