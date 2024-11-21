const connection = require('./database'); 


const createServicesTable = `
    CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(255) NOT NULL UNIQUE,
        client_id INT NOT NULL,
        category VARCHAR(255),
        description TEXT,
        date_of_request DATE,
        due_date DATE,
        date_fulfilled DATE,
        price DECIMAL(10, 2),
        payment_status ENUM('paid', 'unpaid'),
        completed BOOLEAN,
        FOREIGN KEY (client_id) REFERENCES clients(id)
    );
`;

connection.query(createServicesTable, (err, results) => {
    if (err) {
        console.error('Error creating Services table:', err.message);
    } else {
        console.log('Services table created or already exists:', results);
    }
});