import createConnection from '../config/database.js';
const pool = createConnection(); 
import bcrypt from 'bcrypt';

// Pre-hash admin password
const adminPassword = bcrypt.hashSync('adminPassword', 10); // Replace with dynamic hashing if needed

// Create Users table
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Email VARCHAR(255) NOT NULL UNIQUE,
        Password VARCHAR(255) NOT NULL,
        Role ENUM('Client', 'Admin') NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Create Admins table
const createAdminsTable = `
    CREATE TABLE IF NOT EXISTS Admins (
        AdminID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL UNIQUE,
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
        FirstName VARCHAR(255) NOT NULL,
        LastName VARCHAR(255) NOT NULL,
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
    Image LONGTEXT,
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
        ExpiresAt DATETIME NOT NULL,
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
const createbusiness_config=
`CREATE TABLE IF NOT EXISTS businessconfig (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    about_section TEXT NOT NULL,
    primary_color VARCHAR(7) NOT NULL, -- Hexadecimal color code
    secondary_color VARCHAR(7) NOT NULL, -- Hexadecimal color code
    accent_color VARCHAR(7) NOT NULL, -- Hexadecimal color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Automatically sets the current timestamp
);`

const createAdminUser = `
    INSERT INTO Users (Email, Password, Role)
    SELECT ?, ?, 'Admin'
    WHERE NOT EXISTS (
        SELECT 1 FROM Users WHERE Email = ?
    );
`;

const createAdminEntry = `
    INSERT INTO Admins (UserID, BusinessName, About, BusinessLogo, Category)
    SELECT UserID, 'Cool Business Name', 'Default About', 'http://localhost:3000/Images/default.png', 'Cool Category'
    FROM Users
    WHERE Email = ?
        AND NOT EXISTS (
            SELECT 1 FROM Admins WHERE UserID = (
                SELECT UserID FROM Users WHERE Email = ?
            )
        );
`;


async function tableCreation() {
    try {
        // Use 'await' for querying since we're working with promises
        await pool.query(createUsersTable);
        console.log('Users table created or already exists.');

        await pool.query(createAdminsTable);
        console.log('Admins table created or already exists.');

        await pool.query(createbusiness_config);
        console.log("Business Config Table Created or exists.")

        // Execute other table creation queries
        await pool.query(createClientsTable);
        console.log('Clients table created or already exists.');

        await pool.query(createServicesTable);
        console.log('Services table created or already exists.');

        await pool.query(createClientServicesTable);
        console.log('ClientServices table created or already exists.');

        await pool.query(createRefreshTokensTable);
        console.log('RefreshTokens table created or already exists.');

        await pool.query(createColorPaletteTable);
        console.log('ColorPalette table created or already exists.');

        const email = 'admin@example.com';
        const hashedPassword = bcrypt.hashSync('adminPassword', 10);

        await pool.query(createAdminUser, [email, hashedPassword, email]);
        console.log('Admin user created or already exists.');

        await pool.query(createAdminEntry, [email, email]);
        console.log('Admin account created or already exists.');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    }
}

export default tableCreation;