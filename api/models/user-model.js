const connection = require('../config/database');
const pool = connection(); 


async function getClientById(clientId) {
    try {
        const [result] = await pool.query("SELECT * FROM Clients WHERE ClientID = ?", [clientId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getClientByUserId(userId) {
    try {
        const [result] = await pool.query("SELECT * FROM Clients WHERE UserID = ?", [userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getUserById(userId) {
    try {
        const [result] = await pool.query("SELECT * FROM Users WHERE UserID = ?", [userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getUserByEmail(email) {
    try {
        const [result] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function updateUser(userId, userData) {
    try {
        const [result] = await pool.query("UPDATE Users SET ? WHERE UserID = ?", [userData, userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function deleteUser(userId) {
    try {
        const [result] = await pool.query("DELETE FROM Users WHERE UserID = ?", [userId]);
        return result;
    } catch (err) {
        throw err;
    }
}

async function getAllServicesByClientId(clientId) {
    try {
        // Query to get all services that the client has requested (using ClientID)
        const [services] = await pool.query(
            `SELECT s.* 
            FROM Services s
            JOIN ClientServices cs ON cs.ServiceID = s.ServiceID
            WHERE cs.ClientID = ?`, 
            [clientId]
        );
        return services;  // Return the full service objects
    } catch (err) {
        console.error("Error fetching services by client ID:", err);
        throw err;  // Propagate the error to be handled by the controller
    }
}

module.exports = {
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    getClientById,
    getClientByUserId,
    getAllServicesByClientId,
};
