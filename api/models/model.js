const connection = require('../config/database');

// Create Users table
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Email VARCHAR(255) NOT NULL UNIQUE,
        Password VARCHAR(255) NOT NULL,
        Role ENUM('Client', 'Admin') NOT NULL,
        Name VARCHAR(255) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Create Admins table
const createAdminsTable = `
    CREATE TABLE IF NOT EXISTS Admins (
        AdminID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        BusinessName VARCHAR(255) NOT NULL,
        About TEXT,
        BusinessLogo VARCHAR(255),
        Category VARCHAR(255),
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
    );
`;

// Create Clients table (optional if you keep separate client-specific data)
const createClientsTable = `
    CREATE TABLE IF NOT EXISTS Clients (
        ClientID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        Address TEXT,
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
    );
`;

// Create Services table
const createServicesTable = `
    CREATE TABLE IF NOT EXISTS Services (
        ServiceID INT AUTO_INCREMENT PRIMARY KEY,
        Title VARCHAR(255) NOT NULL,               
        Category VARCHAR(255) NOT NULL,
        Description TEXT NOT NULL,
        Price DECIMAL(10, 2) NOT NULL,             
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;
// Create ClientServices table (links clients to services)
const createClientServicesTable = `
    CREATE TABLE IF NOT EXISTS ClientServices (
        ClientServiceID INT AUTO_INCREMENT PRIMARY KEY,
        ClientID INT NOT NULL,                      -- References Clients table
        ServiceID INT NOT NULL,                     -- References Services table
        Status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
        AssignedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        DueDate DATE DEFAULT NULL,                  -- Due date for the service completion
        DateFulfilled DATE DEFAULT NULL,            -- Date the service was completed
        PaymentStatus ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
        Completed BOOLEAN DEFAULT FALSE,            -- Service completion flag
        FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)
        ON DELETE CASCADE,                         -- Delete client-related service when client is deleted
        FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID)
        ON DELETE CASCADE                          -- Delete the service entry when a service is deleted
    );
`;

// Create RefreshTokens table
const createRefreshTokensTable = `
    CREATE TABLE IF NOT EXISTS RefreshTokens (
        TokenID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        Token VARCHAR(255) NOT NULL,
        ExpiresAt TIMESTAMP NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
    );
`;

// Create ColorPalette table
const createColorPaletteTable = `
    CREATE TABLE IF NOT EXISTS ColorPalette (
        PaletteID INT AUTO_INCREMENT PRIMARY KEY,
        AdminID INT NOT NULL,
        PrimaryColor VARCHAR(7) NOT NULL,
        SecondaryColor VARCHAR(7) NOT NULL,
        TertiaryColor VARCHAR(7) NOT NULL,
        FOREIGN KEY (AdminID) REFERENCES Admins(AdminID)
        ON DELETE CASCADE
    );
`;

function tableCreation(){
    // Execute table creation queries
    connection.query(createUsersTable, (err, results) => {
        if (err) {
            console.error('Error creating Users table:', err.message);
        } else {
            console.log('Users table created or already exists:', results);
        }
    });
    connection.query(createClientServicesTable, (err, results) => {
        if (err) {
            console.error('Error creating Users table:', err.message);
        } else {
            console.log('Users table created or already exists:', results);
        }
    });

    connection.query(createAdminsTable, (err, results) => {
        if (err) {
            console.error('Error creating Admins table:', err.message);
        } else {
            console.log('Admins table created or already exists:', results);
        }
    });

    connection.query(createClientsTable, (err, results) => {
        if (err) {
            console.error('Error creating Clients table:', err.message);
        } else {
            console.log('Clients table created or already exists:', results);
        }
    });

    connection.query(createServicesTable, (err, results) => {
        if (err) {
            console.error('Error creating Services table:', err.message);
        } else {
            console.log('Services table created or already exists:', results);
        }
    });

    connection.query(createRefreshTokensTable, (err, results) => {
        if (err) {
            console.error('Error creating RefreshTokens table:', err.message);
        } else {
            console.log('RefreshTokens table created or already exists:', results);
        }
    });

    connection.query(createColorPaletteTable, (err, results) => {
        if (err) {
            console.error('Error creating ColorPalette table:', err.message);
        } else {
            console.log('ColorPalette table created or already exists:', results);
        }
    });
}

tableCreation();